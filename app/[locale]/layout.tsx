import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "../globals.css";
import "../animista.css"
import { ThemeProvider } from "@/components/theme/provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import WebVitals from "@/components/WebVitals";
import VercelTracking from "@/components/VercelTracking";

// Configuração da fonte Inter otimizada
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// Static generation com ISR otimizado para plano gratuito
export const revalidate = 7200; // Revalida a cada 2 horas (mais conservador)

// Gerar metadata dinâmica baseada no locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const isPortuguese = locale === 'pt-br';
  
  return {
    metadataBase: new URL('https://klebervinicius.dev'),
    title: isPortuguese 
      ? "Portfólio Kleber Vinicius | Desenvolvedor Web Front-End"
      : "Kleber Vinicius's Portfolio | Front-End Web Developer",
    description: isPortuguese
      ? "Desenvolvedor Web Front-End especializado em React, Next.js e tecnologias modernas. Criando experiências web excepcionais."
      : "Front-End Web Developer specialized in React, Next.js and modern technologies. Creating exceptional web experiences.",
    keywords: isPortuguese
      ? "desenvolvedor web, desenvolvedor, front-end, react, nextjs, javascript, typescript, portfolio"
      : "web developer, developer, front-end, react, nextjs, javascript, typescript, portfolio",
    authors: [{ name: "Kleber Vinicius" }],
    creator: "Kleber Vinicius",
    publisher: "Kleber Vinicius",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/kv-favicon.svg', type: 'image/svg+xml' },
        { url: '/kv-favicon.svg', sizes: 'any' },
      ],
      apple: [
        { url: '/kv-favicon.svg', sizes: '180x180' },
      ],
      shortcut: '/kv-favicon.svg',
    },
    openGraph: {
      type: 'website',
      url: `https://klebervinicius.dev/${locale}`,
      locale: locale === 'pt-br' ? 'pt_BR' : 'en_US',
      title: isPortuguese 
        ? "Portfólio Kleber Vinicius | Desenvolvedor Web Front-End"
        : "Kleber Vinicius's Portfolio | Front-End Web Developer",
      description: isPortuguese
        ? "Desenvolvedor Web Front-End especializado em React, Next.js e tecnologias modernas. Criando experiências web excepcionais."
        : "Front-End Web Developer specialized in React, Next.js and modern technologies. Creating exceptional web experiences.",
      siteName: "Kleber Vinicius Portfolio",
      images: [
        {
          url: 'https://klebervinicius.dev/KV-logo.png',
          width: 1200,
          height: 630,
          alt: isPortuguese 
            ? 'Logo do Portfólio Kleber Vinicius'
            : 'Kleber Vinicius Portfolio Logo',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isPortuguese 
        ? "Portfólio Kleber Vinicius"
        : "Kleber Vinicius's Portfolio",
      description: isPortuguese
        ? "Desenvolvedor Web Front-End criando experiências web excepcionais"
        : "Front-End Web Developer creating exceptional web experiences",
      images: ['https://klebervinicius.dev/KV-logo.png'],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'pt-BR': '/pt-br',
      },
    },
    other: {
      'fb:app_id': '123456789', // Substitua pelo seu Facebook App ID quando tiver
      'og:url': `https://klebervinicius.dev/${locale}`,
      'og:site_name': 'Kleber Vinicius Portfolio',
    },
  };
}

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
    <html lang={validLocale} suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect para melhor performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Critical CSS inlined para above-the-fold */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-inter: ${inter.style.fontFamily};
            }
            /* Critical above-the-fold styles */
            body { 
              font-family: var(--font-inter), system-ui, -apple-system, sans-serif; 
              margin: 0; 
              background: #000319;
              color: white;
              font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
            }
            .hero-section { 
              min-height: 100vh; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
            }
            /* Loading states otimizados */
            .loading-skeleton {
              background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            /* Smooth scrolling e performance */
            html {
              scroll-behavior: smooth;
            }
            * {
              scrollbar-width: thin;
              scrollbar-color: #4b5563 transparent;
            }
          `
        }} />
        
        {/* Meta tags para performance e SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#000319" />
        <meta property="og:image" content="/KV-logo.png"></meta>
        <link rel="icon" href="/kv-favicon.svg" />
      </head>
      <body className={`${inter.className} antialiased`}>
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
              <VercelTracking />
              {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}