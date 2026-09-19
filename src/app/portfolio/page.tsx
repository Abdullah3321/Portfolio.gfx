import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import base from "../page.module.css";
import { siteContent } from "@/content/site-content";
import { getPublicContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Portfolio | Mehroz",
  description:
    "Portfolio page showing brands scaled through strategy, design, and e-commerce.",
};

export default async function PortfolioPage() {
  const publicContent = await getPublicContent();
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
        <div className={styles.kicker}>{siteContent.portfolioPage.kicker}</div>
        <h1>{siteContent.portfolioPage.title}</h1>
        <p className={styles.intro}>{publicContent.settings.portfolioIntro}</p>
      </section>

      <section className={styles.grid} aria-label="Portfolio projects">
        {publicContent.projects.map((project) => {
          const mediaClass = styles[project.media];

          return (
            <article className={styles.card} key={project.title}>
              <div className={`${styles.media} ${mediaClass}`}>
                <span className={styles.metric}>{project.metric}</span>
              </div>
              <h2>{project.title}</h2>
              <p>{project.category}</p>
            </article>
          );
        })}
      </section>

      <section className={styles.cta}>
        <h2>{siteContent.portfolioPage.ctaTitle}</h2>
        <p>{siteContent.portfolioPage.ctaBody}</p>
        <Link className={styles.ctaButton} href="/contact">
          {siteContent.portfolioPage.ctaAction} ↗
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
          <a href={`mailto:${publicContent.settings.contactEmail}`}>{publicContent.settings.contactEmail}</a>
          <span>{publicContent.settings.contactLocation}</span>
        </div>
      </footer>
    </main>
  );
}
