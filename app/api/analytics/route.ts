import { NextRequest, NextResponse } from 'next/server';

// API Route para analytics e métricas em tempo real
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');
    
    // Simulação de dados de performance em tempo real
    const metrics = {
      visitors: Math.floor(Math.random() * 1000) + 500,
      pageViews: Math.floor(Math.random() * 5000) + 2000,
      performance: {
        fcp: Math.floor(Math.random() * 1000) + 800,
        lcp: Math.floor(Math.random() * 2000) + 1200,
        cls: (Math.random() * 0.1).toFixed(3),
        fid: Math.floor(Math.random() * 50) + 20
      },
      projects: [
        { name: 'Portfolio', views: Math.floor(Math.random() * 500) + 100 },
        { name: 'E-commerce', views: Math.floor(Math.random() * 300) + 80 },
        { name: 'Dashboard', views: Math.floor(Math.random() * 200) + 50 }
      ]
    };
    
    if (metric && metrics[metric as keyof typeof metrics]) {
      return NextResponse.json({ 
        [metric]: metrics[metric as keyof typeof metrics],
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({ 
      ...metrics,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

// Cache configurado para Vercel
export const runtime = 'edge';
export const revalidate = 60; // Revalida a cada minuto
