'use client'

export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('data:') || src.startsWith('http')) {
    return src;
  }
  
  return `${src}?w=${width}&q=${quality || 75}`;
}