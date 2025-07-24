/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { JSX, useState, useEffect, useRef } from "react";
import {
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/utils/cn";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const navRef = useRef<HTMLDivElement>(null);
  
  const [visible, setVisible] = useState(true);
  const [navTexts, setNavTexts] = useState(['About', 'Projects', 'Testimonials', 'Contact']);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [shouldAnimateOut, setShouldAnimateOut] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  
  // Estados para responsividade dinâmica
  const [navbarWidth, setNavbarWidth] = useState<number>(0);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [dynamicStyles, setDynamicStyles] = useState({
    fontSize: '14px',
    padding: '16px',
    itemSpacing: '16px',
    languageSwitcherScale: 1
  });

  // Calcula estilos dinâmicos baseado no tamanho da navbar - SEMPRE MOSTRA TEXTO
  const calculateDynamicStyles = (navWidth: number, vwWidth: number) => {
    const navWidthPercentage = (navWidth / vwWidth) * 100;
    
    // Configuração base para diferentes cenários
    let fontSize: number;
    let padding: number;
    let itemSpacing: number;
    let languageSwitcherScale: number;

    if (vwWidth < 640) {
      // Mobile: ajustar tamanho mas manter texto visível
      if (navWidthPercentage > 85) {
        // Se navbar muito larga, reduzir mais agressivamente
        fontSize = 10;
        padding = 6;
        itemSpacing = 4;
        languageSwitcherScale = 0.7;
      } else if (navWidthPercentage > 75) {
        fontSize = 11;
        padding = 8;
        itemSpacing = 6;
        languageSwitcherScale = 0.75;
      } else {
        // Tamanho adequado para mobile
        fontSize = 12;
        padding = 10;
        itemSpacing = 8;
        languageSwitcherScale = 0.8;
      }
    } else if (vwWidth < 1024) {
      // Tablet: ajustar proporcionalmente
      if (navWidthPercentage > 70) {
        fontSize = 12;
        padding = 10;
        itemSpacing = 8;
        languageSwitcherScale = 0.85;
      } else if (navWidthPercentage > 60) {
        fontSize = 13;
        padding = 12;
        itemSpacing = 10;
        languageSwitcherScale = 0.9;
      } else {
        fontSize = 14;
        padding = 14;
        itemSpacing = 12;
        languageSwitcherScale = 0.9;
      }
    } else {
      // Desktop: ajustar suavemente se necessário
      if (navWidthPercentage > 60) {
        // Navbar muito larga para desktop, reduzir um pouco
        fontSize = 13;
        padding = 12;
        itemSpacing = 12;
        languageSwitcherScale = 0.9;
      } else if (navWidthPercentage > 50) {
        fontSize = 13.5;
        padding = 14;
        itemSpacing = 14;
        languageSwitcherScale = 0.95;
      } else {
        // Tamanho ideal para desktop
        fontSize = 17;
        padding = 16;
        itemSpacing = 16;
        languageSwitcherScale = 1;
      }
    }

    // Limites mínimos para garantir legibilidade
    fontSize = Math.max(fontSize, 9); // Nunca menor que 9px
    padding = Math.max(padding, 4);   // Nunca menor que 4px
    itemSpacing = Math.max(itemSpacing, 2); // Nunca menor que 2px

    return {
      fontSize: `${fontSize}px`,
      padding: `${padding}px`,
      itemSpacing: `${itemSpacing}px`,
      languageSwitcherScale
    };
  };

  // Observer para mudanças de tamanho da navbar e viewport
  useEffect(() => {
    const updateDimensions = () => {
      if (navRef.current) {
        const navWidth = navRef.current.offsetWidth;
        const vwWidth = window.innerWidth;
        
        setNavbarWidth(navWidth);
        setViewportWidth(vwWidth);
        
        const newStyles = calculateDynamicStyles(navWidth, vwWidth);
        setDynamicStyles(newStyles);
      }
    };

    // ResizeObserver para a navbar
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    // Listener para mudanças de viewport
    window.addEventListener('resize', updateDimensions);
    
    // Primeira medição
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [navTexts]); // Re-calcular quando textos mudarem

  useEffect(() => {
    // Força a atualização baseada no locale detectado da URL
    const currentPath = window.location.pathname;
    const isPortuguese = currentPath.includes('/pt-br');
    
    if (isPortuguese) {
      setNavTexts(['Sobre', 'Projetos', 'Depoimentos', 'Contato']);
    } else {
      setNavTexts(['About', 'Projects', 'Testimonials', 'Contact']);
    }
  }, [locale, t]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
        setShouldAnimate(false);
        setShouldAnimateOut(false);
        setCanAnimate(false);
      } else {
        if (direction < 0) {
          if (!visible && canAnimate) {
            setShouldAnimate(true);
            setShouldAnimateOut(false);
            setCanAnimate(false);
          }
          setVisible(true);
        } else {
          if (visible) {
            setShouldAnimate(false);
            setShouldAnimateOut(true);
            setCanAnimate(true);
            
            setTimeout(() => {
              setVisible(false);
              setShouldAnimateOut(false);
            }, 450);
          }
        }
      }
    }
  });

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  // Classes dinâmicas da navbar
  const navbarClasses = cn(
    "flex !py-5 md:!py-6 md:!px-10 !px-6 fixed top-10 inset-x-0 mx-auto border rounded-full z-[5000] items-center justify-center transition-all duration-300",
    "bg-gradient-to-br !from-purple-300/30 !via-purple-200/10 !to-purple-100/5 dark:!bg-gradient-to-br dark:!from-purple-800/30 dark:!via-purple-900/10 dark:!to-black/5",
    "backdrop-blur-sm",
    "border-purple-300/50 dark:border-purple-700/50",
    "shadow-liquid-inner",
    shouldAnimate && "slide-in-blurred-top",
    shouldAnimateOut && "slide-out-blurred-top",
    className
  );

  // Estilos dinâmicos inline com largura responsiva
  const navbarStyle = {
    padding: dynamicStyles.padding,
    gap: dynamicStyles.itemSpacing,
    maxWidth: viewportWidth < 390 ? '90vw' : 'fit-content',
    width: viewportWidth < 390 ? '85vw' : 
           viewportWidth < 1024 ? '85vw' : '100vw',
    minWidth: viewportWidth < 390 ? '280px' : '320px', // Largura mínima
    ...(shouldAnimate ? {
      animation: 'slide-in-blurred-top 1s cubic-bezier(0.230, 1.000, 0.320, 1.000) both'
    } : shouldAnimateOut ? {
      animation: 'slide-out-blurred-top 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both'
    } : {})
  };

  const navbarContent = (
    <>
      {navItems.map((navItem: any, idx: number) => (
        <a
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 text-shadow-black font-medium antialiased transition-all duration-200",
            "cursor-pointer whitespace-nowrap"
          )}
          style={{
            fontSize: dynamicStyles.fontSize,
            gap: `${parseInt(dynamicStyles.itemSpacing) / 3}px`
          }}
        >
          {/* Ícone visível apenas em telas muito pequenas quando necessário */}
          {viewportWidth < 480 && (
            <span className="opacity-70 mr-1">
              {navItem.icon}
            </span>
          )}
          
          {/* Texto sempre visível, apenas varia o tamanho */}
          <span 
            className="transition-all duration-300"
            style={{ fontSize: dynamicStyles.fontSize }}
          >
            {navTexts[idx] || navItem.name}
          </span>
        </a>
      ))}
      
      {/* Language Switcher com escala dinâmica */}
      <div 
        className="transition-transform duration-300"
        style={{ 
          transform: `scale(${dynamicStyles.languageSwitcherScale})`,
          transformOrigin: 'center'
        }}
      >
        <LanguageSwitcher />
      </div>
    </>
  );

  return (
    <>
      {(visible || shouldAnimateOut) && (
        <div 
          ref={navRef}
          className={navbarClasses}
          style={navbarStyle}
        >
          {navbarContent}
        </div>
      )}
    </>
  );
};