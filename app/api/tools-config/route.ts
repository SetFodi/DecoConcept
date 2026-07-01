import { NextResponse } from 'next/server';
import { getToolsConfig } from '@/lib/toolsStore';

export const dynamic = 'force-dynamic';

// Public: admin-managed tools catalog overrides. The tools page merges these
// over the built-in list.
export async function GET() {
  const config = await getToolsConfig();
  return NextResponse.json(
    { config },
    { headers: { 'Cache-Control': 'public, max-age=10, stale-while-revalidate=60' } }
  );
}
