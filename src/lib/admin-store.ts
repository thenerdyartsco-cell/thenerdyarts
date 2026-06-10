import { randomInt, randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "./firebase";

/**
 * All admin-account security state lives in the `admin` collection:
 *   admin/credentials   { email, passwordHash, updatedAt }
 *   admin/security      { failedCount, lockedUntil }
 *   admin/login_otp     { codeHash, expiresAt, attempts }
 *   admin/password_reset{ tokenHash, expiresAt, used }
 */

const BCRYPT_ROUNDS = 12;
const MAX_LOGIN_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_ATTEMPTS = 5;
const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

function adminCol() {
  return getDb().collection("admin");
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

// ----- Credentials -----

export interface AdminCredentials {
  email: string;
  passwordHash: string;
}

export async function getAdminCredentials(): Promise<AdminCredentials | null> {
  const doc = await adminCol().doc("credentials").get();
  if (!doc.exists) return null;
  const data = doc.data() as AdminCredentials;
  return { email: data.email, passwordHash: data.passwordHash };
}

export async function setAdminPassword(email: string, password: string): Promise<void> {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await adminCol().doc("credentials").set(
    { email: email.toLowerCase(), passwordHash, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ----- Login throttle / lockout -----

export async function isLockedOut(): Promise<boolean> {
  const doc = await adminCol().doc("security").get();
  if (!doc.exists) return false;
  const lockedUntil = doc.data()?.lockedUntil as number | undefined;
  return !!lockedUntil && lockedUntil > Date.now();
}

export async function recordLoginFailure(): Promise<void> {
  const ref = adminCol().doc("security");
  const doc = await ref.get();
  const failedCount = ((doc.exists ? doc.data()?.failedCount : 0) || 0) + 1;
  const update: Record<string, unknown> = { failedCount };
  if (failedCount >= MAX_LOGIN_FAILURES) {
    update.lockedUntil = Date.now() + LOCKOUT_MS;
    update.failedCount = 0;
  }
  await ref.set(update, { merge: true });
}

export async function clearLoginFailures(): Promise<void> {
  await adminCol().doc("security").set({ failedCount: 0, lockedUntil: 0 }, { merge: true });
}

// ----- 2FA one-time code -----

/** Generates a 6-digit code, stores its hash, and returns the plaintext to email. */
export async function issueOtp(): Promise<string> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS);
  await adminCol().doc("login_otp").set({
    codeHash,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
  return code;
}

export async function verifyOtp(code: string): Promise<boolean> {
  const ref = adminCol().doc("login_otp");
  const doc = await ref.get();
  if (!doc.exists) return false;
  const data = doc.data() as { codeHash: string; expiresAt: number; attempts: number };
  if (data.expiresAt < Date.now() || data.attempts >= OTP_MAX_ATTEMPTS) {
    await ref.delete();
    return false;
  }
  const ok = await bcrypt.compare(code, data.codeHash);
  if (!ok) {
    await ref.set({ attempts: data.attempts + 1 }, { merge: true });
    return false;
  }
  await ref.delete(); // single use
  return true;
}

// ----- Password reset tokens -----

/** Creates a single-use reset token, stores its hash, returns the plaintext for the link. */
export async function issueResetToken(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await adminCol().doc("password_reset").set({
    tokenHash: sha256(token),
    expiresAt: Date.now() + RESET_TTL_MS,
    used: false,
  });
  return token;
}

export async function consumeResetToken(token: string): Promise<boolean> {
  const ref = adminCol().doc("password_reset");
  const doc = await ref.get();
  if (!doc.exists) return false;
  const data = doc.data() as { tokenHash: string; expiresAt: number; used: boolean };
  if (data.used || data.expiresAt < Date.now()) return false;
  if (data.tokenHash !== sha256(token)) return false;
  await ref.set({ used: true }, { merge: true });
  return true;
}
