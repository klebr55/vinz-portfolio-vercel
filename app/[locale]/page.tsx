import { FloatingNav } from "@/components/ui/navbar/FloatingNav";
import { navItems } from "@/data";
import NextDynamic from "next/dynamic";
import Hero from "@/components/Hero";

// Dynamic imports otimizados para SSR/SSG
const Grid = NextDynamic(() => import("@/components/Grid"), {
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="loading-skeleton w-32 h-8 rounded-md"></div>
    </div>
  ),
});

const RecentProjects = NextDynamic(() => import("@/components/RecentProjects"), {
  loading: () => (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="loading-skeleton h-8 w-64 mx-auto mb-8 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="loading-skeleton h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  ),
});

const Clients = NextDynamic(() => import("@/components/Clients"), {
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <div className="loading-skeleton w-full max-w-4xl h-32 rounded-lg"></div>
    </div>
  ),
});

const Experience = NextDynamic(() => import("@/components/Experience"), {
  loading: () => (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="loading-skeleton h-8 w-48 mx-auto mb-12 rounded-md"></div>
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-skeleton h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  ),
});

const Approach = NextDynamic(() => import("@/components/Approach"), {
  loading: () => (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="loading-skeleton h-8 w-56 mx-auto mb-12 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="loading-skeleton h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  ),
});

const Footer = NextDynamic(() => import("@/components/Footer"), {
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <div className="loading-skeleton w-full max-w-2xl h-24 rounded-lg"></div>
    </div>
  ),
});

// ISG - Incremental Static Generation com revalidação conservadora
export const revalidate = 7200; // Revalida a cada 2 horas

// Metadata dinâmica para SEO otimizado
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isPortuguese = locale === 'pt-br';
  
  return {
    metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
    title: isPortuguese 
      ? "Kleber Vinicius | Desenvolvedor Web Front-End" 
      : "Kleber Vinicius | Front-End Web Developer",
    description: isPortuguese
      ? "Portfólio de Kleber Vinicius, desenvolvedor Web Front-End especializado em React, Next.js e tecnologias modernas."
      : "Portfolio of Kleber Vinicius, Front-End Web Developer specialized in React, Next.js and modern technologies.",
    // Adicionando favicon com kv-favicon.svg
    icons: {
      icon: [
        { url: '/kv-favicon.svg', type: 'image/svg+xml' },
        { url: '/kv-favicon.svg', sizes: '32x32' },
      ],
      apple: '/kv-favicon.svg',
      shortcut: '/kv-favicon.svg',
    },
    openGraph: {
      title: isPortuguese 
        ? "Kleber Vinicius | Desenvolvedor Web Front-End" 
        : "Kleber Vinicius | Front-End Web Developer",
      description: isPortuguese
        ? "Portfólio de Kleber Vinicius, desenvolvedor Web Front-End especializado em React, Next.js e tecnologias modernas."
        : "Portfolio of Kleber Vinicius, Front-End Web Developer specialized in React, Next.js and modern technologies.",
      images: [
        {
          url: 'https://klebervinicius.dev/KV-logo.png',
          width: 512,
          height: 512,
          alt: isPortuguese 
            ? 'Logo do Portfólio Kleber Vinicius'
            : 'Kleber Vinicius Portfolio Logo',
        },
      ],
      type: 'website',
      locale: locale === 'pt-br' ? 'pt_BR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: isPortuguese 
        ? "Kleber Vinicius | Desenvolvedor Web Front-End" 
        : "Kleber Vinicius | Front-End Web Developer",
      description: isPortuguese
        ? "Portfólio de Kleber Vinicius, desenvolvedor Web Front-End especializado em React, Next.js e tecnologias modernas."
        : "Portfolio of Kleber Vinicius, Front-End Web Developer specialized in React, Next.js and modern technologies.",
      images: ['https://klebervinicius.dev/KV-logo.png'],
    },
  };
}

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems}/>
        <Hero />
        <Grid />
        <RecentProjects />
        <Clients />
        <Experience />
        <Approach />
        <Footer />
      </div>
    </main>
  );
}