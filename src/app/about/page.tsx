import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import base from "../page.module.css";
import { siteContent } from "@/content/site-content";
import { getPublicContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "About | Mehroz",
  description:
    "About page for Mehroz, a strategist combining brand, creative, and commerce.",
};

export default async function AboutPage() {
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
          <Link href="/experience">Experience</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <Link className={base.navButton} href="/contact">
          Let&apos;s talk ↗
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.kicker}>{siteContent.about.kicker}</div>
        <h1>{siteContent.about.title}</h1>
        <p className={styles.intro}>{settings.aboutIntro}</p>
      </section>

      <section className={styles.story}>
        <div className={styles.visualPanel} aria-hidden="true">
          <div className={styles.visualCardLarge} />
          <div className={styles.visualCardSmallTop}>
            <span>Shoiry</span>
            <div className={styles.packshotTall} />
          </div>
          <div className={styles.visualCardSmallBottom}>
            <div className={styles.packshotStrip} />
          </div>
          <div className={styles.visualLaptop} />
        </div>

        <div className={styles.copyPanel}>
          <p>{settings.aboutDetail}</p>
          <p>{settings.aboutProof}</p>
          <div className={styles.actions}>
            <Link
              className={styles.primaryAction}
              href={`mailto:${settings.contactEmail}?subject=Resume%20Request`}
            >
              Request resume ⤴
            </Link>
            <Link className={styles.secondaryAction} href="/contact">
              Work with me ↗
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.capabilities}>
        <p className={styles.sectionLabel}>CAPABILITIES</p>
        <div className={styles.chips}>
          {siteContent.about.capabilities.map((capability) => (
            <span key={capability}>{capability}</span>
          ))}
        </div>
      </section>

      <section className={base.stats} aria-label="Key metrics">
        {siteContent.about.stats.map((metric) => (
          <article key={metric.label} className={base.statCard}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <footer className={base.footer}>
        <div>
          <Link className={base.footerBrand} href="/">
            {siteContent.brandName}
          </Link>
          <p>
            E-commerce Expert & Creative Strategist.
            <br />
            Helping brands scale through strategy, design, and e-commerce.
          </p>
        </div>

        <div>
          <h3>Navigate</h3>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/case-studies">Case Studies</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div>
          <h3>More</h3>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/experience">Experience</Link>
        </div>

        <div>
          <h3>Get in touch</h3>
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          <span>{settings.contactLocation}</span>
        </div>
      </footer>
    </main>
  );
}
