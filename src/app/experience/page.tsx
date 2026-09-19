import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import base from "../page.module.css";
import { siteContent } from "@/content/site-content";
import { getPublicContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Experience | Mehroz",
  description:
    "Seven years of experience scaling D2C brands across agencies, studios and direct founder partnerships.",
};

export default async function ExperiencePage() {
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

      <section className={styles.hero}>
        <div className={styles.kicker}>{siteContent.experiencePage.kicker}</div>
        <h1>{siteContent.experiencePage.title}</h1>
        <p className={styles.intro}>{settings.experienceIntro}</p>
      </section>

      <section className={styles.timeline} aria-label="Career timeline">
        {siteContent.experiencePage.timeline.map((item) => (
          <article className={styles.timelineRow} key={item.title}>
            <div className={styles.periodCol}>
              <span
                className={`${styles.period} ${item.isCurrent ? styles.periodCurrent : ""}`}
              >
                {item.period}
              </span>
            </div>

            <div className={styles.dividerCol} aria-hidden="true">
              <div className={styles.dot} />
              <div className={styles.line} />
            </div>

            <div className={styles.copyCol}>
              <h2>{item.title}</h2>
              <p className={styles.company}>{item.company}</p>
              <p className={styles.description}>{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.resumeCta} aria-label="Request resume">
        <div className={styles.resumeCtaInner}>
          <div className={styles.resumeCtaLeft}>
            <h2>Want the full picture?</h2>
            <p>Request my resume for a detailed breakdown.</p>
            <div className={styles.chips}>
              {siteContent.experiencePage.resumeCapabilities.map((cap) => (
                <span key={cap}>{cap}</span>
              ))}
            </div>
          </div>
          <a
            className={styles.downloadButton}
            href="/api/resume/download"
            id="download-resume"
          >
            Download resume ⤓
          </a>
        </div>
      </section>

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
          <a href={`mailto:${siteContent.contactEmail}?subject=Resume%20Request`}>Request resume</a>
          <span>{settings.contactLocation}</span>
        </div>
      </footer>
    </main>
  );
}
