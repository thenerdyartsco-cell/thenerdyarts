import { NextRequest, NextResponse } from "next/server";
import { customRequestSchema } from "@/lib/validations";
import { createCustomRequest } from "@/lib/firestore";
import { sendAdminNotification, sendUserConfirmation } from "@/lib/resend";
import {
  adminCustomRequestNotification,
  userCustomRequestConfirmation,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = customRequestSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;

    await createCustomRequest(data);

    await Promise.allSettled([
      sendAdminNotification(
        "New Custom Art Request",
        adminCustomRequestNotification(data)
      ),
      sendUserConfirmation(
        data.email,
        "Custom Art Request Received - The Nerdy Arts",
        userCustomRequestConfirmation({ name: data.name })
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Custom request error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
