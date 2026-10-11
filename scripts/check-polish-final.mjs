import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { openBrowser, sleep } from './native-browser.mjs';
import { resolveProcessFrame } from '../components/awwwards/identity/process-model.ts';
const output='docs/awwwards/evidence-narrative/process-rotato-polish';
const b=await openBrowser(output);
const report={samples:[],videos:[],checks:{},errors:b.errors};
const processScript=readFileSync('scripts/check-process-business.mjs','utf8');
const processInstrument=processScript.slice(processScript.indexOf('function instrument(){'),processScript.indexOf('function state(){'));
const processState=processScript.slice(processScript.indexOf('function state(){'),processScript.indexOf('const read='));
const mediaScript=readFileSync('scripts/check-process-rotato-polish.mjs','utf8');
const mediaInstrument=mediaScript.slice(mediaScript.indexOf('function instrument(){'),mediaScript.indexOf("await b.send('Page.addScript"));
await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{${processInstrument}\n instrument();\n${processState}\nwindow.__processState=state;})();\n(()=>{${mediaInstrument}\ninstrument();})();`});
const visit=(locale,hash)=>b.visit(`http://localhost:3004/${locale}/awwwards-preview/ember${hash}`);
const read=()=>b.evaluate('window.__processState()');
const move=async y=>{await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:180,y:200,deltaX:0,deltaY:1});await b.evaluate(`window.__lenis?window.__lenis.scrollTo(${y},{immediate:true,force:true}):scrollTo(0,${y})`);await sleep(400);};
const wheel=async delta=>{await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:180,y:200,deltaX:0,deltaY:delta});await sleep(delta===120?350:500);};
const sample=async name=>{const s=await read();const value={name,...s,frame:s.p===undefined?null:resolveProcessFrame(s.p)};report.samples.push(value);return value;};
const checkpoint=async(width,id)=>{if(width<760){await b.click('details summary');await b.click(`details a[href="#${id}"]`);}else await b.click(`a[href="#${id}"]`);await sleep(1300);};
try{
 report.renderer=await b.evaluate(`(()=>{const g=document.createElement('canvas').getContext('webgl2'),e=g.getExtension('WEBGL_debug_renderer_info'),r=g.getParameter(e.UNMASKED_RENDERER_WEBGL);g.getExtension('WEBGL_lose_context')?.loseContext();return r})()`);
 if(process.argv.includes('probe')){
  await b.viewport(1440,900);await visit('pt-br','#sdimt');
  const top=await b.evaluate(`document.querySelector('#nks').getBoundingClientRect().top+scrollY`);
  if(process.argv.includes('record'))await b.startRecording();
  if(process.argv.includes('pause')){await b.click('header button[aria-pressed]');await wheel(160);await b.click('header button[aria-pressed]');await sleep(500);}
  await move(top-100);await b.until(`document.querySelector('#nks').dataset.sceneReady==='true'`,8000);
  console.log('NKS instrumented probe PASS');if(process.argv.includes('record'))await b.stopRecording('probe.webm');b.close();process.exit(0);
 }
 for(const [width,height,locale,record]of[[1440,900,'pt-br',true],[390,844,'en',true],[1440,900,'en',false],[390,844,'pt-br',false]]){
  await b.viewport(width,height,width<760);await visit(locale,'#sdimt');
  const stage=await b.evaluate(`document.querySelector('[class*=sdimtRotatoStage]').getBoundingClientRect().top+scrollY-Math.max(100,document.querySelector('header').getBoundingClientRect().bottom+20)`);
  if(record){
   await move(stage);await sleep(500);if(!process.argv.includes('no-record'))await b.startRecording();
   for(let i=0;i<13;i++){await wheel(i%2?160:120);if(i===5){await b.click('header button[aria-pressed]');const before=await b.evaluate('window.__mediaState()');await wheel(160);const after=await b.evaluate('window.__mediaState()');assert.equal(after.p,before.p);assert.equal(after.stats.displayed,before.stats.displayed);await b.click('header button[aria-pressed]');await sleep(500);}if(i===8){await wheel(-120);await wheel(-160);}}
   const nksTop=await b.evaluate(`document.querySelector('#nks').getBoundingClientRect().top+scrollY`);
   let count=0;while(await b.evaluate('scrollY')<nksTop+180&&count++<35)await wheel(count%2?120:160);
   const arrival=await b.evaluate(`({ready:document.querySelector('#nks').dataset.sceneReady,poster:!!document.querySelector('#nks [class*=nksSticky]>img'),at:performance.now()})`);
   report.checks[`${width}-arrival`]=arrival;
   await b.until(`document.querySelector('#nks').dataset.sceneReady==='true'`,3000);
   report.checks[`${width}-arrival`].settledAt=await b.evaluate('performance.now()');
   for(const delta of [-120,-160,160,120,160])await wheel(delta);
   await checkpoint(width,'process');const entry=await sample(`${width}-checkpoint`);assert.ok(entry.p<.01);assert.equal(entry.ready,true);
   await move(entry.anchors[0]);
   for(let i=0;i<25;i++){await wheel(i%2?160:120);if(i===9){await b.click('header button[aria-pressed]');const frozen=await read();await wheel(160);assert.equal((await read()).p,frozen.p);await b.click('header button[aria-pressed]');await sleep(500);}if(i===14){await wheel(-120);await wheel(-160);}}
   await b.key('PageDown');await b.key('PageUp');
   if(!process.argv.includes('no-record'))report.videos.push({width,height,locale,...await b.stopRecording(width===1440?'desktop.webm':'mobile.webm')});
  }else await checkpoint(width,'process');
  const s=await read();assert.equal(s.overflow,false);assert.ok(s.span/height>=3);
  for(const [name,stageId,local]of[['outline',1,.28],['construction',2,.8],['finish',3,.85]]){
   await move(s.anchors[stageId-1]+local*(s.anchors[stageId]-s.anchors[stageId-1]));const value=await sample(`${width}-${locale}-${name}`);
   assert.ok(Math.abs(value.p-(stageId-1+local)/3)<.005);assert.equal(value.paint.wires.length,19);
   assert.equal(value.frame.sceneComplete,stageId===3);
   if(stageId<3)for(const index of [13,14,15,16])assert.equal(value.paint.wires[index].dashSize,0);
   else assert.ok(value.paint.fills.every(f=>f.opacity>.999));
   if(width===1440&&locale==='pt-br')await b.shot(`process-${name}.png`);
  }
  assert.equal((await read()).runtime.active,1);
 }
 // Sharpness comparison at the same CSS/backing size, with the original crop.
 await b.viewport(1440,900);await visit('pt-br','#sdimt');await b.until(`window.__mediaState()?.stats?.displayed===241`);
 const clip=await b.evaluate(`(()=>{const r=document.querySelector('[class*=sdimtRotatoMedia]').getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()`);
 let shot=await b.send('Page.captureScreenshot',{format:'png',clip});writeFileSync(`${output}/rotato-runtime-detail.png`,Buffer.from(shot.data,'base64'));
 await b.evaluate(`(async()=>{const image=new Image();image.src='/awwwards/sdimt/motion-sdimt/frame_000241.webp';await image.decode();const c=document.querySelector('[class*=sdimtRotatoCanvas]'),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(image,1000,0,1600,1620,0,0,c.width,c.height);image.src='';})()`);
 shot=await b.send('Page.captureScreenshot',{format:'png',clip});writeFileSync(`${output}/rotato-original-detail.png`,Buffer.from(shot.data,'base64'));
 // Changed scene lifecycle and existing static modes.
 await checkpoint(1440,'process');const a=(await read()).anchors;await move(a[1]+100);
 const tab=await b.send('Target.createTarget',{url:'about:blank'});await b.send('Target.activateTarget',{targetId:tab.targetId});await sleep(300);const hidden=await read();await sleep(500);assert.equal((await read()).paint.at,hidden.paint.at);report.checks.hidden=true;await b.send('Target.closeTarget',{targetId:tab.targetId});await b.send('Page.bringToFront');await sleep(500);
 await b.evaluate(`document.querySelector('#process canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()`);await sleep(400);assert.equal((await read()).fallback,true);report.checks.contextLoss=true;
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await visit('en','#process');const reduced=await read();assert.equal(reduced.canvas,false);assert.equal(reduced.fallback,true);assert.equal(await b.evaluate(`!!document.querySelector('[class*=sdimtRotatoCanvas]')`),false);report.checks.reduced=true;await b.send('Emulation.setEmulatedMedia',{features:[]});
 await b.send('Emulation.setScriptExecutionDisabled',{value:true});await visit('pt-br','#process');assert.equal(await b.evaluate(`document.querySelector('#process noscript img').complete&&document.querySelectorAll('#process article').length===3`),true);report.checks.nojs=true;await b.send('Emulation.setScriptExecutionDisabled',{value:false});
 await visit('pt-br','#process');await checkpoint(1440,'contact');assert.equal(await b.evaluate(`!!document.activeElement.closest('#contact')`),true);report.checks.checkpointFocus=true;
 report.pass=true;console.log('Final polish PASS',report.renderer,report.videos.map(v=>({name:v.name,seconds:v.seconds,frames:v.frames})));
}catch(error){report.pass=false;report.failure=error.stack;report.diagnostic=await b.evaluate(`(()=>{const s=document.querySelector('#nks');let f=s[Object.keys(s).find(k=>k.startsWith('__reactFiber'))],hooks=[];while(f&&!f.memoizedProps?.sample)f=f.return;let h=f?.memoizedState;while(h){const v=h.memoizedState;hooks.push(typeof v==='object'?typeof v?.current==='number'?v.current:'object':v);h=h.next;}return{y:scrollY,ready:s.dataset.sceneReady,paused:f?.memoizedProps.paused,hooks,canvas:!!s.querySelector('canvas:not([class*=frameBuffer])'),dom:s.querySelector('[class*=nksSticky]').innerHTML.slice(0,1200),requests:performance.getEntriesByType('resource').filter(e=>/glb|nks-editorial-poster/.test(e.name)).map(e=>({name:e.name,start:e.startTime,duration:e.duration,size:e.transferSize})),body:document.body.innerText.slice(0,100)}})()`);report.network=b.requests.filter(u=>/glb|StoryScene|chunks/.test(u));process.exitCode=1;console.error(error.stack,JSON.stringify(report.diagnostic));await b.shot('final-diagnostic.png');}
finally{writeFileSync(`${output}/final.json`,JSON.stringify(report));b.close();}
