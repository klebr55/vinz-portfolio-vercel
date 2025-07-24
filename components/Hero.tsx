"use client";
import React, { useEffect, useState } from 'react';
import { Spotlight } from './ui/hero/Spotlight';
import { cn } from '@/utils/cn';
import { TextGenerateEffect } from './ui/hero/TextGenerateEffect';
import MagicButton from './ui/button/MagicButton';
import { FaLocationArrow } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';

const Hero = () => {
  const locale = useLocale();
  const t = useTranslations('hero');
  const [heroTexts, setHeroTexts] = useState({
    subtitle: 'Dynamic Web Magic With Next.js',
    title: 'Transforming Concepts Into Seamless User Experiences',
    description: "Hi, I'm Kleber Vinícius, a 23 years old Next.js Developer Based in Brazil.",
    button: 'Show my work'
  });

  useEffect(() => {
    // Força a atualização baseada no locale detectado da URL
    const currentPath = window.location.pathname;
    const isPortuguese = currentPath.includes('/pt-br');
    
    if (isPortuguese) {
      setHeroTexts({
        subtitle: 'Next.js em Ação',
        title: 'Transformando Ideias em Experiências Incríveis',
        description: 'Prazer, sou Kleber Vinícius, um desenvolvedor Next.js de 23 anos nascido no Brasil.',
        button: 'Veja meus projetos'
      });
    } else {
      setHeroTexts({
        subtitle: 'Dynamic Web Magic With Next.js',
        title: 'Transforming Concepts Into Seamless User Experiences',
        description: "Hi, I'm Kleber Vinícius, a 23 years old Next.js Developer Based in Brazil.",
        button: 'Show my work'
      });
    }
  }, [locale, t]);

  return (
    <div className='pb-10 pt-36'>
        <div>
            <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white'/>
            <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple'/>
            <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue'/>
        </div>

        <div className="absolute flex h-screen w-full items-center justify-center bg-white dark:bg-black-100 top-0 left-0">
            <div
                className={cn(
                "absolute inset-0",
                "[background-size:40px_40px]",
                "[background-image:linear-gradient(to_right,rgba(228,228,231,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(228,228,231,0.3)_1px,transparent_1px)]",
                "dark:[background-image:linear-gradient(to_right,rgba(38,38,38,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,0.3)_1px,transparent_1px)]",
                )}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black-100"></div>
        </div>

        <div className='flex justify-center relative my-20 z-10'>
            <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center'>
                <h2 className='uppercase tracking-widest text-xs text-center text-blue-100 max-w-80'>
                    {heroTexts.subtitle}
                </h2>

                <TextGenerateEffect
                    key={heroTexts.title} // Força re-renderização quando o título muda
                    className='text-center text-[40px] md:text-5xl lg:text-6xl'
                    words={heroTexts.title} // Passa a string completa
                />
                
                <p className='text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl'>
                    {heroTexts.description}
                </p>

                <a href="#about" className='w-full flex justify-center md:w-60 md:mt-10'>
                    <MagicButton 
                        title={heroTexts.button}
                        icon={<FaLocationArrow className='relative z-10'/>}
                        position='right'
                    >
                    </MagicButton>
                </a>
            </div>
        </div>
    </div>
  )
}

export default Hero