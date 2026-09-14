import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { segments } from "@/lib/aleph/commercial";

export function generateStaticParams() {
  return segments.map((segment) => ({ segment: segment.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const { segment: slug } = await params;
  const segment = segments.find((item) => item.slug === slug);

  if (!segment) {
    return {};
  }

  return {
    title: `Aleph for ${segment.label}`,
    description: segment.summary,
    alternates: { canonical: `/for/${segment.slug}` }
  };
}

export default async function SegmentPage({ params }: { params: Promise<{ segment: string }> }) {
  const { segment: slug } = await params;
  const segment = segments.find((item) => item.slug === slug);

  if (!segment) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ivory px-5 py-10 text-forest">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-forest"><ArrowLeft size={16} /> Back to Aleph</Link>
        <section className="mt-10 rounded-aleph border border-line bg-white p-8 shadow-soft md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-terracotta">Aleph for {segment.label}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-6xl leading-tight">{segment.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-forest/72">{segment.summary}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/diagnostic" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-forest px-7 font-black text-white">Run Diagnostic <ArrowRight size={18} /></Link>
            <Link href="/pricing" className="inline-flex min-h-14 items-center justify-center rounded-full border border-line bg-ivory px-7 font-black text-forest">View Pricing</Link>
          </div>
        </section>
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-aleph border border-line bg-white p-7 shadow-soft">
            <h2 className="flex items-center gap-3 text-2xl font-black"><CircleAlert className="text-terracotta" /> Common Growth Leaks</h2>
            <ul className="mt-5 grid gap-3">
              {segment.pains.map((pain) => <li key={pain} className="rounded-2xl bg-mist p-4 font-bold text-forest/76">{pain}</li>)}
            </ul>
          </div>
          <div className="rounded-aleph border border-line bg-forest p-7 text-white shadow-soft">
            <h2 className="text-2xl font-black text-gold">Aleph Outcomes</h2>
            <ul className="mt-5 grid gap-3">
              {segment.outcomes.map((outcome) => <li key={outcome} className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-gold" size={19} /><span>{outcome}</span></li>)}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
