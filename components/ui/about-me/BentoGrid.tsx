/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { cn } from "@/utils/cn";
import React, { useState, useEffect } from "react";
import { BackgroundGradientAnimation } from "./GradientBg";
import { GlobeDemo } from "./GridGlobe";
import Lottie from "react-lottie";
import animationData from "@/data/confetti.json";
import MagicButton from "../button/MagicButton";
import { IoCopyOutline } from "react-icons/io5";
import { FaGlobeAmericas } from "react-icons/fa";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { url } from "inspector";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  id,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  id?: number;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const locale = useLocale();
  const t = useTranslations('grid');
  const [copied, setCopied] = useState(false);
  const [gridTexts, setGridTexts] = useState({
    copyEmail: 'Copy my email',
    emailCopied: 'Email copied!'
  });

  useEffect(() => {
    // Força a atualização baseada no locale detectado da URL
    const currentPath = window.location.pathname;
    const isPortuguese = currentPath.includes('/pt-br');
    
    if (isPortuguese) {
      setGridTexts({
        copyEmail: 'Copiar meu email',
        emailCopied: 'Email copiado!'
      });
    } else {
      setGridTexts({
        copyEmail: 'Copy my email',
        emailCopied: 'Email copied!'
      });
    }
  }, [locale, t]);

  const handleCopy = () => {
    navigator.clipboard.writeText("klebervinicius_@hotmail.com");

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 4000)

  }

  const lottieOptions = {
    loop: false,
    autoplay: copied,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    }
  };

  return (
    <div
      className={cn(
        `group/bento shadow-input row-span-1 overflow-hidden flex flex-col ${id === 3 ? 'justify-center' : 'justify-between'} space-y-4 relative rounded-3xl transition duration-200 hover:shadow-xl dark:shadow-none border border-white/[0.1]`,
        className
      )}
      style={{
        background: 'rgb(2, 0, 36)',
        backgroundColor: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(59,59,68,1) 26%, rgba(93,108,111,1) 100%)',
        ...(id === 3 ? { backgroundImage: 'url(/bg_id3.svg)',
          backgroundBlendMode: 'normal', backgroundSize: 'cover',
         } : {}),
      }}
        >
      <div className={`${id === 6 && 'flex justify-center'} h-full`}>
        <div className="w-full h-full absolute">
            {img && (
              <Image
                src={img}
                alt={img}
                width={100}
                height={100}
                className={cn(imgClassName, 'object-cover, object-center, object-cover')}
              />)}
        </div>
        <div className={`absolute right-0 -bottom-5 ${id === 5 && 'w-full h-[510px] opacity-25 bottom-0'} ${id === 4 && 'w-full h-full !bottom-0'}`}>
                {spareImg && (
                    <Image
                        src={spareImg}
                        alt={spareImg}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover object-center"
                    />
                )}
        </div>

        {id === 6 && (
            <BackgroundGradientAnimation>
                {/* <div className="absolute z-50 flex items-center justify-center text-center font-bold"/> */}
            </BackgroundGradientAnimation>
        )}

        <div className={cn(
            titleClassName, 'group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10'
        )}>
        <div className="font-sans text-sm font-extralight text-[#clc2d3]md:text-xs lg:text-base z-10">
            {description}
          <div className={`mt-2 mb-2 font-sans font-bold text-lg lg:text-3xl max-w-full z-10`}>
              <>
                {title} 
              </>
          </div>
        </div>

        {id === 2 && <GlobeDemo />}

        {id === 3 && (
          <div className="flex gap-1 lg:gap-5 w-fit absolute right-1 lg:right-1">
              <div className="flex flex-col mb-3 lg:mb-4 gap-3 lg:gap-8">
                  {['React.js', 'Next.js', 'Typescript'].map((item) => (
                      <span key={item} className="py-2 lg:py-3.5 lg:px-3 px-3 text-xs lg:text-base opacity-100 text-center text-shadow-black glass-card">
                          <span className="relative z-10">{item}</span>
                      </span>
                  ))}
                  <span className="py-2 hidden lg:py-3.5 lg:px-3 px-3 text-xs lg:text-base opacity-100 text-center text-shadow-black glass-card sm:hidden">
                  </span>
              </div>
              <div className="flex flex-col mt-3 lg:mt-4 gap-3 lg:gap-8">
                  <span className="py-2 hidden lg:py-3.5 lg:px-3 px-3 text-xs lg:text-base opacity-100 text-center text-shadow-black glass-card">
                  </span>
                  {['Bootstrap 5', 'TailwindCSS', 'jQuery'].map((item) => (
                      <span key={item} className="py-2 lg:py-3.5 lg:px-3 px-3 text-xs lg:text-base opacity-100 text-center text-shadow-black glass-card">
                          <span className="relative z-10">{item}</span>
                      </span>
                  ))}
              </div>
          </div>
      )}

        {id === 6 && (
            <div className="mt-5 relative">
                {copied && (
                  <div className="absolute -bottom-5 right-0 w-full h-full pointer-events-none z-10">
                    <Lottie 
                      options={lottieOptions}
                      height="100px"
                      width="100%"
                    />
                  </div>
                )}

                <MagicButton
                title={copied ? gridTexts.emailCopied : gridTexts.copyEmail}
                icon={<IoCopyOutline />}
                position="left"
                otherClasses="!bg-[#161a31]"
                handleClick={handleCopy}
                />
            </div>
        )}

            </div>
        </div>
    </div>
  );
};
