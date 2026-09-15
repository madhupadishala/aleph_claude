import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_SECONDS = 60 * 60 * 8;

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function passwordsMatch(input: unknown, expected: string) {
  if (typeof input !== "string" || input.length > 1024) return false;
  return timingSafeEqual(
    Buffer.from(signature(input, expected)),
    Buffer.from(signature(expected, expected)),
  );
}

export function createSession(secret: string, now = Date.now()) {
  const payload = `${now + SESSION_SECONDS * 1000}.${randomBytes(24).toString("hex")}`;
  return `${payload}.${signature(payload, secret)}`;
}

export function verifySession(
  token: string | undefined,
  secret: string | undefined,
  now = Date.now(),
) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    !/^\d+$/.test(parts[0]) ||
    !/^[a-f0-9]{48}$/.test(parts[1]) ||
    !/^[a-f0-9]{64}$/.test(parts[2])
  )
    return false;
  const expires = Number(parts[0]);
  if (expires <= now || expires > now + SESSION_SECONDS * 1000) return false;
  return timingSafeEqual(
    Buffer.from(parts[2]),
    Buffer.from(signature(`${parts[0]}.${parts[1]}`, secret)),
  );
}
