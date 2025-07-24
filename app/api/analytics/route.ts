import { NextResponse } from 'next/server';

// API Route simplificada para plano gratuito
export async function GET() {
  try {
    // Dados estáticos para demonstração (sem dynamic usage)
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
      ],
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(metrics);
    
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

// Configuração otimizada para plano gratuito da Vercel
export const runtime = 'nodejs';
export const revalidate = 300; // Revalida a cada 5 minutos (mais conservador)
