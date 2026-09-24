import { NextResponse } from "next/server";
import { cookieName } from "@/lib/admin-auth";
import { requestFromSameOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!requestFromSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: cookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
  return response;
}
