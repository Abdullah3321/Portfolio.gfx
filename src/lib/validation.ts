import { z } from "zod";

export const projectInputSchema = z.object({
  id: z.string().regex(/^$|^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional().default(""),
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(160),
  metric: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000),
  media: z.enum(["product", "workspace", "architecture"]),
  status: z.enum(["Published", "Draft"]),
  featured: z.boolean(),
  updatedAt: z.string().optional().default("Just now"),
}).strict();

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(180),
  bio: z.string().trim().max(2000),
  email: z.string().email(),
  location: z.string().trim().max(180),
  imageUrl: z.string().max(2_000_000).refine((value) => !value || value.startsWith("data:image/"), "Profile image must be an image data URL."),
}).strict();

export const serviceSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000),
  visible: z.boolean(),
}).strict();

export const settingsSchema = z.object({
  siteTitle: z.string().trim().min(1).max(180),
  siteDescription: z.string().trim().min(1).max(2000),
  contactEmail: z.string().email(),
  maintenanceMode: z.boolean(),
  analyticsEnabled: z.boolean(),
  contactTitle: z.string().trim().min(1).max(180),
  contactIntro: z.string().trim().min(1).max(2000),
  contactResponseTime: z.string().trim().min(1).max(180),
  contactLocation: z.string().trim().min(1).max(180),
  aboutIntro: z.string().trim().min(1).max(2000),
  aboutDetail: z.string().trim().min(1).max(2000),
  aboutProof: z.string().trim().min(1).max(2000),
  servicesIntro: z.string().trim().min(1).max(2000),
  portfolioIntro: z.string().trim().min(1).max(2000),
  caseStudiesIntro: z.string().trim().min(1).max(2000),
  experienceIntro: z.string().trim().min(1).max(2000),
}).strict();

export const adminContentPatchSchema = z.object({
  services: z.array(serviceSchema).max(100).optional(),
  settings: settingsSchema.optional(),
}).strict().refine((value) => value.services !== undefined || value.settings !== undefined, "At least one content section is required.");
