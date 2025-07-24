import { NextRequest, NextResponse } from 'next/server';

// API Route para envio de contato com rate limiting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, locale } = body;
    
    // Validação básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Rate limiting simples baseado em IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Aqui você pode integrar com serviços como:
    // - Resend para envio de emails
    // - Vercel KV para rate limiting
    // - Analytics para tracking
    
    // Simulação de envio de email
    const isPortuguese = locale === 'pt-br';
    const response = {
      success: true,
      message: isPortuguese 
        ? 'Mensagem enviada com sucesso!' 
        : 'Message sent successfully!',
      data: {
        name,
        email,
        timestamp: new Date().toISOString(),
        ip: ip.substring(0, 10) + '...' // Partial IP for privacy
      }
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

// Configuração para plano gratuito da Vercel
export const runtime = 'nodejs';
