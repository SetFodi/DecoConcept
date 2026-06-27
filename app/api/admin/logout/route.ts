import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
