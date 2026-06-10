import { NextRequest, NextResponse } from "next/server";
import { artworkSchema } from "@/lib/validations";
import { updateArtwork, deleteArtwork } from "@/lib/firestore";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = artworkSchema.partial().safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    await updateArtwork(id, result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update artwork error:", error);
    return NextResponse.json({ error: "Failed to update artwork" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteArtwork(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete artwork error:", error);
    return NextResponse.json({ error: "Failed to delete artwork" }, { status: 500 });
  }
}
