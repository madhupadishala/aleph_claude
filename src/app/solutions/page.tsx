import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3 } from "lucide-react";
import { solutionPillars } from "@/lib/aleph/commercial";

export const metadata: Metadata = {
  title: "Clinician Growth Solutions",
  description: "Aleph combines discovery, trust, conversion, and authority systems for independent clinicians and small clinics.",
  alternates: { canonical: "/solutions" }
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-ivory px-5 py-10 text-forest">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-forest"><ArrowLeft size={16} /> Back to Aleph</Link>
        <section className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-terracotta">Solutions</p>
            <h1 className="mt-4 font-serif text-6xl leading-tight">A practice growth system for clinicians who refuse cheap marketing.</h1>
            <p className="mt-6 text-lg leading-8 text-forest/72">Aleph combines visibility, trust, conversion, and authority into one operating system for independent clinicians and small clinics.</p>
            <Link href="/diagnostic" className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-forest px-7 font-black text-white shadow-soft">Run Diagnostic <ArrowRight size={18} /></Link>
          </div>
          <div className="rounded-aleph border border-line bg-white p-6 shadow-soft">
            <div className="grid gap-4">
              {solutionPillars.map((pillar) => (
                <article key={pillar.title} className="rounded-2xl bg-mist p-6">
                  <div className="flex items-center gap-3">
                    <Layers3 className="text-gold" />
                    <h2 className="text-2xl font-black">{pillar.title}</h2>
                  </div>
                  <p className="mt-3 leading-7 text-forest/70">{pillar.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {solutionPillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-line bg-white p-7 shadow-soft">
              <h2 className="text-2xl font-black">{pillar.title}</h2>
              <ul className="mt-5 grid gap-3">
                {pillar.points.map((point) => (
                  <li key={point} className="flex gap-3 text-forest/76"><CheckCircle2 className="mt-0.5 shrink-0 text-clinic" size={19} /><span>{point}</span></li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
