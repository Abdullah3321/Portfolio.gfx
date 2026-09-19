import { NextResponse } from "next/server";
import { createSessionToken, sessionCookie, verifyAdminPassword } from "@/lib/admin-auth";
import { loginAllowed, requestFromSameOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!requestFromSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!loginAllowed(request)) return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
  let body: { email?: string; password?: string };
  try {
    body = await request.json() as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { email, password } = body;
  const emailValue = email?.trim().toLowerCase();
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const storedHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!expectedEmail || !storedHash || emailValue !== expectedEmail || !password || !verifyAdminPassword(password, storedHash)) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie(createSessionToken(emailValue!)));
  return response;
}
