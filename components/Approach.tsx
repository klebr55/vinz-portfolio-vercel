"use client";
import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CanvasRevealEffect } from './ui/approach/CanvasRevealEffect';
import { useTranslations } from 'next-intl';

const Approach = () => {
  const t = useTranslations('approach');
  const phases = [0, 1, 2].map((index) => ({
    order: t(`phases.${index}.order`),
    title: t(`phases.${index}.title`),
    description: t(`phases.${index}.description`),
  }));

  return (
    <section className='w-full py-20'>

      <h2 className='heading'>
        {t('heading.prefix')} <span className='text-purple'>{t('heading.highlight')}</span>
      </h2>

        <div className="my-20 flex flex-col lg:flex-row items-center justify-center gap-4">
        <Card title={phases[0].title} order={phases[0].order} description={phases[0].description}>
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-emerald-900"
          />
        </Card>
        <Card 
          title={phases[1].title}
          order={phases[1].order}
          description={phases[1].description}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[
              [236, 72, 153],
              [232, 121, 249],
            ]}
            dotSize={2}
          />
          <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" /> 
        </Card>
        <Card 
          title={phases[2].title}
          order={phases[2].order}
          description={phases[2].description}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-sky-600"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </section>
  )
}

export default Approach;

const Card = ({
  title,
  order,
  children,
  description
}: {
  title: string;
  order: string;
  children?: React.ReactNode;
  description: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  const reduceMotion = useReducedMotion();
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto relative p-4 rounded-3xl h-[35rem]"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
 
      <AnimatePresence>
        {hovered && !reduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
 
      <div className="relative z-20 flex flex-col items-center text-center">
        <span aria-hidden="true" className="mb-5 inline-flex h-12 min-w-12 items-center justify-center rounded-full border border-white/30 bg-black/70 px-3 text-lg font-bold text-white">
          {order}
        </span>
        <h3 className="relative z-10 text-3xl font-bold text-black dark:text-white">
          {title}
        </h3>
        <p className="relative z-10 mt-4 text-sm font-medium text-slate-700 dark:text-slate-100">
          {description}
        </p>
      </div>
    </div>
  );
};
 
export const Icon = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
