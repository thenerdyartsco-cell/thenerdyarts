import { SignJWT, jwtVerify } from "jose";

/**
 * Edge-safe session primitives (JWT only, no next/headers).
 * Safe to import from middleware AND server code.
 */

export const SESSION_COOKIE = "tna_admin_session";
const ALG = "HS256";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_SECRET is not configured (must be at least 32 characters)");
  }
  return new TextEncoder().encode(s);
}

export interface SessionPayload {
  email: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: [ALG] });
    if (typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
