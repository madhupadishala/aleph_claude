import Link from "next/link";
import { ArrowLeft, ArrowRight, Calculator, FileText, MapPinned, MessageSquareText } from "lucide-react";

const resources = [
  {
    title: "Local Visibility Checklist",
    type: "Clinic discovery",
    icon: MapPinned,
    summary: "A step-by-step checklist for Google profile strength, service clarity, photos, location signals, and booking friction."
  },
  {
    title: "Consultation Pricing Calculator",
    type: "Pricing confidence",
    icon: Calculator,
    summary: "A simple framework to review consultation fee, follow-up value, time cost, burnout risk, and care package structure."
  },
  {
    title: "Patient Trust Page Blueprint",
    type: "Website conversion",
    icon: FileText,
    summary: "The sections every clinician page needs: story, conditions handled, care pathway, FAQs, proof, and appointment action."
  },
  {
    title: "Inquiry Follow-up Script",
    type: "Lead conversion",
    icon: MessageSquareText,
    summary: "A calm, ethical response structure for patients who ask fees, timings, location, or whether you can help."
  }
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-ivory px-5 py-10 text-forest">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-forest">
          <ArrowLeft size={16} /> Back to Aleph
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-terracotta">Resource Vault</p>
            <h1 className="mt-4 font-serif text-6xl leading-tight">Practical tools for clinicians building a stronger practice.</h1>
            <p className="mt-6 text-lg leading-8 text-forest/72">
              These resources support the same growth system Aleph builds for clients: discovery, trust, pricing, conversion, and retention.
            </p>
            <Link href="/diagnostic" className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-forest px-7 font-black text-white shadow-soft">
              Run Diagnostic First <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4">
            {resources.map((resource) => {
              const Icon = resource.icon;

              return (
                <article key={resource.title} className="rounded-aleph border border-line bg-white p-6 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-clinic">
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-terracotta">{resource.type}</p>
                      <h2 className="mt-2 text-2xl font-black">{resource.title}</h2>
                      <p className="mt-3 leading-7 text-forest/70">{resource.summary}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
