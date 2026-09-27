// Single source for the signing secret. Dev falls back to a fixed value so local
// runs work without setup; production refuses to run on a missing/weak secret
// (a known fallback would let anyone forge admin + super-admin sessions).
export function authSecretString(): string {
  const s = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production" && (!s || s.length < 32 || s.startsWith("change-me"))) {
    throw new Error("AUTH_SECRET must be set to a random string of 32+ chars in production.");
  }
  return s || "dev-secret-change-me";
}

export function authSecret(suffix = ""): Uint8Array {
  return new TextEncoder().encode(authSecretString() + suffix);
}
