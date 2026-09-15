import { Webhook } from "svix";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { readBody, failure } from "@/lib/security/request";
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "Unavailable" }, { status: 503 });
  let event: { type: string; data: { email_id: string } };
  const id = request.headers.get("svix-id") ?? "";
  let raw: string;
  try {
    raw = await readBody(request, 65536);
  } catch (error) {
    return failure(error);
  }
  try {
    event = new Webhook(secret).verify(raw, {
      "svix-id": id,
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    }) as unknown as typeof event;
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (
    ![
      "email.delivered",
      "email.bounced",
      "email.complained",
      "email.suppressed",
    ].includes(event.type)
  )
    return Response.json({ ok: true });
  if (typeof event.data?.email_id !== "string")
    return Response.json({ error: "Invalid event" }, { status: 400 });
  try {
    const { error } = await getSupabaseAdmin().rpc("aleph_email_event", {
      p_id: id,
      p_kind: event.type,
      p_provider: event.data.email_id,
    });
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
