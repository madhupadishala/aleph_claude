import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowUpRight } from "lucide-react";
import { segments } from "@/lib/aleph/commercial";
import { PageIntro } from "@/components/PageIntro";
export function generateStaticParams() {
  return segments.map((segment) => ({ segment: segment.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment: slug } = await params;
  const item = segments.find((s) => s.slug === slug);
  return item
    ? {
        title: "For " + item.label,
        description: item.summary,
        alternates: { canonical: "/for/" + slug },
      }
    : {};
}
export default async function SegmentPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment: slug } = await params;
  const segment = segments.find((s) => s.slug === slug);
  if (!segment) notFound();
  return (
    <main className="page-wrap">
      <PageIntro
        eyebrow={"ALEPH FOR " + segment.label.toUpperCase()}
        title={
          "Practice growth for independent " + segment.label.toLowerCase() + "."
        }
      >
        {segment.summary}
      </PageIntro>
      <div className="resource-grid">
        <section className="resource-tool">
          <p className="eyebrow">DOES THIS SOUND FAMILIAR?</p>
          <h2>Good care. Growth challenges.</h2>
          <ul className="check-list">
            {segment.pains.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
        <section className="resource-tool">
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h2>A clearer way forward.</h2>
          <ul className="check-list">
            {segment.outcomes.map((p) => (
              <li key={p}>
                <Check size={18} />
                {p}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link className="button primary" href="/diagnostic">
          Find my growth plan <ArrowUpRight size={18} />
        </Link>
        <Link className="button secondary" href="/pricing">
          Explore support
        </Link>
      </div>
    </main>
  );
}
