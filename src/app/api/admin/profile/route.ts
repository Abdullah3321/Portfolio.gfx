import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { databaseConfigured } from "@/lib/db";
import { databaseUnavailable, unauthorized } from "@/lib/api-response";
import { saveProfile } from "@/lib/prisma-content-repository";
import { profileSchema } from "@/lib/validation";
import { requestFromSameOrigin } from "@/lib/request-security";

export async function PATCH(request: Request) {
  if (!requestFromSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!databaseConfigured) return databaseUnavailable();
  if (!(await getAdminSession())) return unauthorized();
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  return NextResponse.json(await saveProfile(parsed.data));
}
