import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { isColorsConfig } from '@/lib/colorsConfig';
import { saveColorsConfig } from '@/lib/colorsStore';

export const dynamic = 'force-dynamic';

// Replace the whole colours config document (it's just id lists — a few KB).
export async function PUT(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!isColorsConfig(body) || JSON.stringify(body).length > 400_000) {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Storage not configured' }, { status: 500 });
  }
  try {
    await saveColorsConfig(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Save failed' },
      { status: 500 }
    );
  }
}
