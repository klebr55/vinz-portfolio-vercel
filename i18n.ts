import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // Use requestLocale directly for Next.js 15
  let locale = await requestLocale;
  
  // Fallback to en if locale is not supported
  if (!locale || !['en', 'pt-br'].includes(locale)) {
    locale = 'en';
  }
  
  // Import messages dynamically based on locale
  const messages = (await import(`./messages/${locale}.json`)).default;
  
  return {
    locale,
    messages,
    timeZone: 'America/Sao_Paulo',
    now: new Date()
  };
});