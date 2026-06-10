import { NextResponse } from "next/server";
import { getAdminCredentials, issueResetToken } from "@/lib/admin-store";
import { sendAdminNotification } from "@/lib/resend";
import { adminResetEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST() {
  try {
    const creds = await getAdminCredentials();
    // Only email a reset link if an admin actually exists; always respond the same.
    if (creds) {
      const token = await issueResetToken();
      const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const link = `${base}/admin/reset?token=${token}`;
      await sendAdminNotification("Reset your admin password", adminResetEmail({ link }));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    // Still respond success to avoid leaking state.
    return NextResponse.json({ success: true });
  }
}
