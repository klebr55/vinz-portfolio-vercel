import React from 'react';
import { Spotlight } from './ui/hero/Spotlight';
import { cn } from '@/utils/cn';
import { TextGenerateEffect } from './ui/hero/TextGenerateEffect';
import MagicButton from './ui/button/MagicButton';
import { FaLocationArrow } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

/*
 * Copy comes from messages/{locale}.json through next-intl.
 *
 * It previously came from a useState default plus a useEffect that read
 * window.location.pathname, so the first paint was always English (a visible
 * flash on /pt-br), the imported `t` was never called, and the strings in
 * messages/*.json were dead. The age claim lived only in those hardcoded
 * defaults and is gone with them.
 */
const Hero = () => {
  const t = useTranslations('hero');

  return (
    <div className='pb-10 pt-36'>
        <div>
            <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white'/>
            <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple'/>
            <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue'/>
        </div>

        <div className="absolute flex h-screen w-full items-center justify-center bg-white dark:bg-black-100 top-0 left-0">
            <div
                aria-hidden="true"
                className={cn(
                "absolute inset-0",
                "[background-size:40px_40px]",
                "[background-image:linear-gradient(to_right,rgba(228,228,231,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(228,228,231,0.3)_1px,transparent_1px)]",
                "dark:[background-image:linear-gradient(to_right,rgba(38,38,38,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,0.3)_1px,transparent_1px)]",
                )}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black-100"></div>
        </div>

        <div className='flex justify-center relative my-20 z-10'>
            <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center'>
                <p className='uppercase tracking-widest text-xs text-center text-blue-100 max-w-80'>
                    {t('subtitle')}
                </p>

                {/* The document's only h1. This block used to render a <div>,
                    leaving the page with no h1 at all. */}
                <TextGenerateEffect
                    as='h1'
                    className='text-center text-[40px] md:text-5xl lg:text-6xl text-balance'
                    words={t('title')}
                />

                <p className='text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl text-pretty'>
                    {t('description')}
                </p>

                <div className='w-full flex justify-center md:w-60 md:mt-10'>
                    {/* href was "#about" while the label said "see my projects". */}
                    <MagicButton
                        href='#projects'
                        title={t('button')}
                        icon={<FaLocationArrow className='relative z-10' aria-hidden='true' />}
                        position='right'
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero
