import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendAdminNotification, sendUserConfirmation } from "@/lib/resend";
import {
  adminContactNotification,
  userContactConfirmation,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;

    // Contact messages are not stored — we simply notify the admin inbox.
    await Promise.allSettled([
      sendAdminNotification(
        `New Contact Message from ${data.name}`,
        adminContactNotification(data)
      ),
      sendUserConfirmation(
        data.email,
        "Message Received - The Nerdy Arts",
        userContactConfirmation({ name: data.name })
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
