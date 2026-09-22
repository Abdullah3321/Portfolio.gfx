import { siteContent } from "@/content/site-content";
import { databaseConfigured } from "./db";
import { getAdminContent } from "./prisma-content-repository";

export async function getPublicContent() {
  const fallbackSettings = {
    siteTitle: "Mehroz | E-commerce Strategy & Creative Direction",
    siteDescription: "A refined portfolio website for a strategic e-commerce and brand consultant.",
    contactEmail: siteContent.contactEmail,
    maintenanceMode: false,
    analyticsEnabled: true,
    contactTitle: siteContent.contactPage.title,
    contactIntro: siteContent.contactPage.intro,
    contactResponseTime: "Usually within 24 hours",
    contactLocation: siteContent.contactPage.location,
    aboutIntro: siteContent.about.body,
    aboutDetail: siteContent.about.detail,
    aboutProof: siteContent.about.proof,
    servicesIntro: siteContent.servicesPage.intro,
    portfolioIntro: siteContent.portfolioPage.intro,
    caseStudiesIntro: siteContent.caseStudiesPage.intro,
    experienceIntro: siteContent.experiencePage.intro,
  };
  const fallbackTestimonials = siteContent.testimonials.map((testimonial, index) => ({ ...testimonial, id: `fallback-${index}`, imageUrl: "", sortOrder: index }));
  if (!databaseConfigured) return { profile: null, projects: siteContent.portfolioPage.projects, services: siteContent.services, testimonials: fallbackTestimonials, settings: fallbackSettings };
  try {
    const content = await getAdminContent();
    return {
      profile: content.profile,
      projects: content.projects.filter((project) => project.status === "Published"),
      services: content.services.filter((service) => service.visible),
      testimonials: content.testimonials,
      settings: content.settings ?? fallbackSettings,
    };
  } catch {
    return { profile: null, projects: siteContent.portfolioPage.projects, services: siteContent.services, testimonials: fallbackTestimonials, settings: fallbackSettings };
  }
}
