import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import { solutionPillars } from "@/lib/aleph/commercial";
import { PageIntro } from "@/components/PageIntro";
export const metadata = {
  title: "Practice growth solutions",
  alternates: { canonical: "/solutions" },
};
export default function SolutionsPage() {
  return (
    <main className="page-wrap">
      <PageIntro
        eyebrow="A CONNECTED APPROACH"
        title="Practice growth, built around you."
      >
        From the first local search to the next appointment, make every step
        easier for your patients and your practice.
      </PageIntro>
      {solutionPillars.map((pillar, i) => (
        <section
          id={["discovery", "trust", "conversion", "authority"][i]}
          key={pillar.title}
          className="solution-row"
        >
          <span className="solution-number">0{i + 1}</span>
          <div>
            <h2>{pillar.title}</h2>
            <p>{pillar.summary}</p>
          </div>
          <ul className="check-list">
            {pillar.points.map((point) => (
              <li key={point}>
                <Check size={18} />
                {point}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <Link href="/diagnostic" className="button primary">
        Find where to begin <ArrowUpRight size={18} />
      </Link>
    </main>
  );
}
