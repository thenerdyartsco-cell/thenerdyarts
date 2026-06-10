import { NextRequest, NextResponse } from "next/server";
import { purchaseSchema } from "@/lib/validations";
import { createPurchaseRequest } from "@/lib/firestore";
import { sendAdminNotification, sendUserConfirmation } from "@/lib/resend";
import {
  adminPurchaseNotification,
  userPurchaseConfirmation,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = purchaseSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;

    await createPurchaseRequest(data);

    await Promise.allSettled([
      sendAdminNotification(
        `New Purchase Request: ${data.artworkTitle}`,
        adminPurchaseNotification(data)
      ),
      sendUserConfirmation(
        data.email,
        "Your Purchase Request - The Nerdy Arts",
        userPurchaseConfirmation({ name: data.name, artworkTitle: data.artworkTitle })
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Purchase request error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
