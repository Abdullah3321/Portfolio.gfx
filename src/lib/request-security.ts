const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const windowMs = 60_000;
const maxLoginAttempts = 5;

export function requestFromSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const requestUrl = new URL(request.url);
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const requestOrigin = new URL(`${forwardedProtocol || requestUrl.protocol.replace(":", "")}://${forwardedHost || request.headers.get("host") || requestUrl.host}`);
    return new URL(origin).origin === requestOrigin.origin;
  } catch {
    return false;
  }
}

export function loginAllowed(request: Request) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = loginAttempts.get(address);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(address, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= maxLoginAttempts) return false;
  current.count += 1;
  return true;
}
