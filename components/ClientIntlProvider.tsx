'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import enMessages from '@/messages/en.json';
import ptBrMessages from '@/messages/pt-br.json';

interface ClientIntlProviderProps {
  children: ReactNode;
  initialLocale: string;
  initialMessages: Record<string, unknown>;
}

export function ClientIntlProvider({ 
  children, 
  initialLocale, 
  initialMessages 
}: ClientIntlProviderProps) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    // Detecta o locale baseado na URL atual
    const pathname = window.location.pathname;
    let detectedLocale = 'en';
    
    if (pathname.includes('/pt-br')) {
      detectedLocale = 'pt-br';
    } else if (pathname.includes('/en')) {
      detectedLocale = 'en';
    }
    
    // Se o locale detectado for diferente do inicial, atualiza
    if (detectedLocale !== locale) {
      setLocale(detectedLocale);
      setMessages(detectedLocale === 'pt-br' ? ptBrMessages : enMessages);
      console.log('ClientIntlProvider - Updated locale to:', detectedLocale);
    }
  }, [locale]);

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      timeZone="America/Sao_Paulo"
      now={new Date()}
    >
      {children}
    </NextIntlClientProvider>
  );
}
