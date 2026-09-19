import { NextResponse } from "next/server";
import { getResumeFile } from "@/lib/prisma-content-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const resume = await getResumeFile();
  if (!resume) return NextResponse.json({ error: "Resume is not available." }, { status: 404 });

  return new NextResponse(new Uint8Array(resume.fileData), {
    headers: {
      "Content-Type": resume.mimeType,
      "Content-Length": String(resume.fileSize),
      "Content-Disposition": `attachment; filename="${resume.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
