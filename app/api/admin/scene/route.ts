import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { setSceneOverride, removeSceneOverride } from '@/lib/sceneStore';

export const dynamic = 'force-dynamic';

// Upload / replace the photo for a colour.
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Storage not configured' }, { status: 500 });
  }
  const form = await req.formData().catch(() => null);
  const colorId = Number(form?.get('colorId'));
  const file = form?.get('file');
  if (!Number.isInteger(colorId) || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
  try {
    const url = await setSceneOverride(colorId, file, file.type || 'image/jpeg');
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// Remove a colour's override (falls back to the built-in scene).
export async function DELETE(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const colorId = Number(new URL(req.url).searchParams.get('colorId'));
  if (!Number.isInteger(colorId)) {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
  await removeSceneOverride(colorId);
  return NextResponse.json({ ok: true });
}
