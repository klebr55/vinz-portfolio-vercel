"use client";
import { projects } from '@/data'
import React, { useEffect, useState } from 'react'
import { PinContainer } from './ui/projects/3d-pin'
import { FaLocationArrow } from 'react-icons/fa'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import enMessages from '@/messages/en.json';
import ptBrMessages from '@/messages/pt-br.json';

const RecentProjects = () => {
  const t = useTranslations('projects');
  const locale = useLocale();
  const [localMessages, setLocalMessages] = useState<typeof ptBrMessages.projects | null>(null);

  useEffect(() => {
    const correctMessages = locale === 'pt-br' ? ptBrMessages : enMessages;
    setLocalMessages(correctMessages.projects);
  }, [locale]);

  const projectTexts = localMessages || {
    heading: {
      prefix: t('heading.prefix'),
      highlight: t('heading.highlight')
    },
    checkLiveSite: t('checkLiveSite'),
    items: projects.map((_, index) => ({
      title: t(`items.${index}.title`),
      description: t(`items.${index}.description`)
    }))
  };

  return (
    <div className='py-20' id='projects'>
        <h1 className='heading'>
            {projectTexts.heading.prefix} {''}
            <span className='text-purple'>{projectTexts.heading.highlight}</span>
        </h1>
        <div className='flex flex-wrap items-center justify-center p-4 gap-x-24 gap-y-8 mt-10'>
            {projects.map(({ id, img, iconLists, link }, index) => (
                <div key={id} className='sm:h-[41rem] h-[32rem] lg:min-h-[32.5rem] flex items-center justify-center sm:w-[570px] w-[80vw]'>
                    <PinContainer title={link} href={link}>
                        <div className='relative flex items-center justify-center sm:w-[570px] w-80 overflow-hidden sm:h-[40vh] h-[30vh] mb-10'>
                            <div className='relative flex justify-center w-full h-full overflow-hidden lg:rounded-3xl rounded-xl bg-[#13162d]'>
                                {/* <Image 
                                src="/bg.png" 
                                alt="bg-img"
                                className='w-full h-full cover'
                                width={100}
                                height={100} /> */}
                                <Image 
                                src={img} 
                                alt={projectTexts.items[index]?.title || ''}
                                width={100}
                                height={100}
                                className='z-10 absolute w-full h-full bottom-0 object-cover' />
                            </div>
                        </div>
                        <h1 className='font-bold lg:text-2xl md:text-xl text-base line-clamp-1'>
                            {projectTexts.items[index]?.title}
                        </h1>

                        <p className='lg:text-lg lg:font-normal font-light text-sm line-clamp-3'>
                            {projectTexts.items[index]?.description}
                        </p>

                        <div className="flex items-center justify-between mt-7 mb-3">
                            <div className='flex items-center '>
                                {iconLists.map((icon, iconIndex) => (
                                    <div key={icon} className='border border-white/[0.2] rounded-full glass-card lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center'
                                    style={{transform: `translateX(-${5 * iconIndex * 2}px)`,
                                    }}>
                                        <Image 
                                        src={icon} 
                                        alt={icon}
                                        width={100}
                                        height={100} 
                                        className='p-2'>
                                        </Image>
                                    </div>
                                ))}
                            </div>

                            <div className='flex justify-center items-center'>
                                <p className='flex lg:text-xl md:text-xs text-xs text-purple'>{projectTexts.checkLiveSite}</p>
                                <FaLocationArrow className='ms-3'
                                color='#CBACF9'/>
                            </div>
                        </div>
                    </PinContainer>
                </div>
            ))}
        </div>
    </div>
  )
}

export default RecentProjects