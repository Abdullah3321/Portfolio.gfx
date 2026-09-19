import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { AdminProfile, AdminProject, AdminService } from "./admin-data";

const profileSelect = { name: true, role: true, bio: true, email: true, location: true, imageUrl: true } as const;
const projectSelect = { id: true, title: true, category: true, metric: true, description: true, media: true, status: true, featured: true, updatedAt: true } as const;

function projectResult(project: Prisma.ProjectGetPayload<{ select: typeof projectSelect }>): AdminProject {
  return { ...project, id: project.id, media: project.media as AdminProject["media"], status: project.status as AdminProject["status"], updatedAt: project.updatedAt.toISOString() };
}

export async function getAdminContent() {
  const [profile, projects, services, inquiries, settings, resume, analytics, topPages] = await Promise.all([
    prisma.profile.findFirst({ orderBy: { updatedAt: "desc" }, select: profileSelect }),
    prisma.project.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }], select: projectSelect }),
    prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 50, select: { id: true, name: true, company: true, email: true, subject: true, status: true, createdAt: true } }),
    prisma.siteSettings.findUnique({ where: { id: true } }),
    prisma.resume.findUnique({ where: { id: true }, select: { fileName: true, fileSize: true, updatedAt: true } }),
    prisma.analyticsEvent.groupBy({ by: ["eventName"], _count: { _all: true } }),
    prisma.analyticsEvent.groupBy({ by: ["path"], where: { eventName: "page_view" }, _count: { _all: true }, orderBy: { _count: { path: "desc" } }, take: 5 }),
  ]);
  const count = (eventName: string) => analytics.find((item) => item.eventName === eventName)?._count._all ?? 0;
  return {
    profile,
    projects: projects.map(projectResult),
    services: services.map((service) => ({ id: service.id, title: service.title, description: service.description, visible: service.visible })),
    inquiries: inquiries.map((inquiry) => ({ id: inquiry.id, name: inquiry.name, company: inquiry.company, email: inquiry.email, subject: inquiry.subject, status: inquiry.status as "New" | "Read" | "Archived", receivedAt: inquiry.createdAt.toISOString() })),
    settings,
    resume: resume ? { fileName: resume.fileName, fileSize: resume.fileSize, updatedAt: resume.updatedAt.toISOString() } : null,
    analytics: { visitors: 0, pageViews: count("page_view"), inquiries: await prisma.inquiry.count(), resumeRequests: count("resume_request"), topPages: topPages.map((page) => ({ page: page.path, views: page._count._all, change: "" })), traffic: Array(12).fill(0) },
  };
}

export async function saveResume(fileName: string, fileData: Buffer) {
  const bytes = new Uint8Array(fileData) as unknown as Uint8Array<ArrayBuffer>;
  return prisma.resume.upsert({
    where: { id: true },
    create: { id: true, fileName, mimeType: "application/pdf", fileSize: fileData.length, fileData: bytes },
    update: { fileName, mimeType: "application/pdf", fileSize: fileData.length, fileData: bytes },
    select: { fileName: true, fileSize: true, updatedAt: true },
  });
}

export async function getResumeFile() {
  return prisma.resume.findUnique({ where: { id: true }, select: { fileName: true, mimeType: true, fileSize: true, fileData: true } });
}

export async function saveProfile(profile: AdminProfile) {
  const existing = await prisma.profile.findFirst({ orderBy: { updatedAt: "desc" }, select: { id: true } });
  const data = { name: profile.name, role: profile.role, bio: profile.bio, email: profile.email, location: profile.location, imageUrl: profile.imageUrl };
  return existing ? prisma.profile.update({ where: { id: existing.id }, data, select: profileSelect }) : prisma.profile.create({ data, select: profileSelect });
}

export async function saveProject(project: AdminProject) {
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
  const data = { title: project.title, category: project.category, metric: project.metric, description: project.description, media: project.media, status: project.status, featured: project.featured };
  const existing = project.id ? await prisma.project.findUnique({ where: { id: project.id }, select: { id: true } }) : null;
  const saved = existing
    ? await prisma.project.update({ where: { id: existing.id }, data, select: projectSelect })
    : await prisma.project.upsert({ where: { slug }, create: { slug, ...data, sortOrder: await prisma.project.count() }, update: data, select: projectSelect });
  return projectResult(saved);
}

export async function removeProject(projectId: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId);
  await prisma.project.deleteMany({ where: isUuid ? { OR: [{ id: projectId }, { slug: projectId }] } : { slug: projectId } });
}

export async function saveServices(services: AdminService[]) {
  return prisma.$transaction(async (transaction) => {
    for (const [sortOrder, service] of services.entries()) {
      await transaction.service.upsert({ where: { id: service.id }, create: { id: service.id, title: service.title, description: service.description, visible: service.visible, sortOrder }, update: { title: service.title, description: service.description, visible: service.visible, sortOrder } });
    }
    return services;
  });
}

export async function saveSettings(settings: { siteTitle: string; siteDescription: string; contactEmail: string; maintenanceMode: boolean; analyticsEnabled: boolean }) {
  return prisma.siteSettings.update({ where: { id: true }, data: settings });
}

export async function markInquiryRead(id: string) {
  return prisma.inquiry.update({ where: { id }, data: { status: "Read" }, select: { id: true, name: true, company: true, email: true, subject: true, status: true, createdAt: true } }).then((inquiry) => ({ ...inquiry, receivedAt: inquiry.createdAt.toISOString() }));
}
