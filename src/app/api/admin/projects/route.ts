import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { databaseConfigured } from "@/lib/db";
import { databaseUnavailable, unauthorized } from "@/lib/api-response";
import { removeProject, saveProject } from "@/lib/prisma-content-repository";
import { projectInputSchema } from "@/lib/validation";
import { requestFromSameOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!requestFromSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!databaseConfigured) return databaseUnavailable();
  if (!(await getAdminSession())) return unauthorized();
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const parsed = projectInputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid project data." }, { status: 400 });
  return NextResponse.json(await saveProject(parsed.data));
}

export async function DELETE(request: Request) {
  if (!requestFromSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!databaseConfigured) return databaseUnavailable();
  if (!(await getAdminSession())) return unauthorized();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  await removeProject(id);
  return NextResponse.json({ ok: true });
}
