import { NextResponse } from 'next/server';
import { getSceneOverrides } from '@/lib/sceneStore';

export const dynamic = 'force-dynamic';

// Public: colorId -> uploaded photo URL. The paints page merges these over the built-in scenes.
export async function GET() {
  const overrides = await getSceneOverrides();
  return NextResponse.json(
    { overrides },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
