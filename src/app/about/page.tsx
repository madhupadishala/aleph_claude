import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  HeartHandshake,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

export const metadata = {
  title: "About Aleph",
  description:
    "Meet Dr. Wany and learn why Aleph was built to help doctors grow stronger, more visible, and more sustainable practices.",
  alternates: { canonical: "/about" },
};

const proof = [
  { value: "7 years", label: "Clinical experience", icon: Stethoscope },
  { value: "50+", label: "Doctors & clinics supported", icon: Users },
  { value: "Doctor-led", label: "Built from inside healthcare", icon: HeartHandshake },
  { value: "Compliance-first", label: "Growth with trust protected", icon: ShieldCheck },
];

const problems = [
  "Excellent doctors who were difficult to discover.",
  "Established clinics with unused appointment capacity.",
  "Doctors depending almost completely on referrals.",
  "Practices receiving inquiries but losing patients before consultation.",
  "Clinicians spending valuable time on work outside clinical decision-making.",
  "Doctors who wanted to grow without compromising the trust they had built.",
];

const dimensions = [
  ["Local Visibility", "Can the right patients find you?", Search],
  ["Patient Trust", "Can they understand why they should choose you?", BadgeCheck],
  ["Patient Journey", "Does an inquiry smoothly become an appointment and follow-up?", Users],
  ["Pricing Confidence", "Can your value be communicated without reactive discounting?", LineChart],
  ["Operational Capacity", "Is the clinician's time being used where it matters most?", Clock3],
  ["Patient Affordability", "Does the overall cost of care feel transparent and reasonable?", HeartHandshake],
  ["Clinical Authority", "What do patients remember you for?", Sparkles],
] as const;

