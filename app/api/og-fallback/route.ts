import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redireciona para uma imagem estática
  return NextResponse.redirect(new URL('/KV-logo.png', request.url));
}
