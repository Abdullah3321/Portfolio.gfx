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
  const emailValue = email?.trim().replace(/^['"]|['"]$/g, "").toLowerCase();
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().replace(/^['"]|['"]$/g, "").toLowerCase();
  const storedHash = process.env.ADMIN_PASSWORD_HASH?.trim().replace(/^['"]|['"]$/g, "");
  const rejectionReason = !expectedEmail || !storedHash
    ? "missing-environment"
    : emailValue !== expectedEmail
      ? "email-mismatch"
      : !password || !verifyAdminPassword(password, storedHash)
        ? "password-mismatch"
        : null;
  if (rejectionReason) {
    console.warn("[admin-login] rejected", { reason: rejectionReason, hasEmail: Boolean(expectedEmail), hasPasswordHash: Boolean(storedHash), sessionSecretLength: process.env.ADMIN_SESSION_SECRET?.trim().length ?? 0 });
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie(createSessionToken(emailValue!)));
  return response;
}
