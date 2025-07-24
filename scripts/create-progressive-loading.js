#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Generate low-quality SVG placeholders for progressive loading
function generatePlaceholderSVG(originalSize, color = '#374151') {
  return `<svg width="${originalSize.width || 400}" height="${originalSize.height || 300}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <rect width="60%" height="20%" x="20%" y="40%" fill="#4b5563" rx="4"/>
    <rect width="40%" height="15%" x="30%" y="65%" fill="#6b7280" rx="2"/>
  </svg>`;
}

// Create optimized versions of critical SVGs
function createOptimizedPlaceholders() {
  const publicPath = path.join(__dirname, '..', 'public');
  const placeholderPath = path.join(publicPath, 'placeholders');
  
  // Create placeholders directory if it doesn't exist
  if (!fs.existsSync(placeholderPath)) {
    fs.mkdirSync(placeholderPath);
  }

  const largeSVGs = [
    { name: 'p1.svg', size: { width: 400, height: 300 }, color: '#1f2937' },
    { name: 'p2.svg', size: { width: 400, height: 300 }, color: '#374151' },
    { name: 'p3.svg', size: { width: 400, height: 300 }, color: '#4b5563' },
    { name: 'p4.svg', size: { width: 400, height: 300 }, color: '#6b7280' },
    { name: 'grid.svg', size: { width: 600, height: 400 }, color: '#111827' },
    { name: 'bento1v3.svg', size: { width: 500, height: 400 }, color: '#1f2937' },
  ];

  console.log('🎨 Generating SVG placeholders...\n');

  largeSVGs.forEach(({ name, size, color }) => {
    const placeholderSVG = generatePlaceholderSVG(size, color);
    const placeholderName = name.replace('.svg', '-placeholder.svg');
    const placeholderFilePath = path.join(placeholderPath, placeholderName);
    
    fs.writeFileSync(placeholderFilePath, placeholderSVG);
    console.log(`✅ Created placeholder: ${placeholderName} (${placeholderSVG.length} bytes)`);
  });

  console.log('\n📝 Placeholders created in public/placeholders/');
}

// Update data/index.ts to include placeholder paths
function updateDataWithPlaceholders() {
  const dataPath = path.join(__dirname, '..', 'data', 'index.ts');
  let dataContent = fs.readFileSync(dataPath, 'utf8');

  // Add placeholder paths to gridItems and projects
  const placeholderMappings = {
    '/bento1v3.svg': '/placeholders/bento1v3-placeholder.svg',
    '/grid.svg': '/placeholders/grid-placeholder.svg',
    '/p1.svg': '/placeholders/p1-placeholder.svg',
    '/p2.svg': '/placeholders/p2-placeholder.svg',
    '/p3.svg': '/placeholders/p3-placeholder.svg',
    '/p4.svg': '/placeholders/p4-placeholder.svg',
  };

  // For now, we'll create a separate file with placeholder mappings
  const placeholderExport = `
// Placeholder mappings for progressive loading
export const imagePlaceholders = {
  '/bento1v3.svg': '/placeholders/bento1v3-placeholder.svg',
  '/grid.svg': '/placeholders/grid-placeholder.svg',
  '/p1.svg': '/placeholders/p1-placeholder.svg',
  '/p2.svg': '/placeholders/p2-placeholder.svg',
  '/p3.svg': '/placeholders/p3-placeholder.svg',
  '/p4.svg': '/placeholders/p4-placeholder.svg',
};
`;

  // Append to data file
  dataContent += placeholderExport;
  fs.writeFileSync(dataPath, dataContent);
  
  console.log('📝 Updated data/index.ts with placeholder mappings');
}

function createImageOptimizationComponent() {
  const componentCode = `'use client';
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
              alt={\`\${alt} placeholder\`}
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
              className={\`transition-opacity duration-500 \${isLoaded ? 'opacity-100' : 'opacity-0'}\`}
              onLoad={() => setIsLoaded(true)}
              quality={85}
            />
          )}
        </>
      )}
    </div>
  );
}`;

  fs.writeFileSync(
    path.join(__dirname, '..', 'components', 'SmartImage.tsx'),
    componentCode
  );
  console.log('📝 Created SmartImage component with progressive loading');
}

function main() {
  console.log('🚀 Creating Progressive Loading System\n');
  
  createOptimizedPlaceholders();
  updateDataWithPlaceholders();
  createImageOptimizationComponent();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Progressive loading system created!');
  console.log('\n📋 Next steps:');
  console.log('1. Replace Image components with SmartImage in critical sections');
  console.log('2. Test the progressive loading behavior');
  console.log('3. Monitor Core Web Vitals improvements');
  console.log('4. Run performance budget check');
}

main();