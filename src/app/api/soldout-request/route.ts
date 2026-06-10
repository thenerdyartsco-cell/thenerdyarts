import { NextRequest, NextResponse } from "next/server";
import { soldOutRequestSchema } from "@/lib/validations";
import { createSoldOutRequest } from "@/lib/firestore";
import { sendAdminNotification, sendUserConfirmation } from "@/lib/resend";
import {
  adminSoldOutNotification,
  userSoldOutConfirmation,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = soldOutRequestSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;

    await createSoldOutRequest(data);

    await Promise.allSettled([
      sendAdminNotification(
        `Sold Out Piece Request: ${data.artworkTitle}`,
        adminSoldOutNotification(data)
      ),
      sendUserConfirmation(
        data.email,
        "Request Received - The Nerdy Arts",
        userSoldOutConfirmation({ name: data.name, artworkTitle: data.artworkTitle })
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sold out request error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
