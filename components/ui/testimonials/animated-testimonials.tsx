"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  linkedin?: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
      }, 6000); // 6 segundos para dar tempo de ler
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-10 font-sans antialiased md:max-w-6xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2 lg:gap-32">
        {/* Coluna das imagens */}
        <div>
          <div className="relative h-80 w-full md:h-96">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom cursor-pointer"
                  onClick={() => setActive(index)}
                >
                  <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <Image
                      src={testimonial.src}
                      alt={testimonial.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center"
                      draggable={false}
                      priority={index === 0}
                    />
                    {/* Overlay gradiente sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Coluna do conteúdo */}
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                {testimonials[active].name}
              </h3>
              {testimonials[active].linkedin && (
                <a
                  href={testimonials[active].linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors transform hover:scale-110"
                  aria-label={`LinkedIn de ${testimonials[active].name}`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
            </div>
            <p className="text-sm md:text-base text-gray-500 dark:text-neutral-400 mb-6 font-medium">
              {testimonials[active].designation}
            </p>
            <motion.blockquote className="text-lg md:text-xl text-gray-700 dark:text-neutral-300 leading-relaxed font-medium italic border-l-4 border-purple-500 pl-4">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.blockquote>
          </motion.div>
          
          {/* Controles de navegação */}
          <div className="flex gap-4 pt-12 md:pt-8">
            <button
              onClick={handlePrev}
              className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Depoimento anterior"
            >
              <IconArrowLeft className="h-6 w-6 text-gray-600 transition-transform duration-300 group-hover/button:-translate-x-1 dark:text-neutral-400" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Próximo depoimento"
            >
              <IconArrowRight className="h-6 w-6 text-gray-600 transition-transform duration-300 group-hover/button:translate-x-1 dark:text-neutral-400" />
            </button>
          </div>

          {/* Indicadores de progresso */}
          <div className="flex gap-3 mt-6 justify-center md:justify-start">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`h-3 w-10 rounded-full transition-all duration-300 ${
                  isActive(index)
                    ? "bg-purple-500 shadow-lg shadow-purple-500/30"
                    : "bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500"
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
