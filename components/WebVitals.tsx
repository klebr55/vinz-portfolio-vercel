'use client';
import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface MetricData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

function sendToAnalytics(metric: MetricData) {
  // In a real app, you would send this to your analytics service
  console.log('📊 Web Vitals:', {
    name: metric.name,
    value: Math.round(metric.value),
    rating: metric.rating,
    id: metric.id,
  });
}

export default function WebVitals() {
  useEffect(() => {
    // Track Core Web Vitals
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // Replaces FID in web-vitals v3
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null; // This component doesn't render anything
}