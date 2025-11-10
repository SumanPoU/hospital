// lib/jwt.ts
import { SignJWT, jwtVerify, decodeJwt } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; 

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

function parseTime(timeStr) {
  const match = /^(\d+)([smhd])$/.exec(timeStr);
  if (!match) return 900;
  const [, value, unit] = match;
  const num = parseInt(value);
  switch (unit) {
    case "s": return num;
    case "m": return num * 60;
    case "h": return num * 3600;
    case "d": return num * 86400;
    default: return 900;
  }
}

export async function generateToken(payload) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + parseTime(JWT_EXPIRES_IN);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);
}

export async function generateRefreshToken(payload) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + parseTime("30d");
  return await new SignJWT({ id: payload.id, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (err) {
    console.error("❌ Token verification error:", err.name, err.message);
    return null;
  }
}

export function isTokenExpired(token) {
  try {
    const decoded = decodeJwt(token);
    if (!decoded?.exp) return true;
    return Math.floor(Date.now() / 1000) > decoded.exp;
  } catch {
    return true;
  }
}

export function getTokenExpirationTime(token) {
  try {
    const decoded = decodeJwt(token);
    return decoded?.exp || null;
  } catch {
    return null;
  }
}

export function debugToken(token) {
  try {
    const decoded = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp ? currentTime > decoded.exp : null;
    console.log("🔍 Token:", decoded);
    console.log("🕒 Current Time:", currentTime);
    console.log("📅 Exp:", decoded.exp);
    console.log("⏳ Expired:", isExpired);
  } catch (err) {
    console.error("❌ Debug error:", err.message);
  }
}
