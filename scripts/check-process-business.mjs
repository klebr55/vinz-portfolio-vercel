import assert from 'node:assert/strict';
import { writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { openBrowser, sleep } from './native-browser.mjs';
import { resolveProcessFrame } from '../components/awwwards/identity/process-model.ts';
const option=(name,fallback)=>{const i=process.argv.indexOf(name);return i<0?fallback:process.argv[i+1];};
const origin=option('--origin','http://localhost:3004');
const output=resolve(option('--output','docs/awwwards/evidence-narrative/process-business'));
const mode=option('--mode','matrix');
const sceneChunk=readdirSync('.next/static/chunks').find(file=>file.endsWith('.js')&&readFileSync(join('.next/static/chunks',file),'utf8').includes('/awwwards/process/code.svg'));
if(!sceneChunk)throw Error('Process production chunk missing');
const b=await openBrowser(output);
const report={origin,mode,method:'Native Chrome CDP; software WebGL via ANGLE/D3D11 WARP; trusted wheel/key/touch. No physical GPU fluency claim.',samples:[],checks:{},errors:b.errors};
function instrument(){
 let lenis;window.__runtimeProbe={active:0,maxPerTick:0};
 Object.defineProperty(Window.prototype,'__lenis',{configurable:true,get(){return lenis;},set(instance){if(!instance||lenis===instance)return;lenis=instance;window.__runtimeProbe.active++;const raf=instance.raf.bind(instance);let last,writes=0;instance.raf=t=>{writes=t===last?writes+1:1;last=t;window.__runtimeProbe.maxPerTick=Math.max(writes,window.__runtimeProbe.maxPerTick);return raf(t);};const destroy=instance.destroy.bind(instance);instance.destroy=()=>{window.__runtimeProbe.active--;if(lenis===instance)lenis=null;return destroy();};}});
 const locations=new WeakMap(),programs=new WeakMap(),current=new WeakMap();window.__processPaint={wires:[],fills:[]};
 for(const Type of [WebGLRenderingContext,WebGL2RenderingContext]){
  const get=Type.prototype.getUniformLocation;Type.prototype.getUniformLocation=function(program,name){const result=get.call(this,program,name);if(result)locations.set(result,{program,name});return result;};
  for(const method of ['uniform1f','uniform3f']){const old=Type.prototype[method];Type.prototype[method]=function(location,...values){const entry=locations.get(location);if(entry){const state=programs.get(entry.program)||{};state[entry.name]=values.length===1?values[0]:values;programs.set(entry.program,state);}return old.call(this,location,...values);};}
  const use=Type.prototype.useProgram;Type.prototype.useProgram=function(program){current.set(this,program);return use.call(this,program);};
  const clear=Type.prototype.clear;Type.prototype.clear=function(...args){if(this.canvas.closest('#process'))window.__processPaint={wires:[],fills:[],at:performance.now()};return clear.apply(this,args);};
  for(const name of ['drawArrays','drawElements']){const old=Type.prototype[name];Type.prototype[name]=function(mode,...args){if(this.canvas.closest('#process')){const state=programs.get(current.get(this));if(state&&mode===this.LINES)window.__processPaint.wires.push({...state});if(state&&mode===this.TRIANGLES&&state.opacity!==undefined)window.__processPaint.fills.push({...state});}return old.call(this,mode,...args);};}
 }
}
function state(){
 const section=document.querySelector('#process'),visual=section.querySelector('[class*=processVisual]'),canvas=section.querySelector('canvas');
 const rect=el=>{const r=el.getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height};};
 let p;
 for(let node=canvas?.parentElement;node&&p===undefined;node=node.parentElement){const property=Object.keys(node).find(k=>k.startsWith('__reactFiber'));for(let fiber=node[property];fiber;fiber=fiber.return){if(typeof fiber.memoizedProps?.progress?.get==='function'){p=fiber.memoizedProps.progress.get();break;}}}
 const articles=[...section.querySelectorAll('article')];
 const nav=document.querySelector('header').getBoundingClientRect();
 const top=Math.max(100,nav.bottom+20),mobile=innerWidth<=760,pinned=section.dataset.processPin==='true';
 const readingPoint=top+(mobile&&pinned?visual.offsetHeight+24:0);
 const anchors=articles.map(el=>el.getBoundingClientRect().top+scrollY-readingPoint);anchors.push(anchors[2]+articles[2].offsetHeight);
 const fallback=section.querySelector('img');
 return {y:scrollY,p,anchors,span:anchors[3]-anchors[0],viewport:innerHeight,width:innerWidth,pinned,visual:rect(visual),articles:articles.map(el=>({stage:el.dataset.processStage,active:el.dataset.active,title:el.querySelector('h3').textContent,outcome:rect(el.querySelector('dl > div:last-child')),...rect(el)})),ready:section.querySelector('[class*=processCanvas]')?.style.opacity==='1',fallback:!fallback.hidden,loaded:fallback.complete&&fallback.naturalWidth>0,canvas:!!canvas,paint:window.__processPaint,overflow:document.documentElement.scrollWidth>innerWidth,runtime:window.__runtimeProbe};
}
const read=()=>b.evaluate(`(${state.toString()})()`);
const at=async y=>{await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:200,y:200,deltaX:0,deltaY:1});await b.evaluate(`window.__lenis?window.__lenis.scrollTo(${y},{immediate:true,force:true}):window.scrollTo(0,${y})`);await sleep(450);};
const sample=async label=>{const s=await read();report.samples.push({label,...s,applied:s.p===undefined?null:resolveProcessFrame(s.p)});return s;};
const visit=async(locale='pt-br',hash='#process')=>{await b.visit(`${origin}/${locale}/awwwards-preview/ember${hash}`);};
try{
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(${instrument.toString()})()`});
 await b.viewport(1440,900);await visit();await b.until(`document.querySelector('#process [class*=processCanvas]')?.style.opacity==='1'`,25000);
 const initial=await sample('checkpoint');assert.equal(initial.articles.length,3);assert.ok(initial.p<.01,'checkpoint must open the beginning');assert.equal(initial.fallback,false);
 if(mode==='probe'){await b.shot('probe.png');}
 else if(mode==='mobile'){
  await b.viewport(390,844,true);await visit();await b.until(`document.querySelector('#process [class*=processCanvas]')?.style.opacity==='1'`);const a=(await read()).anchors;await at(a[0]);await b.startRecording();
  for(let i=0;i<25;i++){await b.wheel(i%2?160:120);if(i===10){await b.click('header button[aria-pressed]');const frozen=await read();await b.wheel(240);assert.equal((await read()).p,frozen.p);await b.click('header button[aria-pressed]');await b.wheel(-480);}await sample(`mobile-wheel-${i}`);}
  await b.key('PageDown');await b.key('PageUp');report.video=await b.stopRecording('mobile-wheel-pause-reverse.mp4');
 }
 else {
  let a;
  if(mode==='matrix'){
  for(const [width,height,locale] of [[1440,900,'pt-br'],[1440,900,'en'],[390,844,'pt-br'],[360,800,'en'],[844,390,'en']]){
   await b.viewport(width,height,width<=760);await visit(locale);await b.until(`document.querySelector('#process [class*=processCanvas]')?.style.opacity==='1'`);
   const start=await read(),a=start.anchors;const prefix=`${width}x${height}-${locale}`;
   assert.ok(start.span/height>=3);assert.equal(start.overflow,false);
   for(const [label,stage,local] of [['entry',1,0],['discovery-end',1,.98],['development-end',2,.98],['finalization-start',3,.01],['complete',3,.81],['reading',3,.95]]){
    await at(a[stage-1]+local*(a[stage]-a[stage-1]));const s=await sample(`${prefix}-${label}`);assert.ok(Math.abs(s.p-(stage-1+local)/3)<.006);const frame=resolveProcessFrame(s.p);
    if(stage<3||local<.8)assert.equal(frame.sceneComplete,false);else assert.equal(frame.sceneComplete,true);
    assert.equal(s.paint.wires.length,19,'19 real wire draw calls must reach WebGL');
    if(stage<3)for(const i of [13,14,15,16])assert.ok(s.paint.wires[i].dashSize<1e-6,'rendered code must remain absent');
    if(label==='complete'){assert.ok(s.paint.fills.every(f=>f.opacity>.999),'material reached real draw calls');assert.ok(s.articles[2].outcome.bottom>100&&s.articles[2].outcome.top<height,'final outcome must still be in reading');}
    await b.shot(`${prefix}-${label}.png`);
   }
   report.checks[prefix]={span:start.span,viewports:start.span/height,drawing:(a[2]+.65*(a[3]-a[2])-a[0]),reading:.2*(a[3]-a[2]),pinned:start.pinned};
  }
  await b.viewport(1440,900);await visit();a=(await read()).anchors;
  await at(a[0]+.55*(a[1]-a[0]));await b.click('header button[aria-pressed]');const paused=await sample('pause-before');await b.wheel(640);const hold=await sample('pause-after-scroll');assert.equal(hold.p,paused.p);assert.equal(hold.paint.at,paused.paint.at);await b.click('header button[aria-pressed]');await sleep(400);const resumed=await sample('resume');assert.ok(resumed.p>hold.p);
  await at(a[0]);await b.startRecording();
  for(let i=0;i<25;i++){await b.wheel(i%2?160:120);if(i===10){await b.wheel(-320);await sleep(400);}await sample(`trusted-wheel-${i}`);}
  await b.key('PageDown');await b.key('PageUp');report.video=await b.stopRecording('desktop-wheel-pause-reverse.mp4');
  await b.viewport(390,844,true);await visit();a=(await read()).anchors;await at(a[0]);await b.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:700}]});for(let y=660;y>=260;y-=50){await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y}]});await sleep(40);}await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(600);assert.ok((await sample('touch-forward')).p>0);
  await b.send('Emulation.setTouchEmulationEnabled',{enabled:false});
  await b.viewport(844,390);await sleep(700);const resized=await sample('resize-landscape');assert.equal(resized.pinned,false);assert.equal(resized.overflow,false);
  await b.viewport(1440,900);await visit();a=(await read()).anchors;await at(a[1]+200);
  const tab=await b.send('Target.createTarget',{url:'about:blank'});await b.send('Target.activateTarget',{targetId:tab.targetId});await sleep(300);const hidden=await sample('hidden');await sleep(400);assert.equal((await read()).paint.at,hidden.paint.at);await b.send('Target.closeTarget',{targetId:tab.targetId});await b.send('Page.bringToFront');await sleep(400);await sample('visible-return');
  }
  await b.evaluate(`document.querySelector('#process canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()`);await sleep(400);const lost=await sample('context-lost');assert.equal(lost.fallback,true);assert.equal(lost.loaded,true);await b.shot('context-lost.png');
  const unavailable=await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'&&new Error().stack.includes(${JSON.stringify(sceneChunk)})?null:original.call(this,type,...args);};`});await visit();const unsupported=await sample('webgl-unavailable');assert.equal(unsupported.fallback,true);assert.equal(unsupported.loaded,true);await b.send('Page.removeScriptToEvaluateOnNewDocument',{identifier:unavailable.identifier});
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await visit('en');const reduced=await sample('reduced');assert.equal(reduced.canvas,false);assert.equal(reduced.fallback,true);await b.shot('reduced.png');await b.send('Emulation.setEmulatedMedia',{features:[]});
  await b.send('Emulation.setScriptExecutionDisabled',{value:true});await visit();const nojs=await b.evaluate(`(()=>{const p=document.querySelector('#process');return{articles:p.querySelectorAll('article').length,noscript:p.querySelector('noscript img')?.complete,overflow:document.documentElement.scrollWidth>innerWidth}})()`);assert.equal(nojs.articles,3);assert.equal(nojs.noscript,true);assert.equal(nojs.overflow,false);report.checks.nojs=nojs;await b.shot('no-js.png');await b.send('Emulation.setScriptExecutionDisabled',{value:false});
  await b.send('Fetch.enable',{patterns:[{urlPattern:'*awwwards/process/code.svg',requestStage:'Request'}]});let assetMode='slow';b.on('Fetch.requestPaused',async({requestId})=>{if(assetMode==='slow'){await sleep(2500);await b.send('Fetch.continueRequest',{requestId});}else await b.send('Fetch.failRequest',{requestId,errorReason:'Failed'});});
  await visit();const cold=await sample('slow-cold');assert.equal(cold.fallback,false);await b.shot('slow-cold.png');await b.until(`document.querySelector('#process [class*=processCanvas]')?.style.opacity==='1'`);await sample('slow-ready');assetMode='fail';await b.send('Network.setCacheDisabled',{cacheDisabled:true});await visit();await sleep(500);const failed=await sample('svg-failed');assert.equal(failed.fallback,true);await b.send('Fetch.disable');
  await visit();await b.click('header a[href="#intro"]');await b.until('scrollY<10',6000);await b.shot('hero-smoke.png');assert.equal((await read()).runtime.active,1);await b.click('a[href="#nks"]');await sleep(1500);await b.shot('nks-smoke.png');await b.click('header a[href="#contact"]');await sleep(1500);report.checks.contact=await b.evaluate(`document.activeElement.closest('#contact')!==null`);assert.equal(report.checks.contact,true);
 }
 report.pass=true;
}catch(error){report.pass=false;report.failure=error.stack;try{report.diagnostic=await read();}catch{}try{await b.shot('diagnostic.png');report.page=await b.evaluate('({url:location.href,text:document.body.innerText.slice(0,300)})');}catch{}process.exitCode=1;console.error(error.stack);}
finally{writeFileSync(join(output,mode==='matrix'?'report.json':`${mode}.json`),JSON.stringify(report,null,2));b.close();}
