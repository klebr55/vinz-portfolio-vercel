import type { Metadata } from "next";
import "../globals.css";
import "../animista.css"
import { ThemeProvider } from "@/components/theme/provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import WebVitals from "@/components/WebVitals";

// Forçar renderização estática
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Kleber Vinicius's Portfolio",
  description: "Modern & Minimalist JS Portfolio",
};

// Função necessária para export estático com rotas dinâmicas
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'pt-br' }
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Para componentes de servidor no Next.js 15, params é uma Promise
  const { locale } = await params;
  
  // Garanta que estamos usando um locale válido
  const validLocale = locale === 'pt-br' ? 'pt-br' : 'en';
  
  // Use o sistema padrão do next-intl
  const messages = await getMessages();
  
  return (
    <html lang={validLocale} suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" as="style" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Critical CSS inlined */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body { 
              font-family: Inter, sans-serif; 
              margin: 0; 
              background: #000319;
              color: white;
            }
            .hero-section { 
              min-height: 100vh; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
            }
            /* Loading states */
            .loading-skeleton {
              background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `
        }} />
        
        {/* Load non-critical CSS after render - using media query hack */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
          media="print" 
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Switch font loading to all media after page load
              window.addEventListener('load', function() {
                const fontLink = document.querySelector('link[media="print"]');
                if (fontLink) fontLink.media = 'all';
              });
            `
          }}
        />
        <noscript>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </noscript>
      </head>
      <body className="font-inter antialiased">
        <NextIntlClientProvider 
          locale={validLocale} 
          messages={messages}
          timeZone="America/Sao_Paulo"
          now={new Date()}
        >
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <WebVitals />
              {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}