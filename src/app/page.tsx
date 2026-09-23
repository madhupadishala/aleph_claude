import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  HeartHandshake,
  CircleDollarSign,
  Timer,
  Check,
} from "lucide-react";
import { packages } from "@/lib/aleph/commercial";

const pillars = [
  {
    icon: Search,
    number: "01",
    title: "Be found locally.",
    copy: "Help nearby patients discover your services, understand your specialty, and find their way to your door.",
    href: "/solutions#discovery",
  },
  {
    icon: HeartHandshake,
    number: "02",
    title: "Build patient trust.",
    copy: "Give your expertise a clear voice. Help people understand your care before the first appointment.",
    href: "/solutions#trust",
  },
  {
    icon: CircleDollarSign,
    number: "03",
    title: "Price with confidence.",
    copy: "Build a sustainable practice with clear fees, considered follow-up, and room to do your best work.",
    href: "/resources#calculator",
  },
];

const packageLabels: Record<string, string> = {
  "Aleph Starter": "STARTER FOUNDATION",
  "Aleph Growth": "FOR YOUR NEXT STAGE",
  "Aleph Authority": "AUTHORITY BUILDING",
  "Aleph Concierge": "BESPOKE SUPPORT",
};

const proofPoints = [
  "7+ Years Clinical Experience",
  "50+ Doctors & Clinics Supported",
  "Doctor-Led",
  "Compliance-First Growth",
];

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <Image
          src="/images/clinician-consultation.webp"
          alt="Illustrative scene of a clinician listening to a patient in an independent clinic"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-content">
          <p className="eyebrow">
            <span className="status-dot" /> FOR THE INDEPENDENT CLINICIAN
          </p>
          <h1>
            Aleph.
            <br />
            Your practice,
            <br />
            <em>with possibility.</em>
          </h1>
          <p>
            You built the skill to care for people. Build the visibility, trust,
            and confidence to grow your own practice.
          </p>
          <Link href="/diagnostic" className="button primary">
            Find my growth plan <ArrowUpRight size={18} />
          </Link>
          <span className="hero-note">
            <Timer size={15} /> 3 minutes. Seven questions. Free to explore.
          </span>
        </div>
        <span className="hero-caption">
          Built around the person behind the practice.
        </span>
      </section>

      <div className="border-b border-[#DCE6E1] bg-[#FDFCF9]">
        <div className="mx-auto flex min-h-[48px] max-w-[1320px] items-center justify-start overflow-x-auto whitespace-nowrap px-4 text-[11px] font-semibold text-[#123629] sm:justify-center sm:px-8 sm:text-xs">
          {proofPoints.map((point, index) => (
            <span
              key={point}
              className={
                "flex items-center px-4 py-2 sm:px-6 " +
                (index > 0 ? "border-l border-[#DCE6E1]" : "")
              }
            >
              {point}
            </span>
          ))}
        </div>
      </div>

      <div className="audience-strip">
        <span>YOUR EXPERTISE. YOUR INDEPENDENCE.</span>
        <Link href="/for/doctors">
          Doctors <ArrowUpRight size={14} />
        </Link>
        <Link href="/for/therapists">
          Therapists <ArrowUpRight size={14} />
        </Link>
        <Link href="/for/clinics">
          Local clinics <ArrowUpRight size={14} />
        </Link>
      </div>
      <section className="section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GOOD CARE DESERVES TO BE SEEN</p>
            <h2>
              A stronger practice.
              <br />
              One thoughtful step at a time.
            </h2>
          </div>
          <p>
            Empty appointment slots. Uncomfortable fee conversations. Marketing
            that never quite feels like you. Start with what your practice needs
            most.
          </p>
        </div>
        <div className="pillar-grid">
          {pillars.map(({ icon: Icon, ...p }) => (
            <article key={p.number} className="pillar">
              <div className="pillar-top">
                <Icon size={27} />
                <span>{p.number}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.copy}</p>
              <Link href={p.href} className="text-link">
                Explore the approach <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="diagnostic-band">
        <div className="section-wrap diagnostic-grid">
          <div>
            <p className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</p>
            <h2>
              Find your next
              <br />
              <em>best step.</em>
            </h2>
            <p>
              Get a five-dimension practice scorecard and an actionable plan.
              Your results are available immediately, with no email required to
              view them.
            </p>
            <Link href="/diagnostic" className="button lime">
              Start my free diagnostic <ArrowUpRight size={18} />
            </Link>
          </div>
          <ol className="journey-list">
            {[
              [
                "Tell us where you are",
                "Seven questions about your current practice.",
              ],
              [
                "See what needs attention",
                "Visibility, trust, pricing, retention, and authority.",
              ],
              [
                "Make progress your way",
                "A checklist you can save and add to your calendar.",
              ],
            ].map(([title, copy], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SUPPORT THAT MEETS YOU WHERE YOU ARE</p>
            <h2>
              Your next chapter,
              <br />
              at your pace.
            </h2>
          </div>
          <Link href="/pricing" className="text-link">
            Compare all packages <ArrowRight size={18} />
          </Link>
        </div>
        <div className="package-grid">
          {packages.slice(0, 3).map((pack) => (
            <article
              className={"package " + (pack.featured ? "featured" : "")}
              key={pack.name}
            >
              <span className="eyebrow">
                {packageLabels[pack.name] ?? "PRACTICE GROWTH"}
              </span>
              <h3>{pack.name}</h3>
              <p className="price">{pack.price}</p>
              <p>{pack.bestFor}</p>
              <ul>
                {pack.deliverables.slice(0, 3).map((x) => (
                  <li key={x}>
                    <Check size={17} />
                    {x}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="button secondary">
                Explore package <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="closing-band">
        <p className="eyebrow">BEGIN WITH CLARITY</p>
        <h2>
          You care for your patients.
          <br />
          Make space for your practice.
        </h2>
        <Link className="button primary" href="/diagnostic">
          Let&apos;s find your next step <ArrowUpRight size={18} />
        </Link>
      </section>
    </main>
  );
}
