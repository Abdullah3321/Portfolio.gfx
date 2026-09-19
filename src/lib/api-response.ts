import { NextResponse } from "next/server";

export function databaseUnavailable() {
  return NextResponse.json({ error: "Database is not configured. Add DATABASE_URL to enable production persistence." }, { status: 503 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
}
