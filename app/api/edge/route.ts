import { NextResponse } from 'next/server';

// Edge function para redirecionamentos inteligentes
export async function GET() {
  const response = NextResponse.json({
    message: 'Portfolio Edge API',
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'unknown',
    performance: {
      'edge-runtime': true,
      'global-distribution': true,
      'zero-cold-start': true
    }
  });

  // Headers de performance
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
  response.headers.set('CDN-Cache-Control', 'public, max-age=3600');
  response.headers.set('Vercel-CDN-Cache-Control', 'public, max-age=3600');

  return response;
}

export const runtime = 'edge';
