import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { siteContent } from "@/content/site-content";
import { getPublicContent } from "@/lib/public-content";

export default async function Home() {
  const { profile, testimonials } = await getPublicContent();
  const profileImage = profile?.imageUrl || "/profile-portrait.jpg";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mehroz",
    jobTitle: "E-commerce Strategy & Creative Direction",
    description:
      "Portfolio website for an e-commerce strategist, Shopify consultant, and creative director.",
    areaServed: "Worldwide",
  };

  return (
    <main className={styles.page} id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Mehroz home">
          mehroz.
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <Link className={styles.navButton} href="/contact">
          Let&apos;s talk ↗
        </Link>
      </header>

      <section className={styles.hero} id="home">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} /> E-COMMERCE EXPERT & CREATIVE
            STRATEGIST
          </p>

          <h1>
            Helping Brands Scale Through Strategy, Design <em>&amp; E-Commerce.</em>
          </h1>

          <p className={styles.lead}>
            I partner with founders to build premium D2C brands - combining sharp
            strategy, editorial creative, and revenue-focused e-commerce execution.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/contact">
              Start a project ↗
            </Link>
            <Link className={styles.secondaryAction} href="/portfolio">
              View work
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          {profileImage ? (
            <div className={styles.profileImageFrame}>
              <Image
                className={styles.profileImage}
                src={profileImage}
                alt={profile?.name ? `${profile.name} portrait` : "Profile portrait"}
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
                unoptimized
              />
            </div>
          ) : (
            <>
              <div className={styles.heroMonogram}>D</div>
              <div className={styles.portraitFrame} aria-hidden="true">
                <div className={styles.portraitBackdrop} />
                <div className={styles.portraitHair} />
                <div className={styles.portraitFace} />
                <div className={styles.portraitNeck} />
                <div className={styles.portraitJacket} />
                <div className={styles.portraitShirt} />
                <div className={styles.portraitShadow} />
              </div>
            </>
          )}
          <div className={styles.heroBadge}>BASED IN DUBAI — WORLDWIDE</div>
        </div>
      </section>

      <section className={styles.ticker} aria-label="Selected clients">
        <div className={styles.tickerTrack}>
          {[...siteContent.brandLogos, ...siteContent.brandLogos].map((brand, index) => (
            <span key={`${brand}-${index}`}>{brand}</span>
          ))}
        </div>
      </section>

      <section className={styles.stats} aria-label="Key metrics">
        {siteContent.metrics.map((metric) => (
          <article key={metric.label} className={styles.statCard}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className={styles.services} id="services">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionKicker}>01</p>
            <h2>A full-stack partner for modern brands</h2>
          </div>
          <Link href="/contact">All services →</Link>
        </div>

        <div className={styles.serviceList}>
          {siteContent.services.map((service) => (
            <article className={styles.serviceRow} key={service.id}>
              <span>{service.id}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.portfolio} id="portfolio">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionKicker}>SELECTED WORK</p>
            <h2>Brands I&apos;ve scaled</h2>
          </div>
        </div>

        <div className={styles.portfolioGrid}>
          {siteContent.portfolio.map((item) => {
            const mediaClass = styles[item.media];

            return (
              <article className={styles.portfolioCard} key={item.title}>
                <div className={`${styles.media} ${mediaClass}`}>
                  <div className={styles.mediaMark} />
                </div>
                <div className={styles.cardMeta}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                  </div>
                  <span>{item.metric}</span>
                </div>
              </article>
            );
          })}
        </div>

        <Link className={styles.inlineButton} href="/portfolio">
          See full portfolio →
        </Link>
      </section>

      <section className={styles.testimonials} id="experience">
        <div className={styles.sectionHeadingDark}>
          <h2>Words from founders</h2>
        </div>

        <div className={styles.testimonialViewport}>
          <div className={styles.testimonialTrack}>
            {[...testimonials, ...testimonials].map((item, index) => (
              <article className={styles.testimonialCard} key={`${item.id}-${index}`}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.testimonialAvatar}>
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={`${item.name} profile`} fill sizes="64px" unoptimized />
                    ) : (
                      item.name.slice(0, 1)
                    )}
                  </div>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
                <p>“{item.quote}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta} id="contact">
        <p>Let&apos;s build something that</p>
        <h2>
          actually <em>scales.</em>
        </h2>
        <a href="mailto:hello@mehrozgfx.com">Start a conversation ↗</a>
      </section>

      <footer className={styles.footer}>
        <div>
          <Link className={styles.footerBrand} href="/">
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
          <a href={`mailto:${siteContent.contactEmail}`}>{siteContent.contactEmail}</a>
          <span>{siteContent.locationLine}</span>
        </div>
      </footer>
    </main>
  );
}