export default function AboutPage() {
  return (
    <main className="page-wrap">
      <section className="grid gap-8 pt-5 lg:grid-cols-[1.08fr_.92fr] lg:items-stretch">
        <div className="rounded-[2.4rem] bg-[#123629] p-7 text-white md:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C59A3D]">
            A NOTE FROM OUR FOUNDER
          </p>
          <h1 className="mt-5 text-5xl leading-[0.98] md:text-6xl">I&apos;m Dr. Wany.</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/80 md:text-2xl">
            7 years in clinical practice taught me something very clearly:
          </p>
          <p className="mt-7 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
            Great doctors do not always build great practices.
          </p>
          <p className="mt-5 max-w-2xl leading-7 text-white/70">
            Not because they lack clinical expertise. But because building a
            practice demands much more than treating patients.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {["Visibility", "Patient trust", "Pricing", "Follow-up", "Team coordination", "Reputation", "Operations", "Growth"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-center text-white/85"
                >
                  {item}
                </span>
              ),
            )}
          </div>

          <p className="mt-8 text-lg font-medium text-white">
            And most doctors were never trained for any of that.
          </p>
        </div>

        <aside className="flex flex-col justify-between rounded-[2.4rem] border border-[#DCE6E1] bg-[#EDF4F1] p-7 md:p-10">
          <div>
            <p className="eyebrow">WHY ALEPH STARTED</p>
            <h2 className="mt-4 text-4xl leading-tight text-[#123629] md:text-5xl">
              That is why I built Aleph.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#41554d]">
              I have spent the last <strong>7 years inside healthcare</strong>, working
              with patients, families, clinical teams, and the everyday realities
              of medical practice.
            </p>
            <p className="mt-4 text-base leading-8 text-[#41554d]">
              Over time, I started seeing the same problems repeatedly.
            </p>
          </div>
          <div className="mt-8 rounded-[1.6rem] bg-white p-5">
            <p className="text-sm leading-6 text-[#52665e]">
              Aleph started from one simple question:
            </p>
            <p className="mt-2 text-2xl font-semibold leading-snug text-[#123629]">
              What is actually stopping this practice from growing?
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {proof.map(({ value, label, icon: Icon }) => (
          <article key={value} className="rounded-2xl border border-[#DCE6E1] bg-white p-5">
            <Icon size={22} className="text-[#0F766E]" />
            <p className="mt-4 text-2xl font-semibold text-[#123629]">{value}</p>
            <p className="mt-1 text-sm leading-6 text-[#607169]">{label}</p>
          </article>
        ))}
      </section>

      <section className="section-wrap grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">WHAT I KEPT SEEING</p>
          <h2 className="mt-3 text-4xl leading-tight md:text-5xl">
            The problem was rarely just marketing.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-[#52665e]">
            Different practices were struggling for completely different reasons.
            That is where the idea behind Aleph became clearer.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {problems.map((problem, index) => (
            <article
              key={problem}
              className="rounded-[1.6rem] border border-[#DCE6E1] bg-white p-5 md:p-6"
            >
              <span className="text-xs font-bold text-[#C86745]">0{index + 1}</span>
              <p className="mt-3 text-lg font-semibold leading-7 text-[#123629]">{problem}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap rounded-[2.4rem] bg-[#123629] p-7 text-white md:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C59A3D]">
              TODAY
            </p>
            <p className="mt-4 text-6xl font-semibold leading-none">50+</p>
            <p className="mt-3 text-xl leading-7 text-white/80">doctors and clinics supported</p>
          </div>
          <div>
            <h2 className="text-3xl leading-tight md:text-4xl">
              We have helped doctors and clinics move forward with greater clarity and confidence.
            </h2>
            <p className="mt-5 max-w-3xl leading-7 text-white/75">
              Not simply by bringing more leads. But by helping practices strengthen
              the systems behind growth.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Better visibility", "Stronger patient trust", "Clearer positioning", "Structured patient journeys", "Better follow-up", "More confident growth"].map(
                (item) => (
                  <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
                    {item}
                  </span>
                ),
              )}
            </div>
            <p className="mt-6 font-medium text-white">
              Because growth becomes sustainable only when the practice itself is ready for it.
            </p>
          </div>
        </div>
      </section>

      <section className="section-wrap text-center">
        <p className="eyebrow">WE DO NOT BEGIN WITH ADVERTISING</p>
        <h2 className="mx-auto mt-4 max-w-4xl text-4xl leading-tight md:text-6xl">
          What is actually stopping your practice from growing?
        </h2>
        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
          {["Visibility", "Patient trust", "Pricing", "Conversion", "Retention", "Capacity", "Clinician time"].map(
            (item) => (
              <span
                key={item}
                className="rounded-full border border-[#DCE6E1] bg-white px-4 py-2 text-sm font-semibold text-[#123629]"
              >
                {item}
              </span>
            ),
          )}
        </div>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#52665e]">
          These are completely different problems. They should not receive the same solution.
        </p>
      </section>

      <section className="section-wrap grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="rounded-[2rem] bg-[#EDF4F1] p-7 md:p-10">
          <p className="eyebrow">BUILT FROM INSIDE HEALTHCARE</p>
          <h2 className="mt-4 text-4xl leading-tight text-[#123629] md:text-5xl">Aleph is doctor-led.</h2>
          <p className="mt-6 leading-8 text-[#41554d]">
            That changes the way we look at growth. We do not see a clinic simply
            as a business that needs more customers.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Trust matters.", "Patient experience matters.", "Clinical reputation matters.", "Time matters."].map(
            (item) => (
              <div key={item} className="flex min-h-36 items-end rounded-[1.6rem] border border-[#DCE6E1] bg-white p-5">
                <p className="text-xl font-semibold leading-7 text-[#123629]">{item}</p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MORE THAN MARKETING</p>
            <h2>Practices do not need more activity. They need better decisions.</h2>
          </div>
          <p>
            Working with 50+ doctors and clinics has reinforced why we look beyond advertising.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {dimensions.map(([title, copy, Icon], index) => (
            <article key={title} className="rounded-[1.6rem] border border-[#DCE6E1] bg-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <Icon size={22} className="text-[#0F766E]" />
                <span className="text-xs font-bold text-[#C86745]">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#123629]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#607169]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap rounded-[2.4rem] border border-[#DCE6E1] bg-white p-7 md:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <p className="eyebrow">MY BELIEF IS SIMPLE</p>
            <p className="mt-4 text-lg leading-8 text-[#52665e]">
              Doctors should not have to become marketers to build successful practices.
            </p>
          </div>
          <div>
            <h2 className="text-4xl leading-tight text-[#123629] md:text-5xl">
              Practices that are easier to find. Easier to trust. Easier to run. And strong enough to grow confidently.
            </h2>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-[#FBF8F1] p-6 md:p-8">
          <p className="max-w-4xl text-2xl font-semibold leading-9 text-[#123629] md:text-3xl md:leading-10">
            “I did not build Aleph to make doctors better marketers. I built it to help doctors build better practices.”
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#DCE6E1] pt-5">
            <div>
              <p className="font-semibold text-[#123629]">Dr. Wany</p>
              <p className="text-sm text-[#607169]">Founder, Aleph · 7 Years of Clinical Experience</p>
            </div>
            <Link className="button primary" href="/diagnostic">
              Find my growth plan <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
