import Link from "next/link";
import { ArrowUpRight, Compass, Eye, HeartHandshake } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { PracticeFrameworkChart } from "@/components/PracticeFrameworkChart";

export const metadata = {
  title: "About Aleph",
  description:
    "Why Aleph exists, the mission behind the platform, and the five dimensions used to help independent clinicians build stronger practices.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    icon: HeartHandshake,
    title: "Clinician first",
    copy: "Growth should strengthen the clinician-patient relationship, not turn healthcare into aggressive selling.",
  },
  {
    icon: Compass,
    title: "Clarity before activity",
    copy: "The right next step matters more than doing more. We start by finding what the practice actually needs.",
  },
  {
    icon: Eye,
    title: "Trust before conversion",
    copy: "Visibility matters, but patients also need to understand the clinician, the care, and what happens next.",
  },
];

export default function AboutPage() {
  return (
    <main className="page-wrap">
      <PageIntro
        eyebrow="WHY ALEPH EXISTS"
        title="Built around the clinician behind the practice."
      >
        Aleph helps independent clinicians turn strong clinical expertise into a
        practice that is easier to find, easier to understand, and more
        sustainable to run.
      </PageIntro>

      <section className="section-wrap grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">OUR STORY</p>
          <h2 className="mt-3 text-4xl leading-tight md:text-5xl">
            Excellent care can still be invisible.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-[#41554d]">
          <p>
            Aleph began with a simple observation: skilled clinicians can spend
            years building expertise and still struggle to make their practice
            visible, understandable, and financially sustainable.
          </p>
          <p>
            The problem is rarely a lack of effort. It is usually fragmentation:
            an incomplete online presence, unclear patient communication,
            uncomfortable pricing conversations, inconsistent follow-up, and no
            single view of what should improve next.
          </p>
          <p>
            Aleph brings those pieces together into one practical growth
            framework designed specifically for independent clinicians and local
            practices.
          </p>
        </div>
      </section>

      <section className="section-wrap grid gap-5 md:grid-cols-2">
        <article className="rounded-[2rem] bg-[#123629] p-8 text-white md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DCE6E1]">
            Mission
          </p>
          <h2 className="mt-4 text-4xl leading-tight">
            Help good clinicians build practices patients can find and trust.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-[#DCE6E1]">
            We make practice growth more structured, ethical, and actionable by
            connecting visibility, trust, pricing, retention, and authority into
            one clear system.
          </p>
        </article>
        <article className="rounded-[2rem] border border-[#DCE6E1] bg-[#EDF4F1] p-8 md:p-10">
          <p className="eyebrow">VISION</p>
          <h2 className="mt-4 text-4xl leading-tight text-[#123629]">
            A future where clinical independence is easier to sustain.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-[#41554d]">
            We want independent clinicians to have the same clarity, systems,
            and growth intelligence that larger healthcare businesses use,
            without losing the personal character of their practice.
          </p>
        </article>
      </section>

      <section className="section-wrap">
        <PracticeFrameworkChart />
      </section>

      <section className="section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HOW WE THINK</p>
            <h2>Thoughtful growth, by design.</h2>
          </div>
          <p>
            Aleph is built to support better decisions, not create more noise
            for already busy clinicians.
          </p>
        </div>
        <div className="pillar-grid">
          {principles.map(({ icon: Icon, title, copy }, index) => (
            <article className="pillar" key={title}>
              <div className="pillar-top">
                <Icon size={27} />
                <span>0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-band">
        <p className="eyebrow">START WITH YOUR PRACTICE</p>
        <h2>
          See where you are strong.
          <br />
          Find what needs attention next.
        </h2>
        <Link className="button primary" href="/diagnostic">
          Take the free diagnostic <ArrowUpRight size={18} />
        </Link>
      </section>
    </main>
  );
}
