import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import base from "../page.module.css";
import { siteContent } from "@/content/site-content";
import ContactForm from "./ContactForm";
import { getPublicContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Contact | Mehroz",
  description:
    "Get in touch with Mehroz to discuss your brand strategy, Shopify project, or creative direction needs.",
};

export default async function ContactPage() {
  const { settings } = await getPublicContent();
  return (
    <main className={styles.page} id="top">
      <header className={base.header}>
        <Link className={base.brand} href="/" aria-label="Mehroz home">
          {siteContent.brandName}
        </Link>

        <nav className={base.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/case-studies">Case Studies</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <Link className={base.navButton} href="/contact">
          Let&apos;s talk ↗
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.kicker}>{siteContent.contactPage.kicker}</div>
        <h1>{settings.contactTitle}</h1>
        <p className={styles.intro}>{settings.contactIntro}</p>
      </section>

      {/* ── Main contact grid ── */}
      <section className={styles.contactGrid} aria-label="Contact details and form">
        {/* Left: contact info */}
        <aside className={styles.contactInfo}>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>EMAIL</p>
            <a
              className={styles.infoValue}
              href={`mailto:${settings.contactEmail}`}
            >
              {settings.contactEmail}
            </a>
          </div>

          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>RESPONSE TIME</p>
            <p className={styles.infoValue}>{settings.contactResponseTime}</p>
          </div>

          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>LOCATION</p>
            <p className={styles.infoValue}>{settings.contactLocation}</p>
          </div>
        </aside>

        {/* Right: form */}
        <div className={styles.formWrapper}>
          <ContactForm />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={base.footer}>
        <div>
          <Link className={base.footerBrand} href="/">
            {siteContent.brandName}
          </Link>
          <p>
            E-commerce Expert &amp; Creative Strategist.
            <br />
            Helping brands scale through strategy, design and e-commerce.
          </p>
        </div>

        <div>
          <h3>Navigate</h3>
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/case-studies">Case Studies</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div>
          <h3>More</h3>
          <Link href="/about">About</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/experience">Experience</Link>
        </div>

        <div>
          <h3>Get in touch</h3>
          <a href={`mailto:${settings.contactEmail}`}>
            {settings.contactEmail}
          </a>
          <a href={`mailto:${settings.contactEmail}?subject=Project%20Inquiry`}>
            Start an inquiry
          </a>
          <span>{settings.contactLocation}</span>
        </div>
      </footer>
    </main>
  );
}
