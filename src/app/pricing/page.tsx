import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import { packages } from "@/lib/aleph/commercial";
import { PageIntro } from "@/components/PageIntro";
export const metadata = {
  title: "Pricing",
  alternates: { canonical: "/pricing" },
};
export default function PricingPage() {
  return (
    <main className="page-wrap">
      <PageIntro
        eyebrow="INVEST IN YOUR INDEPENDENCE"
        title="The right support for your stage."
      >
        Start with clarity. Choose the level of support that fits your practice,
        your time, and your next goal.
      </PageIntro>
      <div className="pricing-grid">
        {packages.map((pack) => (
          <article
            key={pack.name}
            className={"package " + (pack.featured ? "featured" : "")}
          >
            <p className="eyebrow">
              {pack.featured ? "FOR GROWING PRACTICES" : "PRACTICE SUPPORT"}
            </p>
            <h3>{pack.name}</h3>
            <p className="price">{pack.price}</p>
            <p>{pack.bestFor}</p>
            <p>{pack.description}</p>
            <ul>
              {pack.deliverables.map((item) => (
                <li key={item}>
                  <Check size={18} />
                  {item}
                </li>
              ))}
            </ul>
            <Link className="button primary" href="/diagnostic">
              Find my fit <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </div>
      <section className="section-wrap">
        <h2 className="text-2xl font-bold">Start free. Decide with clarity.</h2>
        <p className="page-intro">
          The diagnostic, scorecard, and resource tools are free. Package scope
          and any applicable taxes are confirmed before you commit. No payment
          is collected on this website.
        </p>
        <Link className="text-link" href="/resources">
          Explore free resources <ArrowUpRight size={17} />
        </Link>
      </section>
    </main>
  );
}
