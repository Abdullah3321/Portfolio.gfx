import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { databaseConfigured } from "@/lib/db";
import { databaseUnavailable, unauthorized } from "@/lib/api-response";
import { requestFromSameOrigin } from "@/lib/request-security";
import { saveResume } from "@/lib/prisma-content-repository";

const maxResumeBytes = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!requestFromSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!databaseConfigured) return databaseUnavailable();
  if (!(await getAdminSession())) return unauthorized();

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("resume");
  if (!(file instanceof File)) return NextResponse.json({ error: "A PDF file is required." }, { status: 400 });
  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  if (file.size === 0 || file.size > maxResumeBytes) return NextResponse.json({ error: "The PDF must be between 1 byte and 10 MB." }, { status: 400 });

  const saved = await saveResume(file.name.replace(/[^a-zA-Z0-9._-]/g, "-"), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ fileName: saved.fileName, fileSize: saved.fileSize, updatedAt: saved.updatedAt.toISOString() });
}
