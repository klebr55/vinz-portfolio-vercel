"use client";
import React, { useEffect, useState } from 'react'
import { AnimatedTestimonials } from './ui/testimonials/animated-testimonials'
import { companies } from '@/data'
import Image from 'next/image'

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  linkedin?: string;
}

interface ClientTexts {
  heading: {
    prefix: string;
    highlight: string;
  };
  testimonials: Testimonial[];
}

const ClientsAnimated = () => {
  // Estado inicial vazio
  const [clientTexts, setClientTexts] = useState<ClientTexts>({
    heading: {
      prefix: '',
      highlight: ''
    },
    testimonials: []
  });

  useEffect(() => {
    // Detecta o idioma baseado na URL atual
    const currentPath = window.location.pathname;
    const isPortuguese = currentPath.includes('/pt-br');
    
    const testimonialsData = isPortuguese ? [
      {
        quote: 'Conheci o Kleber quando ele ainda dava os primeiros passos na carreira e me orgulho demais de ver seu crescimento como profissional e ser humano. Ele não só entrega, mas supera expectativas seja em projetos complexos, prazos apertados ou desafios inéditos, sempre com seriedade e maestria técnica.',
        name: 'Éder Lemes',
        designation: 'Coordenador de Inovação e Projetos na SEPLAG-MT',
        src: '/Eder.svg',
        linkedin: 'https://www.linkedin.com/in/ederlemes'
      },
      {
        quote: 'Trabalhar em projetos com o Kleber Vinícius é sempre uma experiência verdadeiramente construtiva e inovadora. Sua notável capacidade de aprendizado e constante renovação de conhecimento são qualidades que agregam imensa confiança e garantem a alta qualidade na entrega de seus serviços.',
        name: 'João Paulo da Silva',
        designation: 'Gestor de Relacionamento e Projetos da Aequilíbrio Sistemas',
        src: '/Joao.svg',
        linkedin: 'https://www.linkedin.com/in/joao-paulo-da-silva-14142a1aa'
      },
      {
        quote: 'Tive o prazer de trabalhar com o Kleber em vários projetos de desenvolvimento web. Sua expertise técnica, atenção aos detalhes e dedicação são admiráveis. Ele sempre entrega trabalhos de alta qualidade, no prazo e com soluções criativas.',
        name: 'Jéssika Lorena',
        designation: 'Gerente Administrativa do Sincomroo-MT',
        src: '/Jessika.svg',
        linkedin: 'https://www.linkedin.com/in/jéssika-lorena-6932bb223'
      }
    ] : [
      {
        quote: 'I met Kleber when he was still taking his first steps in his career and I am extremely proud to see his growth as a professional and human being. He not only delivers, but exceeds expectations — whether in complex projects, tight deadlines or unprecedented challenges.',
        name: 'Éder Lemes',
        designation: 'Innovation and Projects Coordinator at SEPLAG-MT',
        src: '/Eder.svg',
        linkedin: 'https://www.linkedin.com/in/ederlemes'
      },
      {
        quote: 'Working on projects with Kleber Vinícius is always a truly constructive and innovative experience. His remarkable learning ability and constant renewal of knowledge are qualities that add immense confidence and guarantee high quality delivery.',
        name: 'João Paulo da Silva',
        designation: 'Relationship and Project Manager at Aequilíbrio Sistemas',
        src: '/Joao.svg',
        linkedin: 'https://www.linkedin.com/in/joao-paulo-da-silva-14142a1aa'
      },
      {
        quote: 'I had the pleasure of working with Kleber on several web development projects. His technical expertise, attention to detail and dedication are admirable. He always delivers high quality work, on time and with creative solutions.',
        name: 'Jéssika Lorena',
        designation: 'Administrative Manager at Sincomroo-MT',
        src: '/Jessika.svg',
        linkedin: 'https://www.linkedin.com/in/jéssika-lorena-6932bb223'
      }
    ];
    
    setClientTexts({
      heading: isPortuguese ? {
        prefix: 'O que os clientes dizem sobre',
        highlight: 'meu trabalho'
      } : {
        prefix: 'What clients say about',
        highlight: 'my work'
      },
      testimonials: testimonialsData
    });
  }, []);

  // Não renderiza nada até que os dados sejam carregados
  if (clientTexts.testimonials.length === 0) {
    return null;
  }

  return (
    <div className='py-20' id='testimonials'>
      <h1 className='heading mb-10'>
        {clientTexts.heading.prefix} {''}
        <span className='text-purple'>{clientTexts.heading.highlight}</span>
      </h1>

      {/* Componente AnimatedTestimonials */}
      <div className='flex flex-col items-center'>
        <AnimatedTestimonials 
          testimonials={clientTexts.testimonials} 
          autoplay={true}
        />
      </div>

      {/* Seção de empresas (mantida igual) */}
      <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-5 md:gap-10 max-lg:mt-10 mt-20'>
        {companies.map(({id, img, name }) => (
          <div key={id} className='flex md:max-w-60 max-w-32 gap-2'>
            <Image
              src={img}
              alt={name}
              className='sm:w-[90px] md:w-[100px] lg:w-full w-[80px]'
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientsAnimated
