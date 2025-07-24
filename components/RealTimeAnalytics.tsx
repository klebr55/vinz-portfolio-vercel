'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  visitors: number;
  pageViews: number;
  performance: {
    fcp: number;
    lcp: number;
    cls: string;
    fid: number;
  };
  projects: Array<{
    name: string;
    views: number;
  }>;
  timestamp: string;
}

export default function RealTimeAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-900/50 rounded-lg">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="loading-skeleton h-16 rounded-md"></div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-900/50 rounded-lg backdrop-blur-sm">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-400">{analytics.visitors}</div>
        <div className="text-sm text-gray-400">Visitors</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-400">{analytics.pageViews}</div>
        <div className="text-sm text-gray-400">Page Views</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-400">{analytics.performance.lcp}ms</div>
        <div className="text-sm text-gray-400">LCP</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400">{analytics.performance.cls}</div>
        <div className="text-sm text-gray-400">CLS</div>
      </div>
    </div>
  );
}
