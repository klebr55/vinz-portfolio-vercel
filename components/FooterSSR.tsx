import React from 'react'
import MagicButton from './ui/button/MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
import { socialMedia } from '@/data'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

// Footer otimizado para SSR - sem interatividade cliente
const FooterSSR = async () => {
  const t = await getTranslations('footer');

  const footerTexts = {
    heading: {
      prefix: t('heading.prefix'),
      highlight: t('heading.highlight')
    },
    subheading: t('subheading'),
    contactButton: t('contactButton'),
    copyright: t('copyright')
  };

  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      {/* Background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <Image
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50"
          width={1000}
          height={400}
          priority={false}
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          {footerTexts.heading.prefix}{" "}
          <span className="text-purple">{footerTexts.heading.highlight}</span>{" "}
          {footerTexts.subheading}
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          {footerTexts.subheading}
        </p>
        <a href="mailto:klebervinicius.dev@gmail.com">
          <MagicButton
            title={footerTexts.contactButton}
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>

      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          {footerTexts.copyright}
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <div
              key={info.id}
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <Image 
                src={info.img} 
                alt="social media icon" 
                width={20} 
                height={20}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default FooterSSR
