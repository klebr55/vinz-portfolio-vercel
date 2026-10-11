import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { openBrowser, sleep } from './native-browser.mjs';

const phase=process.argv[2]||'before';
const output=resolve('docs/awwwards/evidence-narrative/process-rotato-polish');
const b=await openBrowser(output);
const report={phase,renderer:null,passes:[],errors:b.errors};
function instrument(){
  window.__polish={targets:[],paints:[],loads:[],live:0,peakLive:0,decoding:0,peakDecode:0};
  const blobs=new WeakMap(),bitmaps=new WeakMap();
  const original=fetch;
  window.fetch=async(...args)=>{
    const match=String(args[0]).match(/motion-(?:sdimt|runtime)\/frame_(\d+)\.webp/);
    if(!match)return original(...args);
    const index=Number(match[1]),load={index,start:performance.now()};window.__polish.loads.push(load);
    try {const response=await original(...args);load.status=response.status;load.fetched=performance.now();const blob=response.blob.bind(response);response.blob=async()=>{const value=await blob();blobs.set(value,index);return value;};return response;}
    catch(error){load.error=error.name;throw error;}
  };
  const create=createImageBitmap;
  window.createImageBitmap=async(source,...args)=>{
    const index=blobs.get(source);if(!index)return create(source,...args);
    const p=window.__polish;p.decoding++;p.peakDecode=Math.max(p.peakDecode,p.decoding);
    try{const bitmap=await create(source,...args);bitmaps.set(bitmap,index);p.live++;p.peakLive=Math.max(p.peakLive,p.live);
      const close=bitmap.close.bind(bitmap);let closed=false;bitmap.close=()=>{if(!closed){closed=true;p.live--;close();}};return bitmap;
    }finally{p.decoding--;}
  };
  window.__mediaState=()=>{
    const media=document.querySelector('[class*=sdimtRotatoMedia]');if(!media)return null;
    let f=media[Object.keys(media).find(k=>k.startsWith('__reactFiber'))];
    while(f){if(f.memoizedProps?.progress?.get){let hook=f.memoizedState,cache,allowed;while(hook){if(hook.memoizedState?.current?.stats)cache=hook.memoizedState.current;if(typeof hook.memoizedState?.current==='boolean')allowed=hook.memoizedState.current;hook=hook.next;}return{p:f.memoizedProps.progress.get(),stats:cache?.stats(),allowed};}f=f.return;}
  };
  const draw=CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage=function(source,...args){
    if(this.canvas.closest('[class*=sdimtRotatoMedia]')&&bitmaps.has(source)){
      const s=window.__mediaState();window.__polish.paints.push({at:performance.now(),index:bitmaps.get(source),target:s.stats.target,allowed:s.allowed,hidden:document.hidden});
    }return draw.call(this,source,...args);
  };
  let previous;
  setInterval(()=>{const s=window.__mediaState();if(s?.stats?.target!==previous){previous=s?.stats?.target;if(previous)window.__polish.targets.push({at:performance.now(),index:previous});}},8);
}
await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(${instrument.toString()})()`});
const visit=(locale,hash)=>b.visit(`http://localhost:3004/${locale}/awwwards-preview/ember${hash}`);
const move=async y=>{await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:180,y:200,deltaX:0,deltaY:1});await b.evaluate(`window.__lenis?.scrollTo(${y},{immediate:true,force:true});if(!window.__lenis)scrollTo(0,${y})`);await sleep(350);};
const dims=()=>b.evaluate(`(()=>{const box=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return{top:r.top+scrollY,height:r.height,y:r.y,bottom:r.bottom}};return{y:scrollY,nav:box('header'),stage:box('[class*=sdimtRotatoStage]'),nks:box('#nks'),process:box('#process'),articles:[...document.querySelectorAll('#process article')].map(e=>{const r=e.getBoundingClientRect();return{top:r.top+scrollY,height:r.height}}),visual:box('[class*=processVisual]')}})()`);
const wheel=async delta=>{await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:180,y:200,deltaX:0,deltaY:delta});await sleep(400);};
async function rotatoPass(record){
  const d=await dims();await move(d.stage.top-Math.max(100,d.nav.bottom+20));await sleep(600);
  await b.evaluate('window.__polish.targets=[];window.__polish.paints=[];window.__polish.loads=[]');
  if(record)await b.startRecording();
  for(const delta of [120,160,120,160,120,-120,-160,160,120,160,120,160])await wheel(delta);
  await sleep(700);
  const trace=await b.evaluate('({trace:window.__polish,state:window.__mediaState()})');
  assert.ok(trace.trace.paints.every(p=>p.index===p.target&&p.allowed&&!p.hidden));
  assert.equal(trace.state.stats.displayed,trace.state.stats.target);
  return {record,trace,...(record?{video:await b.stopRecording(`${phase}-${await b.evaluate('innerWidth')}-diagnostic-rotato.webm`)}:{})};
}
try{
  report.renderer=await b.evaluate(`(()=>{const g=document.createElement('canvas').getContext('webgl2');if(!g)return null;const e=g.getExtension('WEBGL_debug_renderer_info');const r=g.getParameter(e.UNMASKED_RENDERER_WEBGL);g.getExtension('WEBGL_lose_context')?.loseContext();return r})()`);
  for(const [width,height,locale]of[[1440,900,'pt-br'],[390,844,'en']]){
    await b.viewport(width,height,width<760);await visit(locale,'#sdimt');
    const run={width,height,locale,withoutCapture:await rotatoPass(false),withCapture:await rotatoPass(true),boundary:[]};
    const d=await dims();await move(d.nks.top-height*.55);
    for(let i=0;i<9;i++){
      await wheel(i===6?-160:160);
      run.boundary.push(await b.evaluate(`(()=>{const s=document.querySelector('#nks'),r=s.getBoundingClientRect(),image=s.querySelector('[class*=nksSticky]>img'),canvas=s.querySelector('canvas:not([class*=frameBuffer])');return{y:scrollY,nksTop:r.top,nksHeight:r.height,poster:!!image,canvas:!!canvas,sceneReady:s.dataset.sceneReady,canvasSize:canvas?[canvas.width,canvas.height]:null,bufferFrame:s.querySelector('[class*=frameBuffer]').dataset.frame}})()`));
      if(i===3&&phase==='before')await b.shot(`${width}-boundary-before.png`);
    }
    const p=await dims();await move(p.articles[0].top-height-Math.max(100,p.nav.bottom+20));await sleep(1200);
    run.processPrepared=await b.evaluate(`(()=>{const s=document.querySelector('#process');return{visible:s.getBoundingClientRect().top<innerHeight,canvas:!!s.querySelector('canvas'),ready:s.querySelector('[class*=processCanvas]')?.style.opacity==='1',waiting:!!s.querySelector('[class*=processWaiting]')}})()`);
    const start=Date.now();await b.click(width<760?'details summary':'header a[href="#process"]');if(width<760)await b.click('details a[href="#process"]');
    await b.until(`document.querySelector('#process [class*=processCanvas]')?.style.opacity==='1'`);
    run.processReadyAfterNavigationMs=Date.now()-start;
    if(phase==='before'&&width===1440){const a=(await dims()).articles;await move(a[2].top+a[2].height*.85-Math.max(100,p.nav.bottom+20));await b.shot('process-finish-before.png');}
    report.passes.push(run);console.log(width,report.renderer,run.processPrepared,run.processReadyAfterNavigationMs);
  }
  report.pass=true;
}catch(error){report.pass=false;report.failure=error.stack;process.exitCode=1;console.error(error.stack);}
finally{writeFileSync(`${output}/${phase}.json`,JSON.stringify(report));b.close();}
