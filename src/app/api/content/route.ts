import { NextResponse } from "next/server";
import { getPublicContent } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPublicContent(), {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" },
  });
}