import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowLeft, Flame, Mail, ShieldAlert, UserRoundCheck } from "lucide-react";
import { getSupabaseAdmin, type PracticeLead } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Leads",
  robots: {
    index: false,
    follow: false
  }
};

function scoreColor(score: number) {
  if (score >= 80) return "text-clinic";
  if (score >= 60) return "text-gold";
  return "text-terracotta";
}

function leadTemperature(lead: PracticeLead) {
  if (lead.overall_score >= 75 || lead.package_fit.includes("Authority")) return "Hot";
  if (lead.overall_score >= 55 || lead.package_fit.includes("Growth")) return "Warm";
  return "Nurture";
}

async function getLeads() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("practice_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PracticeLead[];
}

export default async function AdminLeadsPage() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("aleph_admin")?.value;
  const expected = process.env.ALEPH_ADMIN_PASSWORD;
  const isUnlocked = expected && adminCookie === expected;

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-ivory px-5 py-10 text-forest">
        <div className="mx-auto max-w-xl rounded-aleph border border-line bg-white p-8 shadow-soft">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-forest">
            <ArrowLeft size={16} /> Back to Aleph
          </Link>
          <div className="mt-8 flex items-center gap-3">
            <ShieldAlert className="text-terracotta" size={30} />
            <h1 className="font-serif text-5xl">Admin Locked</h1>
          </div>
          <p className="mt-5 leading-8 text-forest/72">
            Add an <span className="font-bold">aleph_admin</span> cookie matching <span className="font-bold">ALEPH_ADMIN_PASSWORD</span> to view leads. Sprint 3 keeps this lightweight; full auth can be hardened later if required.
          </p>
        </div>
      </main>
    );
  }

  let leads: PracticeLead[] = [];
  let errorMessage = "";

  try {
    leads = await getLeads();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load leads.";
  }

  const hotCount = leads.filter((lead) => leadTemperature(lead) === "Hot").length;
  const averageScore = leads.length ? Math.round(leads.reduce((sum, lead) => sum + lead.overall_score, 0) / leads.length) : 0;

  return (
    <main className="min-h-screen bg-ivory px-5 py-10 text-forest">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-forest">
          <ArrowLeft size={16} /> Back to Aleph
        </Link>

        <header className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-terracotta">Aleph Admin</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">Practice Leads</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-forest/72">
              Diagnostic submissions, package fit, weakest area, and follow-up temperature.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-line bg-white p-4 text-center shadow-soft">
              <UserRoundCheck className="mx-auto text-clinic" />
              <p className="mt-2 text-2xl font-black">{leads.length}</p>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-sage">Leads</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4 text-center shadow-soft">
              <Flame className="mx-auto text-terracotta" />
              <p className="mt-2 text-2xl font-black">{hotCount}</p>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-sage">Hot</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4 text-center shadow-soft">
              <Activity className="mx-auto text-gold" />
              <p className="mt-2 text-2xl font-black">{averageScore}%</p>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-sage">Avg</p>
            </div>
          </div>
        </header>

        {errorMessage ? (
          <div className="mt-8 rounded-2xl border border-terracotta/30 bg-white p-5 font-bold text-terracotta">{errorMessage}</div>
        ) : null}

        <section className="mt-8 overflow-hidden rounded-aleph border border-line bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="bg-mist text-xs font-black uppercase tracking-[0.14em] text-forest/65">
                <tr>
                  <th className="px-5 py-4">Lead</th>
                  <th className="px-5 py-4">Specialty</th>
                  <th className="px-5 py-4">Score</th>
                  <th className="px-5 py-4">Weakest Area</th>
                  <th className="px-5 py-4">Package</th>
                  <th className="px-5 py-4">Temperature</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-line align-top">
                    <td className="px-5 py-4">
                      <p className="font-black">{lead.name || "Unnamed clinician"}</p>
                      <a href={"mailto:" + lead.email} className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-clinic">
                        <Mail size={14} /> {lead.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 font-bold">{lead.specialty}</td>
                    <td className={"px-5 py-4 text-2xl font-black " + scoreColor(lead.overall_score)}>{lead.overall_score}%</td>
                    <td className="px-5 py-4">{lead.weakest_area}</td>
                    <td className="px-5 py-4 font-black">{lead.package_fit}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-mist px-3 py-1 text-sm font-black">{leadTemperature(lead)}</span></td>
                    <td className="px-5 py-4">{lead.status}</td>
                  </tr>
                ))}
                {!leads.length ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center font-bold text-forest/60">No diagnostic leads yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
