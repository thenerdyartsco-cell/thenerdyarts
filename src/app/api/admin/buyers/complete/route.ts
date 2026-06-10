import { NextRequest, NextResponse } from "next/server";
import { completeSale } from "@/lib/firestore";
import { sendUserConfirmation } from "@/lib/resend";
import { buyerSoldNotice } from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { artworkId, requestId } = await request.json();
    if (!artworkId || !requestId) {
      return NextResponse.json({ error: "Missing artworkId or requestId" }, { status: 400 });
    }

    const { notify } = await completeSale(artworkId, requestId);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await Promise.allSettled(
      notify.map((b) =>
        sendUserConfirmation(
          b.email,
          `Update on "${b.artworkTitle}" - The Nerdy Arts`,
          buyerSoldNotice({ name: b.name, artworkTitle: b.artworkTitle, siteUrl })
        )
      )
    );

    return NextResponse.json({ success: true, notified: notify.length });
  } catch (error) {
    console.error("Complete sale error:", error);
    return NextResponse.json({ error: "Failed to complete sale" }, { status: 500 });
  }
}
