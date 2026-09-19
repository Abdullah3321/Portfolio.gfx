import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { databaseConfigured } from "@/lib/db";
import { databaseUnavailable, unauthorized } from "@/lib/api-response";
import { markInquiryRead } from "@/lib/prisma-content-repository";
import { requestFromSameOrigin } from "@/lib/request-security";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requestFromSameOrigin(_request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!databaseConfigured) return databaseUnavailable();
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;
  return NextResponse.json(await markInquiryRead(id));
}
