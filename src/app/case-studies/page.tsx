import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import base from "../page.module.css";
import { siteContent } from "@/content/site-content";
import { getPublicContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Case Studies | Mehroz",
  description:
    "Case studies showing how strategy, design, and e-commerce execution translated into growth.",
};

export default async function CaseStudiesPage() {
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
        <div className={styles.kicker}>{siteContent.caseStudiesPage.kicker}</div>
        <h1>{siteContent.caseStudiesPage.title}</h1>
        <p className={styles.intro}>{settings.caseStudiesIntro}</p>
      </section>

      <section className={styles.list} aria-label="Case studies">
        {siteContent.caseStudiesPage.cases.map((item) => {
          const mediaClass = styles[item.media];

          return (
            <article className={styles.caseRow} key={item.title}>
              <div className={`${styles.visual} ${mediaClass}`} aria-hidden="true">
                <span className={styles.metric}>{item.metric}</span>
              </div>

              <div className={styles.copy}>
                <div className={styles.meta}>
                  <span>{item.caseNo}</span>
                  <span>{item.category}</span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <span className={styles.pill}>{item.metric}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.cta}>
        <h2>{siteContent.caseStudiesPage.ctaTitle}</h2>
        <p>{siteContent.caseStudiesPage.ctaBody}</p>
        <Link className={styles.ctaButton} href="/contact">
          {siteContent.caseStudiesPage.ctaAction} ↗
        </Link>
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
          <Link href="/portfolio">Portfolio</Link>
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
