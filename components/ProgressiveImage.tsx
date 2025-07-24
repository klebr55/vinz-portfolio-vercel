'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  lowQualitySrc?: string; // Optional low-quality placeholder
}

export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  lowQualitySrc
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [showHighQuality, setShowHighQuality] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLowQualityLoad = () => {
    // Start loading high quality image after low quality loads
    setTimeout(() => setShowHighQuality(true), 100);
  };

  const handleHighQualityLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`relative ${className}`}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
      
      {isInView && (
        <>
          {/* Low quality placeholder image (loads first) */}
          {lowQualitySrc && !showHighQuality && (
            <Image
              src={lowQualitySrc}
              alt={alt}
              width={width}
              height={height}
              fill={fill}
              sizes={sizes}
              className="absolute inset-0 blur-sm scale-110 transition-opacity duration-500"
              onLoad={handleLowQualityLoad}
              quality={20}
            />
          )}
          
          {/* High quality image (loads after low quality or immediately if no placeholder) */}
          {(showHighQuality || !lowQualitySrc) && (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              fill={fill}
              sizes={sizes}
              priority={priority}
              className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleHighQualityLoad}
              quality={85}
            />
          )}
        </>
      )}
    </div>
  );
}