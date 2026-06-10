import { NextRequest, NextResponse } from "next/server";
import { updateRequestStatus } from "@/lib/firestore";

export const runtime = "nodejs";

const ALLOWED_COLLECTIONS = ["soldout_requests", "custom_requests"] as const;
const ALLOWED_STATUS = ["pending", "contacted", "completed", "closed"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { collection, status } = await request.json();
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }
    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await updateRequestStatus(collection, id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update request status error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
