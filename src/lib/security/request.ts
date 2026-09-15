import { createHmac } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export class RequestError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function requireSameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    throw new RequestError("Request not allowed.", 403);
}
export async function readBody(request: Request, maxBytes = 8192) {
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError("Request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > maxBytes) {
      await reader.cancel();
      throw new RequestError("Request is too large.", 413);
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new RequestError("JSON is required.", 415);
  const raw = await readBody(request);
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error();
    return data as Record<string, unknown>;
  } catch {
    throw new RequestError("Invalid request.");
  }
}
export async function rateLimit(
  request: Request,
  scope: string,
  max: number,
  seconds: number,
  identifier?: string,
) {
  const secret = process.env.ALEPH_RATE_LIMIT_SECRET;
  if (!secret)
    throw new RequestError("This service is temporarily unavailable.", 503);
  // Only the Vercel-supplied address is used; other hosts share a conservative bucket.
  const ip = process.env.VERCEL
    ? (request.headers.get("x-vercel-forwarded-for") ?? "unknown")
    : "local";
  const key = createHmac("sha256", secret)
    .update(`${scope}:${identifier ?? ip}`)
    .digest("hex");
  const { data, error } = await getSupabaseAdmin().rpc("aleph_rate_limit", {
    p_key: key,
    p_max: max,
    p_seconds: seconds,
  });
  if (error)
    throw new RequestError("This service is temporarily unavailable.", 503);
  if (!data)
    throw new RequestError("Too many attempts. Please try again later.", 429);
}
export function failure(error: unknown) {
  const status = error instanceof RequestError ? error.status : 503;
  return Response.json(
    {
      error:
        error instanceof RequestError
          ? error.message
          : "This service is temporarily unavailable. Please try again later.",
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(status === 429 ? { "Retry-After": "3600" } : {}),
      },
    },
  );
}
