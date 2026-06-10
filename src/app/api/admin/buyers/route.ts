import { NextResponse } from "next/server";
import { getPurchaseRequests } from "@/lib/firestore";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await getPurchaseRequests();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("List buyers error:", error);
    return NextResponse.json({ error: "Failed to load buyer requests" }, { status: 500 });
  }
}
