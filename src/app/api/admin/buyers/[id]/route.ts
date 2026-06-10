import { NextRequest, NextResponse } from "next/server";
import { updatePurchaseRequestStatus } from "@/lib/firestore";
import type { PurchaseRequest } from "@/types";

export const runtime = "nodejs";

const ALLOWED: PurchaseRequest["status"][] = [
  "pending",
  "contacted",
  "completed",
  "closed_sold",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!ALLOWED.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await updatePurchaseRequestStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update buyer status error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
