"use client";
import React, { useEffect, useState } from 'react'
import { InfiniteMovingCards } from './ui/clients/InfiniteMovingCards'
import { companies } from '@/data'
import Image from 'next/image'

interface Testimonial {
  content: string;
  name: string;
  title: string;
  img: string;
  linkedin?: string; // Novo campo para link do LinkedIn
}

interface ClientTexts {
  heading: {
    prefix: string;
    highlight: string;
  };
  testimonials: Testimonial[];
}

const Clients = () => {
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
        content: 'Conheci o Kleber quando ele ainda dava os primeiros passos na carreira e me orgulho demais de ver seu crescimento como profissional e ser humano. Ele não só entrega, mas supera expectativas — seja em projetos complexos, prazos apertados ou desafios inéditos — sempre com seriedade e maestria técnica. Mas, acima do código, o que me conquista é a humildade, o sorriso fácil e a vontade genuína de aprender. Trabalhar ao lado dele é um privilégio.',
        name: 'Éder Lemes',
        title: 'Coordenador de Inovação e Projetos na SEPLAG-MT',
        img: '/Eder.svg',
        linkedin: 'https://www.linkedin.com/in/ederlemes'
      },
      {
        content: 'Trabalhar em projetos com o Kleber Vinícius é sempre uma experiência verdadeiramente construtiva e inovadora. Sua notável capacidade de aprendizado e constante renovação de conhecimento são qualidades que agregam imensa confiança e garantem a alta qualidade na entrega de seus serviços.',
        name: 'João Paulo da Silva',
        title: 'Gestor de Relacionamento e Projetos da Aequilíbrio Sistemas',
        img: '/Joao.svg',
        linkedin: 'https://www.linkedin.com/in/joao-paulo-da-silva-14142a1aa'
      },
      {
        content: 'Tive o prazer de trabalhar com o Kleber em vários projetos de desenvolvimento web. Sua expertise técnica, atenção aos detalhes e dedicação são admiráveis. Ele sempre entrega trabalhos de alta qualidade, no prazo e com soluções criativas. É um profissional que faz a diferença em qualquer equipe!',
        name: 'Jéssika Lorena',
        title: 'Gerente Administrativa do Sincomroo-MT',
        img: '/Jessika.svg',
        linkedin: 'https://www.linkedin.com/in/jéssika-lorena-6932bb223'
      }
    ] : [
      {
        content: 'I met Kleber when he was still taking his first steps in his career and I am extremely proud to see his growth as a professional and human being. He not only delivers, but exceeds expectations — whether in complex projects, tight deadlines or unprecedented challenges — always with seriousness and technical mastery. But, above the code, what wins me over is his humility, easy smile and genuine desire to learn. Working alongside him is a privilege.',
        name: 'Éder Lemes',
        title: 'Innovation and Projects Coordinator at SEPLAG-MT',
        img: '/Eder.svg',
        linkedin: 'https://www.linkedin.com/in/ederlemes'
      },
      {
        content: 'Working on projects with Kleber Vinícius is always a truly constructive and innovative experience. His remarkable learning ability and constant renewal of knowledge are qualities that add immense confidence and guarantee high quality in the delivery of his services.',
        name: 'João Paulo da Silva',
        title: 'Relationship and Project Manager at Aequilíbrio Sistemas',
        img: '/Joao.svg',
        linkedin: 'https://www.linkedin.com/in/joao-paulo-da-silva-14142a1aa'
      },
      {
        content: 'I had the pleasure of working with Kleber on several web development projects. His technical expertise, attention to detail and dedication are admirable. He always delivers high quality work, on time and with creative solutions. He is a professional who makes a difference in any team!',
        name: 'Jéssika Lorena',
        title: 'Administrative Manager at Sincomroo-MT',
        img: '/Jessika.svg',
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
  }, []); // Array vazio - executa apenas uma vez

  // Não renderiza nada até que os dados sejam carregados
  if (clientTexts.testimonials.length === 0) {
    return null;
  }

  // Debug: vamos ver o que está sendo passado
  const mappedItems = clientTexts.testimonials.map((testimonial) => ({
    quote: testimonial.content,
    name: testimonial.name,
    title: testimonial.title,
    img: testimonial.img,
    linkedin: testimonial.linkedin
  }));

  return (
    <div className='py-20' id='testimonials'>
        <h1 className='heading'>
            {clientTexts.heading.prefix} {''}
            <span className='text-purple'>{clientTexts.heading.highlight}</span>
        </h1>
        <div className='flex flex-col items-center max-lg:mt-10 mt-20'>
            <InfiniteMovingCards
              items={mappedItems}
              direction='right'
              speed='slow'
            />

            <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-5 md:gap-10 max-lg:mt-10 mt-10'>
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
    </div>
  )
}

export default Clients