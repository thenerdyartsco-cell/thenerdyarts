import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validations";
import {
  getAdminCredentials,
  verifyPassword,
  isLockedOut,
  recordLoginFailure,
  issueOtp,
} from "@/lib/admin-store";
import { sendAdminNotification } from "@/lib/resend";
import { adminLoginCodeEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

const GENERIC_ERROR = "Invalid email or password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = adminLoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    if (await isLockedOut()) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const { email, password } = result.data;
    const creds = await getAdminCredentials();

    const valid =
      creds &&
      creds.email === email.toLowerCase() &&
      (await verifyPassword(password, creds.passwordHash));

    if (!valid) {
      await recordLoginFailure();
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    // Password OK — issue a one-time code to the admin inbox (2FA).
    const code = await issueOtp();
    await sendAdminNotification("Your admin login code", adminLoginCodeEmail({ code }));

    return NextResponse.json({ otpRequired: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
