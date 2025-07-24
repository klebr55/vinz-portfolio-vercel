import createMiddleware from 'next-intl/middleware';

// Cria middleware com configuração para export estático
export default createMiddleware({
  // Lista explícita de locales
  locales: ['en', 'pt-br'],
  defaultLocale: 'en',
  // Desabilitar detecção automática para export estático
  localeDetection: false,
  localePrefix: 'always' // Sempre mostra o prefix do locale nas URLs
});

// Define os padrões que o middleware deve interceptar
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pt-br|en)/:path*']
};