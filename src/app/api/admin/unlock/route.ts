import { NextResponse } from "next/server";
import {
  createSession,
  passwordsMatch,
  SESSION_SECONDS,
} from "@/lib/admin/session";
import { rateLimit, readJson, failure } from "@/lib/security/request";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json(
      { error: "Request not allowed." },
      { status: 403 },
    );
  }
  let payload;
  try {
    payload = await readJson(request);
    await rateLimit(request, "admin-login", 5, 900);
  } catch (error) {
    return failure(error);
  }
  const password = payload?.password;
  const expected = process.env.ALEPH_ADMIN_PASSWORD;

  if (!expected || !passwordsMatch(password, expected)) {
    return NextResponse.json(
      { error: "Invalid admin password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("aleph_admin", createSession(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });

  return response;
}
