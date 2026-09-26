"use client";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 2,
  as: Wrapper = "div",
  highlightFrom,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  /** Element for the text block. Pass "h1" when this is the page heading. */
  as?: "div" | "h1" | "h2" | "h3";
  /** Word index (0-based) from which the accent colour starts. */
  highlightFrom?: number;
}) => {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();
  // Server render and the first client paint show the finished text. The words
  // only get hidden once we know JS is running AND motion is allowed, so the
  // heading is never invisible with JS disabled, mid-hydration, or under
  // prefers-reduced-motion.
  const [willAnimate, setWillAnimate] = useState(false);
  const wordsArray = words.split(" ");
  const accentStart = highlightFrom ?? Math.ceil(wordsArray.length / 2);

  useEffect(() => {
    if (reduceMotion) return;
    setWillAnimate(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!willAnimate || !scope.current) return;
    const spans = scope.current.querySelectorAll("span");
    if (spans.length === 0) return;

    animate(
      "span",
      { opacity: 0, filter: filter ? "blur(10px)" : "none" },
      { duration: 0 }
    );
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration: duration ?? 1, delay: stagger(0.2) }
    );
  }, [willAnimate, words, animate, duration, filter, scope]);

  return (
    <Wrapper className={cn("font-bold", className)}>
      <div className="my-4">
        <div className="dark:text-white text-black leading-snug tracking-wide">
          <motion.div ref={scope}>
            {wordsArray.map((word, idx) => (
              <motion.span
                key={word + idx}
                className={
                  idx >= accentStart
                    ? "text-purple"
                    : "dark:text-white text-black"
                }
              >
                {word}{" "}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </Wrapper>
  );
};
