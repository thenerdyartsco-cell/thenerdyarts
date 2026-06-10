import { NextRequest, NextResponse } from "next/server";
import { reviewSchema } from "@/lib/validations";
import { getAllReviews, createReview } from "@/lib/firestore";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await getAllReviews();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("List reviews error:", error);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    const id = await createReview(result.data);
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
