import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations";
import {
  consumeResetToken,
  getAdminCredentials,
  setAdminPassword,
  clearLoginFailures,
} from "@/lib/admin-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { token, password } = result.data;
    const valid = await consumeResetToken(token);
    if (!valid) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const creds = await getAdminCredentials();
    if (!creds) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    await setAdminPassword(creds.email, password);
    await clearLoginFailures();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
