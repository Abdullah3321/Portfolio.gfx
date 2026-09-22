import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { databaseConfigured } from "@/lib/db";
import { databaseUnavailable, unauthorized } from "@/lib/api-response";
import { getAdminContent, saveServices, saveSettings, saveTestimonials } from "@/lib/prisma-content-repository";
import { adminContentPatchSchema } from "@/lib/validation";
import { requestFromSameOrigin } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!databaseConfigured) return databaseUnavailable();
  if (!(await getAdminSession())) return unauthorized();
  return NextResponse.json(await getAdminContent());
}

export async function PATCH(request: Request) {
  if (!requestFromSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!databaseConfigured) return databaseUnavailable();
  if (!(await getAdminSession())) return unauthorized();
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const parsed = adminContentPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid content data.", details: parsed.error.flatten() }, { status: 400 });
  const content = parsed.data;
  const result: Record<string, unknown> = {};
  if (content.services) result.services = await saveServices(content.services);
  if (content.testimonials) result.testimonials = await saveTestimonials(content.testimonials);
  if (content.settings) result.settings = await saveSettings(content.settings);
  return NextResponse.json(result);
}
