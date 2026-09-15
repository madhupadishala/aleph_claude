import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  failure,
  readBody,
  RequestError,
  requireSameOrigin,
} from "@/lib/security/request";
import { uuidPattern } from "@/lib/site";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const form = new URLSearchParams(await readBody(request, 2048));
    const oneClick = form.get("List-Unsubscribe") === "One-Click";
    if (!oneClick) requireSameOrigin(request);
    const token = oneClick ? url.searchParams.get("token") : form.get("token");
    const action = oneClick ? "unsubscribe" : form.get("action");
    if (
      !token ||
      !uuidPattern.test(token) ||
      !["confirm", "unsubscribe"].includes(action ?? "")
    )
      throw new RequestError("Invalid preference link.");
    const { data, error } = await getSupabaseAdmin().rpc("aleph_consent", {
      p_token: token,
      p_action: action,
    });
    if (error) throw error;
    if (!data)
      throw new RequestError(
        "This link is invalid, expired, or already unsubscribed.",
      );
    if (oneClick) return Response.json({ ok: true });
    return Response.redirect(
      new URL(
        `/email-preferences?result=${action === "confirm" ? "confirmed" : "unsubscribed"}`,
        request.url,
      ),
      303,
    );
  } catch (error) {
    return failure(error);
  }
}
