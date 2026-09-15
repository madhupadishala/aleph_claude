import { after } from "next/server";
import { scoreAnswers } from "@/lib/aleph/diagnostic";
import { processEmails } from "@/lib/email/worker";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { consentVersion, uuidPattern } from "@/lib/site";
import {
  failure,
  rateLimit,
  readJson,
  RequestError,
  requireSameOrigin,
} from "@/lib/security/request";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const payload = await readJson(request);
    if (payload.website)
      throw new RequestError("Unable to accept this submission.");
    if (
      payload.reportConsent !== true ||
      typeof payload.marketingConsent !== "boolean"
    )
      throw new RequestError(
        "Please agree to saving and emailing your report.",
      );
    const email =
      typeof payload.email === "string"
        ? payload.email.trim().toLowerCase()
        : "";
    const specialty =
      typeof payload.specialty === "string" ? payload.specialty.trim() : "";
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new RequestError("Enter a valid email address.");
    if (specialty.length < 2 || specialty.length > 120 || name.length > 120)
      throw new RequestError("Check your name and specialty.");
    if (
      typeof payload.requestId !== "string" ||
      !uuidPattern.test(payload.requestId)
    )
      throw new RequestError("Refresh the page and try again.");
    let result;
    try {
      result = scoreAnswers(payload.answers);
    } catch {
      throw new RequestError("Complete all seven questions.");
    }
    await rateLimit(request, "lead-ip", 10, 3600);
    await rateLimit(request, "lead-email", 3, 86400, email);
    const scores = Object.fromEntries(
      result.normalized.map((item) => [item.key + "_score", item.score]),
    );
    const { data, error } = await getSupabaseAdmin().rpc("aleph_capture", {
      p_request: payload.requestId,
      p_marketing: payload.marketingConsent,
      p_version: consentVersion,
      p_lead: {
        name,
        email,
        specialty,
        ...scores,
        overall_score: result.overall,
        weakest_area: result.weakest.label,
        package_fit: result.fit.name,
      },
    });
    if (error) throw error;
    if (data)
      after(async () => {
        await processEmails(data, 1);
      });
    return Response.json(
      { ok: true, emailQueued: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
