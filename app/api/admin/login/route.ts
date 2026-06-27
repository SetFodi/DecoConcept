import { NextResponse } from 'next/server';
import { verifyPassword, setAuthCookie } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String((body as { password?: unknown }).password ?? '');
  if (!verifyPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await setAuthCookie();
  return NextResponse.json({ ok: true });
}
