import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { uploadToolImage, deleteToolImage } from '@/lib/toolsStore';

export const dynamic = 'force-dynamic';

// Upload a tool photo; optionally deletes the blob it replaces.
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Storage not configured' }, { status: 500 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
  try {
    const url = await uploadToolImage(file, file.type || 'image/jpeg');
    const replaceUrl = form?.get('replaceUrl');
    if (typeof replaceUrl === 'string' && replaceUrl) await deleteToolImage(replaceUrl);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
