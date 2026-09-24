import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Compass,
  HeartHandshake,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Workflow,
} from "lucide-react";

export const metadata = {
  title: "About Aleph",
  description:
    "Meet Dr. Wany and discover why Aleph was built to help independent clinicians grow visible, trusted, well-run practices.",
  alternates: { canonical: "/about" },
};

const proof = [
  { value: "7+ years", label: "Clinical experience", icon: Stethoscope },
  { value: "50+", label: "Doctors & clinics supported", icon: Users },
  { value: "Doctor-led", label: "Built from inside healthcare", icon: HeartHandshake },
  { value: "Compliance-first", label: "Trust before tactics", icon: ShieldCheck },
];

const observations = [
  {
    number: "01",
    title: "Good doctors can still be hard to find.",
    copy: "Strong clinical work does not automatically translate into visibility, positioning, or patient understanding.",
  },
  {
    number: "02",
    title: "More enquiries do not always mean more growth.",
    copy: "A practice can receive interest and still lose patients through unclear communication, weak follow-up, or a poor booking journey.",
  },
  {
    number: "03",
    title: "A busy practice can still be badly designed.",
    copy: "When the doctor becomes the marketing team, follow-up desk, operations manager, and problem-solver, growth starts costing clinical time.",
  },
];

const practiceLens = [
  ["Visibility", "Can the right patients find you?", Search],
  ["Trust", "Do they understand why they should choose you?", BadgeCheck],
  ["Pricing", "Can your value be communicated with confidence?", CircleDollarSign],
  ["Patient journey", "Does enquiry become appointment and follow-up smoothly?", Users],
  ["Capacity", "Is the clinician's time being used where it matters most?", Clock3],
  ["Affordability", "Does the overall care experience feel transparent and reasonable?", HeartHandshake],
  ["Authority", "What do patients remember you for?", Sparkles],
] as const;

