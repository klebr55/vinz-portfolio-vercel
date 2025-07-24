"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/utils/cn";
import { useLocale } from 'next-intl'; // Importe o hook useLocale

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 2,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const locale = useLocale(); // Obtenha o locale atual
  // eslint-disable-next-line prefer-const
  let wordsArray = words.split(" ");
  
  useEffect(() => {
    // Verifica se o scope existe e se há elementos span disponíveis
    if (scope.current) {
      const spans = scope.current.querySelectorAll("span");
      
      // Só executa a animação se existirem spans no DOM
      if (spans.length > 0) {
        // Primeiro, redefine todos os spans para opacity 0
        animate("span", { opacity: 0, filter: filter ? "blur(10px)" : "none" }, { duration: 0 });
        
        // Depois, anima para visible com um pequeno delay
        setTimeout(() => {
          const currentSpans = scope.current?.querySelectorAll("span");
          if (currentSpans && currentSpans.length > 0) {
            animate("span", { opacity: 1, filter: filter ? "blur(0px)" : "none" }, 
              { duration: duration ? duration : 1, delay: stagger(0.2) });
          }
        }, 100);
      }
    }
  }, [words, locale, animate, duration, filter, scope]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          // Use um threshold diferente baseado no locale
          const threshold = locale === 'pt-br' ? 2 : 3;
          
          return (
            <motion.span
              key={word + idx}
              className={`${idx > threshold ? 'text-purple' : 'dark:text-white text-black'} opacity-0`}
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <div className=" dark:text-white text-black leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};