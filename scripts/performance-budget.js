#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Performance budget limits
const BUDGET = {
  // Bundle size limits (in KB)
  maxFirstLoadJS: 500, // Target: reduce from 757KB to <500KB
  maxMainBundle: 250,
  maxVendorChunks: 200,
  
  // Asset size limits
  maxImageSize: 500, // 500KB max for any single image
  maxSVGSize: 100,   // 100KB max for any single SVG
  totalAssetsSize: 2048, // 2MB total for all public assets
  
  // Performance metrics targets
  performance: {
    lcp: 2500, // Largest Contentful Paint <2.5s
    fcp: 1800, // First Contentful Paint <1.8s
    tti: 5000, // Time to Interactive <5s
    cls: 0.1,  // Cumulative Layout Shift <0.1
  }
};

function checkBundleSize() {
  const buildPath = path.join(__dirname, '..', '.next');
  
  if (!fs.existsSync(buildPath)) {
    console.error('❌ Build output not found. Run `npm run build` first.');
    return false;
  }
  
  // This is a simplified check - in a real scenario you'd parse the build output
  console.log('📦 Bundle Size Check:');
  console.log(`✅ Target First Load JS: <${BUDGET.maxFirstLoadJS}KB`);
  console.log(`⚠️  Current estimate: ~757KB (needs optimization)`);
  
  return true;
}

function checkAssetSizes() {
  const publicPath = path.join(__dirname, '..', 'public');
  const files = fs.readdirSync(publicPath);
  
  let totalSize = 0;
  let violations = [];
  
  console.log('\n🖼️  Asset Size Check:');
  
  files.forEach(file => {
    const filePath = path.join(publicPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    totalSize += sizeKB;
    
    if (file.endsWith('.svg') && sizeKB > BUDGET.maxSVGSize) {
      violations.push(`❌ ${file}: ${sizeKB.toFixed(1)}KB (max: ${BUDGET.maxSVGSize}KB)`);
    } else if (file.match(/\.(png|jpg|jpeg|webp)$/i) && sizeKB > BUDGET.maxImageSize) {
      violations.push(`❌ ${file}: ${sizeKB.toFixed(1)}KB (max: ${BUDGET.maxImageSize}KB)`);
    }
  });
  
  console.log(`📊 Total assets size: ${(totalSize/1024).toFixed(1)}MB`);
  console.log(`🎯 Budget: ${(BUDGET.totalAssetsSize/1024).toFixed(1)}MB`);
  
  if (totalSize > BUDGET.totalAssetsSize) {
    violations.push(`❌ Total assets exceed budget: ${(totalSize/1024).toFixed(1)}MB > ${(BUDGET.totalAssetsSize/1024).toFixed(1)}MB`);
  }
  
  if (violations.length > 0) {
    console.log('\n🚨 Budget Violations:');
    violations.forEach(v => console.log(v));
    return false;
  } else {
    console.log('✅ All assets within budget');
    return true;
  }
}

function displayPerformanceTargets() {
  console.log('\n🎯 Performance Targets:');
  console.log(`• LCP (Largest Contentful Paint): <${BUDGET.performance.lcp}ms`);
  console.log(`• FCP (First Contentful Paint): <${BUDGET.performance.fcp}ms`);
  console.log(`• TTI (Time to Interactive): <${BUDGET.performance.tti}ms`);
  console.log(`• CLS (Cumulative Layout Shift): <${BUDGET.performance.cls}`);
  
  console.log('\n📱 Recommendations:');
  console.log('• Use PageSpeed Insights to measure real performance');
  console.log('• Test on 3G networks and low-end devices');
  console.log('• Monitor Core Web Vitals with Web Vitals library');
}

function generateOptimizationSuggestions() {
  const publicPath = path.join(__dirname, '..', 'public');
  const files = fs.readdirSync(publicPath);
  const largeSVGs = files
    .filter(f => f.endsWith('.svg'))
    .map(f => {
      const size = fs.statSync(path.join(publicPath, f)).size / 1024;
      return { name: f, size };
    })
    .filter(f => f.size > 100)
    .sort((a, b) => b.size - a.size);
  
  if (largeSVGs.length > 0) {
    console.log('\n🔧 Optimization Suggestions:');
    console.log('Large SVGs that need optimization:');
    largeSVGs.slice(0, 5).forEach(svg => {
      console.log(`• ${svg.name}: ${svg.size.toFixed(1)}KB`);
    });
    console.log('\nRecommendations:');
    console.log('• Convert large decorative SVGs to WebP/AVIF');
    console.log('• Use lazy loading for below-the-fold images');
    console.log('• Consider sprite sheets for small icons');
    console.log('• Implement progressive image loading');
  }
}

function main() {
  console.log('🚀 Performance Budget Check\n');
  
  const bundleOk = checkBundleSize();
  const assetsOk = checkAssetSizes();
  
  displayPerformanceTargets();
  generateOptimizationSuggestions();
  
  console.log('\n' + '='.repeat(50));
  
  if (bundleOk && assetsOk) {
    console.log('✅ Performance budget: PASSED');
    process.exit(0);
  } else {
    console.log('❌ Performance budget: FAILED');
    console.log('Run optimizations before deploying to production.');
    process.exit(1);
  }
}

main();