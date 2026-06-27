import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    authed: await isAuthed(),
    configured: !!process.env.ADMIN_PASSWORD,
    storage: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}
