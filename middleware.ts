import createMiddleware from 'next-intl/middleware';

// Middleware otimizado para Vercel com detecção de locale
export default createMiddleware({
  locales: ['en', 'pt-br'],
  defaultLocale: 'en',
  // Reabilitar detecção automática para melhor UX na Vercel
  localeDetection: true,
  localePrefix: 'always',
  // Estratégia de redirecionamento otimizada
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      'pt-br': '/sobre'
    }
  }
});

// Configuração otimizada para Vercel
export const config = {
  // Matcher otimizado para performance
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};