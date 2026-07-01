import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { isToolsConfig } from '@/lib/toolsConfig';
import { saveToolsConfig } from '@/lib/toolsStore';

export const dynamic = 'force-dynamic';

// Replace the whole tools config document (it's small — a handful of edits).
export async function PUT(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!isToolsConfig(body) || JSON.stringify(body).length > 400_000) {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Storage not configured' }, { status: 500 });
  }
  try {
    await saveToolsConfig(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Save failed' },
      { status: 500 }
    );
  }
}
