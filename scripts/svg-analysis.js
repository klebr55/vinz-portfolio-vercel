#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Critical SVGs that should be kept as SVG (small icons, logos)
const CRITICAL_SVGS = [
  'app.svg', 'next.svg', 're.svg', 'tail.svg', 'ts.svg', 'three.svg',
  'git.svg', 'dock.svg', 'cloud.svg', 'link.svg', 'arrow.svg'
];

// Large decorative SVGs that should be converted to WebP/PNG
const LARGE_DECORATIVE_SVGS = [
  'p1.svg', 'p2.svg', 'p3.svg', 'p4.svg',
  'grid.svg', 'bento1.svg', 'bento1v2.svg', 'bento1v3.svg',
  'b1.svg', 'b5.svg', 'bg-5v2.svg',
  'profile.svg', 'milanmoveis.svg',
  'bg_id3.svg', 'exp3.svg', 'gsap.svg'
];

function analyzeAndCategorize() {
  const publicPath = path.join(__dirname, '..', 'public');
  const files = fs.readdirSync(publicPath).filter(f => f.endsWith('.svg'));
  
  console.log('🔍 SVG Analysis & Optimization Plan\n');
  
  let totalCurrentSize = 0;
  let projectedSavings = 0;
  
  console.log('📂 Current SVG Files:');
  files.forEach(file => {
    const filePath = path.join(publicPath, file);
    const sizeKB = fs.statSync(filePath).size / 1024;
    totalCurrentSize += sizeKB;
    
    if (LARGE_DECORATIVE_SVGS.includes(file)) {
      const estimatedReduction = sizeKB * 0.85;
      projectedSavings += estimatedReduction;
      console.log(`🔄 ${file}: ${sizeKB.toFixed(1)}KB → Convert to WebP (~${(sizeKB - estimatedReduction).toFixed(1)}KB)`);
    } else if (CRITICAL_SVGS.includes(file)) {
      console.log(`✅ ${file}: ${sizeKB.toFixed(1)}KB → Keep as SVG (critical)`);
    } else {
      console.log(`⚡ ${file}: ${sizeKB.toFixed(1)}KB → Optimize SVG`);
    }
  });
  
  console.log(`\n📊 Current total SVG size: ${(totalCurrentSize / 1024).toFixed(1)}MB`);
  console.log(`💡 Projected savings: ${(projectedSavings / 1024).toFixed(1)}MB`);
  console.log(`🎯 New estimated size: ${((totalCurrentSize - projectedSavings) / 1024).toFixed(1)}MB`);
  
  return {
    totalCurrentSize,
    projectedSavings,
    largeFiles: LARGE_DECORATIVE_SVGS
  };
}

function main() {
  const analysis = analyzeAndCategorize();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Analysis Complete!');
  console.log(`Expected size reduction: ${(analysis.projectedSavings / 1024).toFixed(1)}MB`);
  
  if (analysis.projectedSavings > analysis.totalCurrentSize * 0.5) {
    console.log('\n✅ This optimization will significantly improve performance!');
  }
}

main();