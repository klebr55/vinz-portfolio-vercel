'use client';
import React, { useEffect, useState } from 'react'
import MagicButton from './ui/button/MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
import { socialMedia } from '@/data'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import enMessages from '@/messages/en.json'
import ptBrMessages from '@/messages/pt-br.json'

const Footer = () => {
  const t = useTranslations('footer');
  const locale = useLocale();
  const [localMessages, setLocalMessages] = useState<typeof ptBrMessages.footer | null>(null);

  useEffect(() => {
    // Force correct messages based on current locale
    const correctMessages = locale === 'pt-br' ? ptBrMessages : enMessages;
    setLocalMessages(correctMessages.footer);
  }, [locale]);

  // Use local messages if available, fallback to translations
  const footerTexts = localMessages || {
    heading: {
      prefix: t('heading.prefix'),
      highlight: t('heading.highlight')
    },
    subheading: t('subheading'),
    contactButton: t('contactButton'),
    copyright: t('copyright')
  };

  return (
    <footer id='contact' className='w-full pt-20 pb-10'>
      <div className='w-full absolute left-0 -bottom-72 min-h-96'>
        <Image 
        src="/footer-grid.svg" 
        alt="grid"
        width={1260}
        height={863}
        className='w-full h-full opacity-50'/>
      </div>

      <div className='flex flex-col items-center'>
        <h1 className='heading lg:max-w-[45vw]'>
          {footerTexts.heading.prefix} <span className='text-purple'>{footerTexts.heading.highlight}</span>
        </h1>
        <p className='text-white-200 md:mt-10 my-5 text-center'>
          {footerTexts.subheading}
        </p>
        <a href="mailto:klebervinicius_@hotmail.com">
          <MagicButton
          title={footerTexts.contactButton}
          icon={<FaLocationArrow />}
          position='right' />
        </a>
      </div>

      <div className='flex mt-16 md:flex-row flex-col justify-between items-center'>
        <p className='md:text-base text-sm md:font-normal font-light'>{footerTexts.copyright}</p>

        <div className='flex items-center gap-3 md:gap-3 lg:gap-6'>
          {socialMedia.map((profile) => (
            <a key={profile.id} href={profile.link}>
              <div key={profile.id} className='w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300 sm:mt-0 mt-4'>
                <Image src={profile.img} 
                alt={profile.img}
                width={20}
                height={20}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer