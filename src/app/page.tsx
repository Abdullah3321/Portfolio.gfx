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

      <a
        className={styles.whatsappButton}
        href="https://wa.me/923408144424?text=Hello%20Mehroz%2C%20I%27d%20like%20to%20discuss%20a%20project."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Mehroz on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.43Zm-8.44 18.28h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.87 9.87 0 0 1-1.52-5.24C2.2 6.45 6.63 2.02 12.08 2.02a9.84 9.84 0 0 1 7.01 2.91 9.87 9.87 0 0 1 2.9 7.02c0 5.45-4.43 9.88-9.91 9.88Zm5.42-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>

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
