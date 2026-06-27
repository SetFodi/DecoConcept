import { cookies } from 'next/headers';
import { createHash } from 'crypto';

/**
 * Minimal shared-password auth for the client admin panel.
 * Login sets an httpOnly cookie = sha256(salt + ADMIN_PASSWORD); routes check it.
 * Good enough for non-sensitive content (paint photos), with no extra service.
 */

const COOKIE = 'dc_admin';

function expectedToken(): string {
  return createHash('sha256')
    .update('deconcept-admin::' + (process.env.ADMIN_PASSWORD ?? ''))
    .digest('hex');
}

export function verifyPassword(pw: string): boolean {
  return !!process.env.ADMIN_PASSWORD && pw === process.env.ADMIN_PASSWORD;
}

export async function isAuthed(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === expectedToken();
}

export async function setAuthCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
