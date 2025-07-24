import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Log para debug
  console.log(`Request: Initial locale from params: ${locale}`);
  
  // Garantir que o locale é um dos valores válidos
  const validLocale = locale === 'pt-br' ? 'pt-br' : 'en';
  console.log(`Request: Using validated locale: ${validLocale}`);
  
  // Carrega mensagens diretamente com base no locale
  let messages;
  try {
    if (validLocale === 'pt-br') {
      messages = (await import('../../messages/pt-br.json')).default;
      console.log('Request: Successfully loaded PT-BR messages');
    } else {
      messages = (await import('../../messages/en.json')).default;
      console.log('Request: Successfully loaded EN messages');
    }
    
    // Log do conteúdo do footer para verificar se está correto
    console.log(`Request: Footer data loaded:`, {
      hasFooter: Boolean(messages.footer),
      footerKeys: messages.footer ? Object.keys(messages.footer) : [],
      footerPrefix: messages.footer?.heading?.prefix
    });
  } catch (error) {
    console.error(`Request: Error loading messages for ${validLocale}:`, error);
    messages = {};
  }
  
  return {
    locale: validLocale, // Use o locale validado
    messages,
    timeZone: 'America/Sao_Paulo', // Adicionar configurações regionais apropriadas
    now: new Date() // Garantir que a data é atual
  };
});