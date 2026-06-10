import { NextRequest, NextResponse } from "next/server";
import { getArtworks } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const startAfter = searchParams.get("startAfter") || undefined;
    const filter = (searchParams.get("filter") || "all") as "all" | "available" | "sold";

    const result = await getArtworks({ limit, startAfter, filter });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json({ error: "Failed to fetch artworks" }, { status: 500 });
  }
}
