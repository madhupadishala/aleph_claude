"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X, Sprout } from "lucide-react";

const links = [
  ["Solutions", "/solutions"],
  ["For clinicians", "/for/doctors"],
  ["About", "/about"],
  ["Blogs", "/blogs"],
  ["Resources", "/resources"],
  ["Pricing", "/pricing"],
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-wrap">
          <Link href="/" className="wordmark" aria-label="Aleph home">
            <Sprout aria-hidden="true" />
            aleph<span className="logo-dot">.</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([label, href]) => {
              const active =
                path === href || (href !== "/" && path.startsWith(`${href}/`));
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  key={href}
                  href={href}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <Link className="button primary nav-cta" href="/diagnostic">
            Find my growth plan <ArrowUpRight size={17} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            className="mobile-nav"
            id="mobile-menu"
            aria-label="Mobile navigation"
          >
            {[
              ...links,
              ["For therapists", "/for/therapists"],
              ["For clinics", "/for/clinics"],
            ].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </nav>
        )}
      </header>
      <div id="content" tabIndex={-1}>
        {children}
      </div>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <Link className="wordmark" href="/">
              aleph.
            </Link>
            <p>
              More room for your practice.
              <br />
              More time for your patients.
            </p>
            <span className="small-copy">
              Independent practice growth · Hyderabad, India
            </span>
          </div>
          <div>
            <h2>Explore</h2>
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Built for you</h2>
            <Link href="/for/doctors">Independent doctors</Link>
            <Link href="/for/therapists">Therapists</Link>
            <Link href="/for/clinics">Local clinics</Link>
          </div>
          <div>
            <h2>Your choices</h2>
            <Link href="/privacy">Privacy & email preferences</Link>
            <Link href="/diagnostic">Free practice diagnostic</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Aleph</span>
          <span>Thoughtful growth. Independent practice.</span>
        </div>
      </footer>
    </>
  );
}
