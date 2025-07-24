#!/usr/bin/env node

const { optimize } = require('svgo');
const fs = require('fs');
const path = require('path');

// SVGO configuration for maximum compression while preserving quality
const svgoConfig = {
  plugins: [
    'preset-default',
    {
      name: 'removeViewBox',
      active: false, // Keep viewBox for responsive scaling
    },
    {
      name: 'removeDimensions',
      active: true, // Remove width/height to make responsive
    },
    {
      name: 'cleanupNumericValues',
      params: {
        floatPrecision: 2,
      },
    },
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 2,
      },
    },
    {
      name: 'convertTransform',
      params: {
        floatPrecision: 2,
      },
    },
    // Remove unnecessary metadata
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'mergeStyles',
    'inlineStyles',
    'minifyStyles',
    'cleanupIds',
    'removeUselessDefs',
    'cleanupListOfValues',
    'cleanupNumericValues',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUnusedNS',
    'convertShapeToPath',
    'mergePaths',
    'convertStyleToAttrs',
    'removeEmptyAttrs',
    'removeEmptyText',
    'removeEmptyContainers',
    'removeUnusedNS',
  ],
};

async function optimizeSVG(filePath) {
  try {
    const svgString = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(svgString, 'utf8');
    
    const result = optimize(svgString, {
      path: filePath,
      ...svgoConfig,
    });
    
    if (result.error) {
      console.error(`Error optimizing ${filePath}:`, result.error);
      return;
    }
    
    const optimizedSize = Buffer.byteLength(result.data, 'utf8');
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    // Only save if we achieved significant compression
    if (optimizedSize < originalSize) {
      fs.writeFileSync(filePath, result.data);
      console.log(`✅ ${path.basename(filePath)}: ${(originalSize/1024).toFixed(1)}KB → ${(optimizedSize/1024).toFixed(1)}KB (${savings}% smaller)`);
    } else {
      console.log(`⚠️  ${path.basename(filePath)}: No significant optimization possible`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

async function optimizeDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  const svgFiles = files.filter(file => file.endsWith('.svg'));
  
  console.log(`Found ${svgFiles.length} SVG files to optimize...\n`);
  
  // Focus on the largest files first
  const largeSVGs = [
    'p1.svg', 'p3.svg', 'grid.svg', 'bg-5v2.svg', 'b1.svg', 
    'bento1v3.svg', 'p4.svg', 'p2.svg', 'bg_id3.svg', 'profile.svg',
    'bento1.svg', 'milanmoveis.svg', 'b5.svg'
  ];
  
  // Optimize large files first
  for (const fileName of largeSVGs) {
    if (svgFiles.includes(fileName)) {
      const filePath = path.join(dirPath, fileName);
      await optimizeSVG(filePath);
    }
  }
  
  // Then optimize remaining files
  const remainingFiles = svgFiles.filter(file => !largeSVGs.includes(file));
  for (const fileName of remainingFiles) {
    const filePath = path.join(dirPath, fileName);
    await optimizeSVG(filePath);
  }
  
  console.log('\n✨ SVG optimization complete!');
}

// Run the optimization
const publicDir = path.join(__dirname, '..', 'public');
optimizeDirectory(publicDir);