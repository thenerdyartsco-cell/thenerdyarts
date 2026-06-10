/**
 * One-time bootstrap for the admin account.
 *
 *   1. Set ADMIN_INITIAL_PASSWORD (and Firebase vars) in .env.local
 *   2. Run:  npm run seed:admin
 *
 * Writes a bcrypt-hashed password to Firestore at admin/credentials.
 * Safe to re-run — it overwrites the stored password.
 */
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import bcrypt from "bcryptjs";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const email = (process.env.ADMIN_EMAIL || "thenerdyarts.co@gmail.com").toLowerCase();
const password = process.env.ADMIN_INITIAL_PASSWORD;

if (!projectId || !clientEmail || !privateKey) {
  console.error("✗ Missing Firebase credentials. Set FIREBASE_* vars in .env.local");
  process.exit(1);
}
if (!password || password.length < 10) {
  console.error("✗ Set ADMIN_INITIAL_PASSWORD (at least 10 characters) in .env.local");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();
const passwordHash = await bcrypt.hash(password, 12);
await db
  .collection("admin")
  .doc("credentials")
  .set({ email, passwordHash, updatedAt: new Date().toISOString() }, { merge: true });

console.log(`✓ Admin credentials seeded for ${email}`);
process.exit(0);
