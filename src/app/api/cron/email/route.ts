import { processEmails } from "@/lib/email/worker";
import { passwordsMatch } from "@/lib/admin/session";
import { failure } from "@/lib/security/request";
import { getSupabaseAdmin } from "@/lib/supabase/server";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    !passwordsMatch(request.headers.get("authorization"), `Bearer ${secret}`)
  )
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await processEmails();
    const { error } = await getSupabaseAdmin()
      .from("request_limits")
      .delete()
      .lt("expires_at", new Date().toISOString());
    if (error) throw error;
    return Response.json(result, { status: result.configured ? 200 : 503 });
  } catch (error) {
    return failure(error);
  }
}
