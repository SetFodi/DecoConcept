import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { uploadRoyalPaintProductImage } from '@/lib/royalPaintProductsStore';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_BYTES = 4_000_000;

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Storage not configured' }, { status: 500 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (
    !(file instanceof File) ||
    file.size === 0 ||
    file.size > MAX_IMAGE_BYTES ||
    !file.type.startsWith('image/')
  ) {
    return NextResponse.json(
      { ok: false, error: 'Choose an image smaller than 4 MB.' },
      { status: 400 }
    );
  }
  try {
    const url = await uploadRoyalPaintProductImage(file, file.type);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
