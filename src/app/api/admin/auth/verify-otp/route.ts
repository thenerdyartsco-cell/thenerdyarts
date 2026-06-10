import { NextRequest, NextResponse } from "next/server";
import { otpSchema } from "@/lib/validations";
import { verifyOtp, getAdminCredentials, clearLoginFailures } from "@/lib/admin-store";
import { startSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = otpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Enter the 6-digit code" }, { status: 400 });
    }

    const ok = await verifyOtp(result.data.code);
    if (!ok) {
      return NextResponse.json(
        { error: "That code is invalid or has expired" },
        { status: 401 }
      );
    }

    const creds = await getAdminCredentials();
    if (!creds) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    await startSession({ email: creds.email });
    await clearLoginFailures();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