const principles = [
  {
    icon: HeartHandshake,
    title: "Healthcare first.",
    copy: "A clinic is not just another local business. Trust, reputation, patient experience, and clinical judgement come first.",
  },
  {
    icon: Compass,
    title: "Clarity before activity.",
    copy: "We would rather understand the real constraint first than add more campaigns, tools, or noise to the practice.",
  },
  {
    icon: Workflow,
    title: "Build systems, not dependence.",
    copy: "The goal is a practice that becomes easier to find, easier to trust, and easier to run — without the doctor doing everything.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.6rem] bg-[#FBF8F1] ring-1 ring-[#DCE6E1]">
          <div className="grid lg:min-h-[680px] lg:grid-cols-[1.02fr_.98fr]">
            <div className="flex flex-col justify-between p-7 md:p-10 lg:p-14 xl:p-16">
              <div>
                <p className="eyebrow">ABOUT ALEPH</p>
                <h1 className="mt-5 max-w-3xl text-5xl leading-[.96] text-[#123629] md:text-6xl lg:text-7xl">
                  Hi, I&apos;m Dr. Wany.
                </h1>
                <p className="mt-7 max-w-2xl text-2xl font-semibold leading-9 text-[#123629] md:text-3xl md:leading-10">
                  I built Aleph because good doctors should not have to become marketers to build a strong practice.
                </p>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#52665e] md:text-lg">
                  Clinical practice showed me something very clearly: caring for patients and growing a practice are two different jobs. Doctors are trained deeply for one — and are often left to figure out the other on their own.
                </p>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[#52665e] md:text-lg">
                  That gap stayed with me. Aleph started from there.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="#why-aleph" className="button primary">
                  Why Aleph exists <ArrowDown size={17} />
                </Link>
                <Link href="/diagnostic" className="button secondary">
                  Find my growth plan <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[520px] bg-[#EDF4F1] lg:min-h-full">
              <Image
                src="/images/dr-wany-founder-final.webp"
                alt="Dr. Wany, Founder of Aleph"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.6rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(18,54,41,.18)] backdrop-blur md:inset-x-7 md:bottom-7 md:p-6">
                <p className="text-lg font-semibold text-[#123629]">Dr. Wany</p>
                <p className="mt-1 text-sm text-[#607169]">Founder, Aleph</p>
                <p className="mt-4 border-t border-[#DCE6E1] pt-4 text-sm leading-6 text-[#41554d]">
                  “The practice should grow around the doctor — not consume the doctor.”
                </p>
              </div>
            </div>
          </div>

          <div className="grid border-t border-[#DCE6E1] bg-white sm:grid-cols-2 lg:grid-cols-4">
            {proof.map(({ value, label, icon: Icon }, index) => (
              <div
                key={value}
                className={`flex items-center gap-4 px-6 py-5 ${index !== 0 ? "border-t border-[#DCE6E1] sm:border-t-0 sm:border-l" : ""} ${index === 2 ? "sm:border-t lg:border-t-0" : ""}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF4F1] text-[#0F766E]">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-semibold text-[#123629]">{value}</p>
                  <p className="mt-1 text-xs leading-5 text-[#607169]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-aleph" className="section-wrap scroll-mt-28">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">WHAT I KEPT SEEING</p>
            <h2 className="mt-4 max-w-lg text-4xl leading-tight md:text-5xl">
              The problem was rarely just marketing.
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-[#52665e]">
              I kept seeing clinically strong doctors working harder than they needed to — while the practice around them remained difficult to discover, difficult to manage, or difficult to grow.
            </p>
          </div>

          <div className="grid gap-4">
            {observations.map((item) => (
              <article
                key={item.number}
                className="grid gap-5 rounded-[2rem] border border-[#DCE6E1] bg-white p-6 md:grid-cols-[90px_1fr] md:p-8"
              >
                <span className="text-4xl font-semibold text-[#C86745]">{item.number}</span>
                <div>
                  <h3 className="text-2xl font-semibold leading-8 text-[#123629]">{item.title}</h3>
                  <p className="mt-3 max-w-2xl leading-7 text-[#607169]">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#123629] text-white">
        <div className="section-wrap grid gap-10 py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C59A3D]">
              THE QUESTION CHANGED
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl leading-tight md:text-6xl">
              We do not begin with advertising.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-white/70">
              The first question is not “How do we get you more leads?”
            </p>
            <p className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              What is actually stopping this practice from growing?
            </p>
            <p className="mt-6 max-w-2xl leading-8 text-white/70">
              For one doctor, the answer may be visibility. For another, trust. For another, pricing, follow-up, capacity, or the way the whole patient journey is organised. Different problems need different answers.
            </p>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE WHOLE PRACTICE</p>
            <h2>Growth makes more sense when you stop looking at one metric.</h2>
          </div>
          <p>
            Aleph looks at the practice as a connected system — not a collection of campaigns.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {practiceLens.map(([title, copy, Icon], index) => (
            <article
              key={title}
              className={`rounded-[1.7rem] border p-5 md:p-6 ${index === 0 ? "border-[#123629] bg-[#123629] text-white" : "border-[#DCE6E1] bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <Icon size={21} className={index === 0 ? "text-[#C59A3D]" : "text-[#0F766E]"} />
                <span className={`text-xs font-bold ${index === 0 ? "text-white/45" : "text-[#C86745]"}`}>0{index + 1}</span>
              </div>
              <h3 className={`mt-7 text-xl font-semibold ${index === 0 ? "text-white" : "text-[#123629]"}`}>
                {title}
              </h3>
              <p className={`mt-3 text-sm leading-6 ${index === 0 ? "text-white/70" : "text-[#607169]"}`}>
                {copy}
              </p>
            </article>
          ))}

          <article className="flex min-h-48 flex-col justify-between rounded-[1.7rem] bg-[#C59A3D] p-6 text-[#123629]">
            <Sparkles size={22} />
            <p className="mt-8 text-2xl font-semibold leading-8">
              More leads are useful only when the practice is ready for them.
            </p>
          </article>
        </div>
      </section>

      <section className="section-wrap pt-0">
        <div className="rounded-[2.5rem] bg-[#EDF4F1] p-7 md:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="eyebrow">WHAT ALEPH STANDS FOR</p>
              <h2 className="mt-4 text-4xl leading-tight text-[#123629] md:text-5xl">
                Thoughtful growth. Without losing what makes healthcare different.
              </h2>
            </div>
            <div className="grid gap-3">
              {principles.map(({ icon: Icon, title, copy }) => (
                <article key={title} className="rounded-[1.6rem] bg-white p-6 md:p-7">
                  <div className="flex gap-4">
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBF8F1] text-[#0F766E]">
                      <Icon size={19} />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-[#123629]">{title}</h3>
                      <p className="mt-2 leading-7 text-[#607169]">{copy}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap pt-0">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[2.2rem] border border-[#DCE6E1] bg-white p-7 md:p-10">
            <p className="eyebrow">OUR MISSION</p>
            <h2 className="mt-5 text-3xl leading-tight text-[#123629] md:text-4xl">
              Help independent clinicians build practices that are visible, trusted, and easier to run.
            </h2>
            <p className="mt-5 leading-8 text-[#607169]">
              Not by asking doctors to do more, but by helping the practice around them work better.
            </p>
          </article>
          <article className="rounded-[2.2rem] bg-[#FBF8F1] p-7 md:p-10">
            <p className="eyebrow">OUR VISION</p>
            <h2 className="mt-5 text-3xl leading-tight text-[#123629] md:text-4xl">
              Practice growth that feels as thoughtful as the care behind it.
            </h2>
            <p className="mt-5 leading-8 text-[#607169]">
              A model where visibility, patient trust, operational clarity, and sustainable growth support clinical work instead of competing with it.
            </p>
          </article>
        </div>
      </section>

      <section className="section-wrap pt-0">
        <div className="overflow-hidden rounded-[2.6rem] bg-[#123629] text-white">
          <div className="grid lg:grid-cols-[.72fr_1.28fr]">
            <div className="relative min-h-[360px] bg-[#DCE6E1] lg:min-h-[520px]">
              <Image
                src="/images/dr-wany-founder-final.webp"
                alt="Dr. Wany, Founder of Aleph"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C59A3D]">A NOTE FROM DR. WANY</p>
              <blockquote className="mt-6 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl md:leading-[1.08]">
                “I did not build Aleph to make doctors better marketers. I built it to help doctors build better practices.”
              </blockquote>
              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="font-semibold">Dr. Wany</p>
                <p className="mt-1 text-sm text-white/55">Founder, Aleph</p>
              </div>
              <div className="mt-9">
                <Link href="/diagnostic" className="button bg-white text-[#123629] hover:bg-[#EDF4F1]">
                  Find my growth plan <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
