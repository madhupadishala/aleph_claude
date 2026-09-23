import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { ResourceTools } from "@/components/ResourceTools";

export const metadata = {
  title: "Free practice tools",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <main className="page-wrap">
      <PageIntro
        eyebrow="YOUR PRACTICAL STARTING POINT"
        title="Understand the practice before choosing the tool."
      >
        Start with Aleph Practice Intelligence to identify what is actually
        limiting growth. Use the smaller utilities only when you need them.
      </PageIntro>

      <section className="rounded-[2rem] bg-[#123629] p-7 text-white md:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8FA69A]">
              ALEPH PRACTICE INTELLIGENCE
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl leading-tight md:text-5xl">
              Practice age is not practice health.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/75">
              Assess practice stage, patient flow, available capacity, trust,
              pricing, retention, authority, operational capacity, and patient
              affordability before Aleph suggests a product and next priorities.
            </p>
          </div>
          <div className="lg:text-right">
            <Link className="button secondary" href="/diagnostic">
              Build my intelligence report <ArrowUpRight size={18} />
            </Link>
            <p className="mt-3 text-xs leading-5 text-white/60">
              No email required to view or download the result.
            </p>
          </div>
        </div>
      </section>

      <ResourceTools />
    </main>
  );
}
