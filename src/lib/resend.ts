import { Resend } from "resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "thenerdyarts.co@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "The Nerdy Arts <noreply@thenerdyarts.co.in>";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

export async function sendAdminNotification(subject: string, html: string) {
  const resend = getResendClient();
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}

export async function sendUserConfirmation(to: string, subject: string, html: string) {
  const resend = getResendClient();
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}
