import { FloatingNav } from "@/components/ui/navbar/FloatingNav";
import { navItems } from "@/data";
import NextDynamic from "next/dynamic";
import Hero from "@/components/Hero";

// Dynamic imports for heavy components
const Grid = NextDynamic(() => import("@/components/Grid"), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>
});

const RecentProjects = NextDynamic(() => import("@/components/RecentProjects"), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading Projects...</div>
});

const Clients = NextDynamic(() => import("@/components/Clients"), {
  loading: () => <div className="h-64 flex items-center justify-center">Loading...</div>
});

const Experience = NextDynamic(() => import("@/components/Experience"), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading Experience...</div>
});

const Approach = NextDynamic(() => import("@/components/Approach"), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>
});

const Footer = NextDynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-64 flex items-center justify-center">Loading...</div>
});

// Forçar renderização estática
export const dynamic = 'force-static';

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'pt-br' }
  ];
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