const baseStyle = `
  font-family: Georgia, 'Times New Roman', serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
  background-color: #f9f8f6;
  color: #1a1a1a;
`;

const headerStyle = `
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1.5px solid #b8860b;
  margin-bottom: 24px;
`;

function wrap(content: string) {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="font-size: 20px; letter-spacing: 3px; color: #1a1a1a; margin: 0;">THE NERDY ARTS</h1>
      </div>
      ${content}
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e8e4df; text-align: center; font-size: 12px; color: #6b6b6b;">
        <p>&copy; ${new Date().getFullYear()} The Nerdy Arts. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function adminPurchaseNotification(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  artworkTitle: string;
}) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">New Purchase Request</h2>
    <p style="margin-top: 16px;">A new purchase request has been submitted for <strong>${data.artworkTitle}</strong>.</p>
    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Address</td><td style="padding: 8px 0;">${data.address}</td></tr>
    </table>
  `);
}

export function userPurchaseConfirmation(data: { name: string; artworkTitle: string }) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">Thank You, ${data.name}!</h2>
    <p style="margin-top: 16px;">We've received your purchase request for <strong>${data.artworkTitle}</strong>.</p>
    <div style="margin-top: 20px; padding: 16px 18px; background-color: #ffffff; border: 1px solid #e8e4df; border-left: 3px solid #b8860b; border-radius: 6px;">
      <p style="margin: 0; font-weight: bold;">How requests work</p>
      <p style="margin: 8px 0 0; color: #6b6b6b;">Each original piece is one of a kind, so requests are handled on a <strong>first-come, first-served</strong> basis. You're now in the queue. If you're first in line, we'll email you directly to arrange the purchase &mdash; so please keep an eye on your inbox (including spam).</p>
    </div>
    <p style="margin-top: 16px; color: #6b6b6b;">If the piece is purchased by someone ahead of you, we'll let you know and you can request a similar/recreated piece from the website.</p>
    <p style="margin-top: 24px;">Warm regards,<br/><strong>The Nerdy Arts</strong></p>
  `);
}

export function adminSoldOutNotification(data: {
  name: string;
  email: string;
  artworkTitle: string;
}) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">Sold Out Piece Request</h2>
    <p style="margin-top: 16px;">Someone is interested in a sold out piece: <strong>${data.artworkTitle}</strong>.</p>
    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
    </table>
  `);
}

export function userSoldOutConfirmation(data: { name: string; artworkTitle: string }) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">Request Received, ${data.name}!</h2>
    <p style="margin-top: 16px;">We've noted your interest in <strong>${data.artworkTitle}</strong>.</p>
    <p style="margin-top: 12px; color: #6b6b6b;">This piece is currently sold out, but we'll reach out if it becomes available again or if we can create a similar piece for you. We will contact you soon!</p>
    <p style="margin-top: 24px;">Warm regards,<br/><strong>The Nerdy Arts</strong></p>
  `);
}

export function adminCustomRequestNotification(data: {
  name: string;
  email: string;
  phone: string;
  description: string;
  budget: string;
}) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">New Custom Art Request</h2>
    <p style="margin-top: 16px;">A new custom art commission request has been submitted.</p>
    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Budget</td><td style="padding: 8px 0;">${data.budget}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;" colspan="2">Description:</td></tr>
      <tr><td style="padding: 8px 0;" colspan="2">${data.description}</td></tr>
    </table>
  `);
}

export function userCustomRequestConfirmation(data: { name: string }) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">Custom Art Request Received, ${data.name}!</h2>
    <p style="margin-top: 16px;">Thank you for your interest in a custom art piece!</p>
    <p style="margin-top: 12px; color: #6b6b6b;">We've received your request and will review the details. Our artist will get back to you soon to discuss your vision, timeline, and next steps.</p>
    <p style="margin-top: 24px;">Warm regards,<br/><strong>The Nerdy Arts</strong></p>
  `);
}

export function adminContactNotification(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  address: string;
}) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">New Contact Message</h2>
    <p style="margin-top: 16px;">A new message has been submitted via the contact form.</p>
    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;">Address</td><td style="padding: 8px 0;">${data.address}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b6b6b;" colspan="2">Message:</td></tr>
      <tr><td style="padding: 8px 0;" colspan="2">${data.message}</td></tr>
    </table>
  `);
}

export function userContactConfirmation(data: { name: string }) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">Message Received, ${data.name}!</h2>
    <p style="margin-top: 16px;">Thank you for reaching out to The Nerdy Arts!</p>
    <p style="margin-top: 12px; color: #6b6b6b;">We've received your message and will get back to you as soon as possible. We appreciate your interest!</p>
    <p style="margin-top: 24px;">Warm regards,<br/><strong>The Nerdy Arts</strong></p>
  `);
}

// ----- Admin security emails (sent to the admin inbox) -----

export function adminLoginCodeEmail(data: { code: string }) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">Your admin login code</h2>
    <p style="margin-top: 16px;">Use this one-time code to finish signing in to the admin dashboard:</p>
    <p style="margin: 24px 0; text-align: center; font-size: 34px; letter-spacing: 10px; font-weight: bold; color: #1a1a1a;">${data.code}</p>
    <p style="color: #6b6b6b;">This code expires in 10 minutes. If you didn't try to sign in, change your password immediately.</p>
  `);
}

export function adminResetEmail(data: { link: string }) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">Reset your admin password</h2>
    <p style="margin-top: 16px;">We received a request to reset the admin password. Click the button below to choose a new one:</p>
    <p style="margin: 28px 0; text-align: center;">
      <a href="${data.link}" style="display: inline-block; padding: 12px 28px; background-color: #b8860b; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: 1px;">Reset Password</a>
    </p>
    <p style="color: #6b6b6b;">This link expires in 1 hour and can be used once. If you didn't request this, you can safely ignore this email.</p>
    <p style="color: #6b6b6b; font-size: 12px; margin-top: 16px; word-break: break-all;">${data.link}</p>
  `);
}

// ----- Buyer notice when a piece they queued for is sold -----

export function buyerSoldNotice(data: {
  name: string;
  artworkTitle: string;
  siteUrl: string;
}) {
  return wrap(`
    <h2 style="font-size: 18px; color: #b8860b;">An update on "${data.artworkTitle}"</h2>
    <p style="margin-top: 16px;">Hi ${data.name},</p>
    <p style="margin-top: 12px; color: #6b6b6b;">Thank you for your interest in <strong>${data.artworkTitle}</strong>. As pieces are sold on a first-come, first-served basis, this original has now been sold to another collector.</p>
    <p style="margin-top: 12px; color: #6b6b6b;">If you'd still love a piece like it, we'd be glad to recreate something similar for you. Just submit a request from the website and we'll be in touch.</p>
    <p style="margin: 24px 0; text-align: center;">
      <a href="${data.siteUrl}/gallery" style="display: inline-block; padding: 12px 28px; background-color: #b8860b; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: 1px;">Request a Piece</a>
    </p>
    <p style="margin-top: 16px;">Warm regards,<br/><strong>The Nerdy Arts</strong></p>
  `);
}
