import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const output='public/awwwards/sdimt/motion-runtime';
await mkdir(output,{recursive:true});
const manifest={source:'motion-sdimt/frame_000001.webp–frame_000241.webp',crop:{left:1000,top:0,width:1600,height:1620},width:1200,height:1215,quality:95,alphaQuality:100,effort:4,kernel:'lanczos3',frames:[]};
const unique=new Map();let cursor=0;
async function worker(){while(cursor<241){const index=++cursor;
 const name=`frame_${String(index).padStart(6,'0')}.webp`;
 const source=await readFile(`public/awwwards/sdimt/motion-sdimt/${name}`);
 const sourceSha256=createHash('sha256').update(source).digest('hex');
 if(!unique.has(sourceSha256))unique.set(sourceSha256,sharp(source).extract(manifest.crop).resize(1200,1215,{kernel:'lanczos3'}).webp({quality:95,alphaQuality:100,effort:4}).toBuffer());
 const derived=await unique.get(sourceSha256);
 await writeFile(`${output}/${name}`,derived);
 manifest.frames.push({index,sourceSha256,derivedSha256:createHash('sha256').update(derived).digest('hex'),bytes:derived.length});
}}
await Promise.all(Array.from({length:4},worker));manifest.frames.sort((a,b)=>a.index-b.index);
await writeFile(`${output}/manifest.json`,JSON.stringify(manifest));
console.log('Derived 241 RGBA frames; encoded bytes',manifest.frames.reduce((sum,f)=>sum+f.bytes,0));
