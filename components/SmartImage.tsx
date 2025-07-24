'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { imagePlaceholders } from '@/data';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export default function SmartImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [showFullQuality, setShowFullQuality] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const placeholderSrc = imagePlaceholders[src as keyof typeof imagePlaceholders];

  useEffect(() => {
    if (priority) {
      setShowFullQuality(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Delay loading full image to prioritize above-the-fold content
          setTimeout(() => setShowFullQuality(true), 200);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div 
      ref={imgRef} 
      className={className}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {!isInView && (
        <div className="w-full h-full loading-skeleton" />
      )}
      
      {isInView && (
        <>
          {/* Show placeholder first if available */}
          {placeholderSrc && !showFullQuality && (
            <Image
              src={placeholderSrc}
              alt={`${alt} placeholder`}
              width={width}
              height={height}
              fill={fill}
              sizes={sizes}
              className="transition-opacity duration-300"
              quality={30}
            />
          )}
          
          {/* Load full quality image */}
          {showFullQuality && (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              fill={fill}
              sizes={sizes}
              priority={priority}
              className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
              quality={85}
            />
          )}
        </>
      )}
    </div>
  );
}