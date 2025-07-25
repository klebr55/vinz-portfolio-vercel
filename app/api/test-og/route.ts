import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url') || 'https://klebervinicius.dev';

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Extrair meta tags OpenGraph
    const ogTags = {
      title: html.match(/<meta property="og:title" content="([^"]*)"/) ?.[1] || '',
      description: html.match(/<meta property="og:description" content="([^"]*)"/) ?.[1] || '',
      image: html.match(/<meta property="og:image" content="([^"]*)"/) ?.[1] || '',
      url: html.match(/<meta property="og:url" content="([^"]*)"/) ?.[1] || '',
      siteName: html.match(/<meta property="og:site_name" content="([^"]*)"/) ?.[1] || '',
      type: html.match(/<meta property="og:type" content="([^"]*)"/) ?.[1] || '',
    };

    return NextResponse.json({
      success: true,
      url,
      openGraph: ogTags,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    }, { status: 500 });
  }
}
