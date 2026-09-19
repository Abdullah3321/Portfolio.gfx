import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import base from "../page.module.css";
import { siteContent } from "@/content/site-content";
import { getPublicContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Services | Mehroz",
  description:
    "Services page for Mehroz covering e-commerce strategy, Shopify management, creative direction, CRO, and growth.",
};

export default async function ServicesPage() {
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
        <div className={styles.kicker}>{siteContent.servicesPage.kicker}</div>
        <h1>{siteContent.servicesPage.title}</h1>
        <p className={styles.intro}>{publicContent.settings.servicesIntro}</p>
      </section>

      <section className={styles.grid} aria-label="Service list">
        {publicContent.services.map((service) => (
          <article className={styles.card} key={service.id}>
            <div className={styles.cardTop}>
              <span className={styles.cardIndex}>{service.id}</span>
              <span className={styles.cardArrow}>↗</span>
            </div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </article>
        ))}

        <div className={styles.mutedPanel} aria-hidden="true" />
      </section>

      <section className={styles.cta}>
        <h2>{siteContent.servicesPage.ctaTitle}</h2>
        <p>{siteContent.servicesPage.ctaBody}</p>
        <Link className={styles.ctaButton} href="/contact">
          {siteContent.servicesPage.ctaAction} ↗
        </Link>
      </section>

      <footer className={base.footer}>
        <div>
          <Link className={styles.footerBrand} href="/">
            {siteContent.brandName}
          </Link>
          <p>
            E-commerce Expert & Creative Strategist.
            <br />
            Helping brands scale through strategy, design and e-commerce.
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
