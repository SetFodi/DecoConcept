import { NextResponse } from 'next/server';
import { getRoyalPaintProductsConfig } from '@/lib/royalPaintProductsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = await getRoyalPaintProductsConfig();
  return NextResponse.json(
    { config },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
