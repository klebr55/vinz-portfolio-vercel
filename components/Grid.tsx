"use client";
import React, { useEffect, useState } from 'react';
import { BentoGrid } from "@/components/ui/about-me/BentoGrid";
import { BentoGridItem } from '@/components/ui/about-me/BentoGrid';
import { gridItems } from '@/data';
import { useTranslations, useLocale } from 'next-intl';

const Grid = () => {
  const locale = useLocale();
  const t = useTranslations('grid');
  const [gridTexts, setGridTexts] = useState([
    {
      title: "I prioritize client collaboration, fostering open communication while working on projects.",
      description: ""
    },
    {
      title: "I'm very flexible with time zone communications.",
      description: ""
    },
    {
      title: (
              <>
                My tech stack
              </>
              ),
      description: (
        <>
          I constantly try to improve
        </>
      )
    },
    {
      title: "Tech enthusiast with a passion for development.",
      description: ""
    },
    {
      title: "Front-End Web Developer",
      description: "Freelancer in collaboration with NKS Criactive Design™"
    },
    {
      title: "Do you want to hire me or maybe start a project together?",
      description: ""
    }
  ]);

  useEffect(() => {
    // Força a atualização baseada no locale detectado da URL
    const currentPath = window.location.pathname;
    const isPortuguese = currentPath.includes('/pt-br');
    
    if (isPortuguese) {
      setGridTexts([
        {
          title: "Eu priorizo a colaboração com o cliente, promovendo uma comunicação aberta durante todo o projeto.",
          description: ""
        },
        {
          title: "Sou flexível com diferentes fusos horários.",
          description: ""
        },
        {
          title: (
            <>
              Minha stack
              <br className="no-break-550-768 hidden sm:block md:hidden lg:block xl:hidden" />
              <span className="space-550-768 sm:hidden md:block lg:hidden xl:block"> </span>
              tecnológica
            </>
          ),
          description: (
            <>
              Estou constantemente
              <br className="no-break-550-768 hidden sm:block md:hidden lg:block xl:hidden" />
              <span className="space-550-768 sm:hidden md:block lg:hidden xl:block"> </span>
              buscando melhorar
            </>
          )
        },
        {
          title: "Sou entusiasta de tecnologia com uma enorme paixão por Desenvolvimento Web.",
          description: ""
        },
        {
          title: "Desenvolvedor Web Front-End",
          description: "Freelancer em colaboração com a NKS Criactive Design™"
        },
        {
          title: "Quer me contratar ou quem sabe iniciar um projeto juntos?",
          description: ""
        }
      ]);
    } else {
      setGridTexts([
        {
          title: "I prioritize client collaboration, fostering open communication while working on projects.",
          description: ""
        },
        {
          title: "I'm very flexible with time zone communications.",
          description: ""
        },
        {
          title: (
              <>
                My tech stack
              </>
              ),
          description: (
            <>
              I constantly try to improve
            </>
          )
        },
        {
          title: "Tech enthusiast with a passion for Web Development.",
          description: ""
        },
        {
          title: "Front-End Web Developer",
          description: "Freelancer in collaboration with NKS Criactive Design™"
        },
        {
          title: "Do you want to hire me or maybe start a project together?",
          description: ""
        }
      ]);
    }
  }, [locale, t]);

  return (
    <section id='about' className='py-20'>
        <BentoGrid>
            {gridItems.map(({ id, className, img, imgClassName, titleClassName, spareImg }, index) => (
                <BentoGridItem 
                    id={id}
                    key={id}
                    title={gridTexts[index]?.title || ""}
                    description={gridTexts[index]?.description || ""}
                    img={img}
                    className={className}
                    imgClassName={imgClassName}
                    titleClassName={titleClassName}
                    spareImg={spareImg}
                />
            ))}
        </BentoGrid>
    </section>
  )
}

export default Grid;