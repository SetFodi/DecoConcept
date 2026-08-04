import { NextResponse } from 'next/server';
import { getColorsConfig } from '@/lib/colorsStore';

export const dynamic = 'force-dynamic';

// Public: admin-managed paint display order. The paints page applies this over
// the built-in colour list.
export async function GET() {
  const config = await getColorsConfig();
  return NextResponse.json(
    { config },
    { headers: { 'Cache-Control': 'public, max-age=10, stale-while-revalidate=60' } }
  );
}
