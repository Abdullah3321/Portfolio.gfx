import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "mehroz_admin_session";
const sessionDurationSeconds = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters");
  return value;
}

export function hashAdminPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyAdminPassword(password: string, storedHash: string) {
  const [algorithm, salt, expected] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString("hex");
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(email: string) {
  const payload = `${email}|${Date.now() + sessionDurationSeconds * 1000}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const payload = Buffer.from(encoded, "base64url").toString("utf8");
  if (sign(payload) !== signature) return null;
  const [email, expiresAt] = payload.split("|");
  if (!email || Number(expiresAt) < Date.now()) return null;
  return email;
}

export async function getAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(cookieName)?.value);
}

export function sessionCookie(token: string) {
  return { name: cookieName, value: token, httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", maxAge: sessionDurationSeconds, path: " /".trim() };
}

export { cookieName };
