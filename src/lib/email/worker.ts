import { getSupabaseAdmin, type PracticeLead } from "@/lib/supabase/server";
import { emailContent } from "./templates";

type Job = {
  id: string;
  email: string;
  kind: string;
  lesson: number;
  attempts: number;
  lease_token: string;
  delivery_body: Record<string, unknown> | null;
  payload: PracticeLead & {
    confirm_token?: string;
    unsubscribe_token?: string;
  };
};
export async function processEmails(leadId: string | null = null, limit = 4) {
  if (!process.env.RESEND_API_KEY || !process.env.ALEPH_FROM_EMAIL)
    return { processed: 0, configured: false };
  const db = getSupabaseAdmin();
  let processed = 0;
  for (let i = 0; i < limit; i++) {
    const { data, error } = await db.rpc("aleph_claim_email", {
      p_lead: leadId,
    });
    if (error) throw new Error("Email queue unavailable");
    const job = data?.[0] as Job | undefined;
    if (!job) break;
    try {
      // Recheck preferences immediately before contacting the provider.
      const { data: subscriber, error: subscriberError } = await db
        .from("email_subscribers")
        .select("consent_state,suppressed_at")
        .eq("email", job.email)
        .maybeSingle();
      if (subscriberError) throw subscriberError;
      if (
        subscriber?.suppressed_at ||
        (job.kind === "lesson" && subscriber?.consent_state !== "subscribed")
      ) {
        const { error: cancelError } = await db
          .from("email_jobs")
          .update({ status: "cancelled" })
          .eq("id", job.id)
          .eq("lease_token", job.lease_token);
        if (cancelError) throw cancelError;
        continue;
      }
      const body = job.delivery_body ?? {
        from: process.env.ALEPH_FROM_EMAIL,
        to: job.email,
        ...emailContent(job.kind, job.lesson, job.payload),
      };
      if (!job.delivery_body) {
        const { error: bodyError } = await db
          .from("email_jobs")
          .update({ delivery_body: body })
          .eq("id", job.id)
          .eq("lease_token", job.lease_token);
        if (bodyError) throw bodyError;
      }
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `aleph-${job.id}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        if (
          response.status === 429 ||
          response.status >= 500 ||
          response.status === 409
        )
          throw new Error("Temporary provider error");
        const { error: failError } = await db
          .from("email_jobs")
          .update({
            status: "failed",
            last_error: `Provider rejected request (${response.status})`,
          })
          .eq("id", job.id)
          .eq("lease_token", job.lease_token);
        if (failError) throw failError;
        continue;
      }
      const sent = await response.json();
      if (typeof sent.id !== "string")
        throw new Error("Missing acknowledgment");
      const { error: saveError } = await db
        .from("email_jobs")
        .update({ status: "sent", provider_id: sent.id, last_error: null })
        .eq("id", job.id)
        .eq("status", "processing")
        .eq("lease_token", job.lease_token);
      if (saveError) throw saveError;
      const { data: events, error: eventsError } = await db
        .from("email_events")
        .select("id,kind")
        .eq("provider_id", sent.id);
      if (eventsError) throw eventsError;
      for (const event of events ?? []) {
        const { error: eventError } = await db.rpc("aleph_email_event", {
          p_id: event.id,
          p_kind: event.kind,
          p_provider: sent.id,
        });
        if (eventError) throw eventError;
      }
      processed++;
    } catch {
      const { error: retryError } = await db
        .from("email_jobs")
        .update({
          status: job.attempts >= 5 ? "review" : "pending",
          available_at: new Date(
            Date.now() + 60000 * 2 ** job.attempts,
          ).toISOString(),
          last_error: "Temporary failure; retry within deduplication window",
        })
        .eq("id", job.id)
        .eq("status", "processing")
        .eq("lease_token", job.lease_token);
      if (retryError) throw new Error("Could not persist retry");
    }
  }
  return { processed, configured: true };
}
