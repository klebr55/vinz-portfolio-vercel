"use client";
import { workExperience } from '@/data'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/experience/MovingBorders'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import enMessages from '@/messages/en.json';
import ptBrMessages from '@/messages/pt-br.json';

const Experience = () => {
  const t = useTranslations('experience');
  const locale = useLocale();
  const [localMessages, setLocalMessages] = useState<typeof ptBrMessages.experience | null>(null);

  useEffect(() => {
    const correctMessages = locale === 'pt-br' ? ptBrMessages : enMessages;
    setLocalMessages(correctMessages.experience);
  }, [locale]);

  const experienceTexts = localMessages || {
    heading: {
      prefix: t('heading.prefix'),
      highlight: t('heading.highlight')
    },
    jobs: workExperience.map((_, index) => ({
      title: t(`jobs.${index}.title`),
      desc: t(`jobs.${index}.desc`)
    }))
  };

  return (
    <div className='w-full py-20' id='experience'>
        <h1 className='heading'>
            {experienceTexts.heading.prefix} {''}
            <span className='text-purple'>{experienceTexts.heading.highlight}</span>
        </h1>
        <div className='w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10'>
            {workExperience.map((card, index) => (
                <Button key={card.id}
                duration={Math.floor(Math.random() * 10000) + 10000}
                borderRadius="1.75rem"
                style={{
                    background: "rgb(4,7,29)",
                    backgroundColor:
                        "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    borderRadius: `calc(1.75rem* 0.96)`,
                }}
                className='flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800 justify-start'>
                    <div className='flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2'>
                        <Image 
                        src={card.thumbnail} 
                        alt={card.thumbnail}
                        width={100}
                        height={100} 
                        className='max-w-[161.38px] lg:w-32 md:w-20 w-16'/>
                    </div>
                    <div className='lg:ms-5 py-4 px-4'>
                        <h1 className='text-start text-xl md:text-2xl font-bold'>
                            {experienceTexts.jobs[index]?.title}
                        </h1>
                        <p className='text-start text-white-100 mt-3 font-semibold'>
                            {experienceTexts.jobs[index]?.desc}
                        </p>
                    </div>
                </Button>
            ))}
        </div>
    </div>
  );
};

export default Experience