export type AdminProject = {
  id: string;
  title: string;
  category: string;
  metric: string;
  description: string;
  media: "product" | "workspace" | "architecture";
  status: "Published" | "Draft";
  featured: boolean;
  updatedAt: string;
};

export type AdminService = {
  id: string;
  title: string;
  description: string;
  visible: boolean;
};

export type AdminProfile = {
  name: string;
  role: string;
  bio: string;
  email: string;
  location: string;
  imageUrl: string;
};

export type AdminInquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  subject: string;
  status: "New" | "Read" | "Archived";
  receivedAt: string;
};

export type AdminAnalytics = {
  visitors: number;
  pageViews: number;
  inquiries: number;
  resumeRequests: number;
  topPages: { page: string; views: number; change: string }[];
  traffic: number[];
};

export type AdminSettings = {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  contactTitle: string;
  contactIntro: string;
  contactResponseTime: string;
  contactLocation: string;
  aboutIntro: string;
  aboutDetail: string;
  aboutProof: string;
  servicesIntro: string;
  portfolioIntro: string;
  caseStudiesIntro: string;
  experienceIntro: string;
};

export type AdminResume = {
  fileName: string;
  fileSize: number;
  updatedAt: string;
} | null;

export type AdminContent = {
  profile: AdminProfile;
  projects: AdminProject[];
  services: AdminService[];
  inquiries: AdminInquiry[];
  analytics: AdminAnalytics;
  settings: AdminSettings;
  resume: AdminResume;
};

export const initialAdminContent: AdminContent = {
  profile: {
    name: "Mehroz",
    role: "E-commerce Expert & Creative Strategist",
    bio: "I help modern brands grow through strategy, design, and e-commerce execution.",
    email: "hello@mehrozgfx.com",
    location: "Dubai - Working Worldwide",
    imageUrl: "",
  },
  projects: [
    {
      id: "brickly",
      title: "Brickly",
      category: "D2C / Home & Living",
      metric: "+214% revenue in 6 months",
      description: "Premium modular furniture storefront and growth strategy.",
      media: "product",
      status: "Published",
      featured: true,
      updatedAt: "Today",
    },
    {
      id: "dental-factor",
      title: "Dental Factor",
      category: "Healthcare E-commerce",
      metric: "2.9x return on ad spend",
      description: "Catalog restructuring and product detail experience for profitable scale.",
      media: "workspace",
      status: "Published",
      featured: true,
      updatedAt: "Yesterday",
    },
    {
      id: "rastak",
      title: "Rastak",
      category: "Fashion & Lifestyle",
      metric: "+88% conversion rate",
      description: "Editorial brand refresh and conversion optimization program.",
      media: "architecture",
      status: "Published",
      featured: false,
      updatedAt: "12 Aug 2026",
    },
    {
      id: "coco-crave",
      title: "CocoCrave",
      category: "Food & Beverage",
      metric: "3.4x AOV growth",
      description: "Bundle strategy, subscriptions, and a repeat-purchase content engine.",
      media: "product",
      status: "Draft",
      featured: false,
      updatedAt: "08 Aug 2026",
    },
  ],
  services: [
    { id: "strategy", title: "E-commerce Strategy", description: "Roadmaps that turn browsers into buyers.", visible: true },
    { id: "shopify", title: "Shopify Management", description: "Store builds and operations engineered for scale.", visible: true },
    { id: "creative", title: "Creative Direction", description: "Editorial campaigns that keep brands cohesive.", visible: true },
    { id: "cro", title: "Conversion Optimization", description: "Data-led improvements to conversion and lifetime value.", visible: true },
  ],
  inquiries: [],
  analytics: {
    visitors: 0,
    pageViews: 0,
    inquiries: 0,
    resumeRequests: 0,
    topPages: [],
    traffic: Array(12).fill(0),
  },
  settings: {
    siteTitle: "Mehroz | E-commerce Strategy & Creative Direction",
    siteDescription: "A refined portfolio website for a strategic e-commerce and brand consultant.",
    contactEmail: "hello@mehrozgfx.com",
    maintenanceMode: false,
    analyticsEnabled: true,
    contactTitle: "Let's talk about your brand.",
    contactIntro: "Tell me where you are and where you want to be. I usually reply within 24 hours.",
    contactResponseTime: "Usually within 24 hours",
    contactLocation: "Dubai - Working Worldwide",
    aboutIntro: "I help modern brands grow through strategy, design, and e-commerce execution.",
    aboutDetail: "The best work sits at the intersection of a sharp point of view and a commercial outcome.",
    aboutProof: "From first sketch to post-launch optimization, I stay close to the details that make a brand feel considered and perform.",
    servicesIntro: "Engagements are shaped around your goals. Below is the full range of ways I plug into a brand.",
    portfolioIntro: "A selection of brands scaled through strategy, design and e-commerce.",
    caseStudiesIntro: "A closer look at the strategy, execution and outcomes behind selected engagements.",
    experienceIntro: "Seven years of experience scaling D2C brands across agencies, studios and direct founder partnerships.",
  },
  resume: null,
};

