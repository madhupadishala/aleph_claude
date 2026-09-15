import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifySession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function Operations() {
  if (
    !verifySession(
      (await cookies()).get("aleph_admin")?.value,
      process.env.ALEPH_ADMIN_PASSWORD,
    )
  )
    redirect("/admin/login");
  const keys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ALEPH_ADMIN_PASSWORD",
    "ALEPH_RATE_LIMIT_SECRET",
    "RESEND_API_KEY",
    "ALEPH_FROM_EMAIL",
    "RESEND_WEBHOOK_SECRET",
    "CRON_SECRET",
  ];
  let jobs: {
    id: string;
    kind: string;
    status: string;
    attempts: number;
    created_at: string;
    last_error: string | null;
  }[] = [];
  let error = "";
  try {
    const result = await getSupabaseAdmin()
      .from("email_jobs")
      .select("id,kind,status,attempts,created_at,last_error")
      .order("created_at", { ascending: false })
      .limit(100);
    if (result.error) throw result.error;
    jobs = result.data ?? [];
  } catch {
    error =
      "Queue unavailable. Check database configuration and apply migrations 001-003.";
  }
  return (
    <main className="page-wrap">
      <Link className="text-link" href="/admin/leads">
        Back to leads
      </Link>
      <h1 className="text-4xl font-bold">Email operations</h1>
      <p className="page-intro">
        Configuration presence and the latest 100 delivery jobs. A configured
        key does not prove the service is reachable.
      </p>
      <div className="resource-grid">
        <section className="resource-tool">
          <h2>Service configuration</h2>
          {keys.map((key) => (
            <p key={key}>
              {key}: <strong>{process.env[key] ? "Present" : "Missing"}</strong>
            </p>
          ))}
        </section>
        <section className="resource-tool">
          <h2>Queue behavior</h2>
          <p>
            Requests are saved before dispatch. Retries keep the same provider
            idempotency key. Ambiguous jobs older than 23 hours require
            reconciliation, not an automatic resend.
          </p>
          <p>
            Configure ALEPH_CRON_SECRET in GitHub Actions to match CRON_SECRET
            in Vercel for the 15-minute worker. The daily Vercel job is a
            recovery sweep.
          </p>
        </section>
      </div>
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {["Job", "Type", "Status", "Attempts", "Last error"].map(
                  (x) => (
                    <th className="p-4" key={x}>
                      {x}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr className="border-t" key={j.id}>
                  <td className="p-4">{j.id.slice(0, 8)}</td>
                  <td>{j.kind}</td>
                  <td>{j.status}</td>
                  <td>{j.attempts}</td>
                  <td>{j.last_error || "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!jobs.length && <p>No queued emails yet.</p>}
        </div>
      )}
    </main>
  );
}
