import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { packages } from "@/lib/aleph/commercial";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-ivory px-5 py-10 text-forest">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-forest"><ArrowLeft size={16} /> Back to Aleph</Link>
        <section className="mt-10 max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-terracotta">Pricing</p>
          <h1 className="mt-4 font-serif text-6xl leading-tight">Outcome-based packages for clinician growth.</h1>
          <p className="mt-6 text-lg leading-8 text-forest/72">Aleph pricing is built around the stage of the practice: foundation, growth, authority, or high-touch execution.</p>
        </section>
        <section className="mt-10 grid gap-5 lg:grid-cols-4">
          {packages.map((pack) => (
            <article key={pack.name} className={"flex flex-col rounded-aleph border p-6 shadow-soft " + (pack.featured ? "border-gold bg-forest text-white" : "border-line bg-white")}>
              {pack.featured ? <p className="mb-4 w-fit rounded-full bg-gold px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-forest">Recommended</p> : null}
              <h2 className={"text-2xl font-black " + (pack.featured ? "text-white" : "text-forest")}>{pack.name}</h2>
              <p className={"mt-3 text-2xl font-black " + (pack.featured ? "text-gold" : "text-terracotta")}>{pack.price}</p>
              <p className={"mt-4 text-sm font-bold " + (pack.featured ? "text-white/72" : "text-forest/64")}>{pack.bestFor}</p>
              <p className={"mt-4 leading-7 " + (pack.featured ? "text-white/76" : "text-forest/70")}>{pack.description}</p>
              <ul className="mt-6 grid gap-3">
                {pack.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm"><CheckCircle2 className={pack.featured ? "mt-0.5 shrink-0 text-gold" : "mt-0.5 shrink-0 text-clinic"} size={18} /><span>{item}</span></li>
                ))}
              </ul>
              <Link href="/diagnostic" className={"mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-black " + (pack.featured ? "bg-gold text-forest" : "bg-forest text-white")}>
                {pack.cta} <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
