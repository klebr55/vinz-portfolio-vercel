import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import "../globals.css";
import "../animista.css"
import { ThemeProvider } from "@/components/theme/provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import WebVitals from "@/components/WebVitals";
import VercelTracking from "@/components/VercelTracking";
import ClientMultiThreadOptimizer from '@/components/ClientMultiThreadOptimizer';
import { SITE_URL, SITE_NAME, ogImageUrl } from '@/lib/site';

// Configuração da fonte Inter otimizada
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// Static generation com ISR otimizado para plano gratuito
export const revalidate = 7200; // Revalida a cada 2 horas (mais conservador)

// Next 15 expects viewport/theme-color through this export, not a hand-written
// <meta> in <head>. Keeps viewport-fit=cover for env(safe-area-inset-*).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000319',
};

// Gerar metadata dinâmica baseada no locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const isPortuguese = locale === 'pt-br';

  // Titles below are the strings currently indexed for /pt-br and /en.
  // They previously lived in page.tsx, whose metadata silently overrode this
  // layout (including its metadataBase). Consolidated here so there is one
  // source of truth; do not reword without checking search impact.
  const title = isPortuguese
    ? "Kleber Vinicius | Desenvolvedor Web Full-Stack"
    : "Kleber Vinicius | Full-Stack Web Developer";

  const description = isPortuguese
    ? "Portfólio de Kleber Vinicius, desenvolvedor Web Full-Stack especializado em React, Next.js e tecnologias modernas."
    : "Portfolio of Kleber Vinicius, Full-Stack Web Developer specialized in React, Next.js and modern technologies.";

  const ogSubtitle = isPortuguese
    ? 'Desenvolvedor Web Full-Stack'
    : 'Full-Stack Web Developer';

  const ogImage = ogImageUrl('Kleber Vinicius', ogSubtitle);
  const ogAlt = `Kleber Vinicius - ${ogSubtitle}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: isPortuguese
      ? "desenvolvedor web, desenvolvedor, full-stack, react, nextjs, javascript, typescript, portfolio"
      : "web developer, developer, full-stack, react, nextjs, javascript, typescript, portfolio",
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
      url: `${SITE_URL}/${locale}`,
      locale: locale === 'pt-br' ? 'pt_BR' : 'en_US',
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@klebervinicius',
      site: '@klebervinicius',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'pt-BR': '/pt-br',
      },
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

        {/* DNS prefetch para melhor performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/*
          og:image / og:image:secure_url / twitter:image and the og:updated_time
          pair used to be emitted here by hand. They duplicated what the
          metadata export already renders, and the timestamps were built from
          `new Date()` on every render, which defeats crawler caching. Social
          tags now come from generateMetadata only.
        */}

        {/* Critical CSS inlined para above-the-fold */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-inter: ${inter.style.fontFamily};
              color-scheme: dark;
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
              min-height: 100dvh; 
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
            /* Smooth scrolling gated on motion preference */
            @media (prefers-reduced-motion: no-preference) {
              html { scroll-behavior: smooth; }
            }
            @media (prefers-reduced-motion: reduce) {
              .loading-skeleton { animation: none; }
            }
            * {
              scrollbar-width: thin;
              scrollbar-color: #4b5563 transparent;
            }
          `
        }} />

        <meta name="format-detection" content="telephone=no" />
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
              <ClientMultiThreadOptimizer />
              <WebVitals />
              <VercelTracking />
              {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
