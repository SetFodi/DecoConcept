import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { isRoyalPaintProductsConfig } from '@/lib/royalPaintProducts';
import { saveRoyalPaintProductsConfig } from '@/lib/royalPaintProductsStore';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!isRoyalPaintProductsConfig(body) || JSON.stringify(body).length > 400_000) {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Storage not configured' }, { status: 500 });
  }
  try {
    await saveRoyalPaintProductsConfig(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Save failed' },
      { status: 500 }
    );
  }
}
