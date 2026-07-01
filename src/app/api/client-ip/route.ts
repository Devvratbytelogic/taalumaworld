import { NextRequest, NextResponse } from 'next/server';

function extractClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const cfConnectingIp = request.headers.get('cf-connecting-ip')?.trim();
  if (cfConnectingIp) return cfConnectingIp;

  return null;
}

export async function GET(request: NextRequest) {
  const ip = extractClientIp(request);

  return NextResponse.json({ ip });
}
