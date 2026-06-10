import { NextResponse } from "next/server";
import { getSoldOutRequests, getCustomRequests } from "@/lib/firestore";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [soldOut, custom] = await Promise.all([
      getSoldOutRequests(),
      getCustomRequests(),
    ]);
    return NextResponse.json({ soldOut, custom });
  } catch (error) {
    console.error("List requests error:", error);
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}
