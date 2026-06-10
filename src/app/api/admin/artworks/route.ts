import { NextRequest, NextResponse } from "next/server";
import { artworkSchema } from "@/lib/validations";
import { getAllArtworks, createArtwork } from "@/lib/firestore";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await getAllArtworks();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("List artworks error:", error);
    return NextResponse.json({ error: "Failed to load artworks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = artworkSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    const id = await createArtwork(result.data);
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Create artwork error:", error);
    return NextResponse.json({ error: "Failed to create artwork" }, { status: 500 });
  }
}
