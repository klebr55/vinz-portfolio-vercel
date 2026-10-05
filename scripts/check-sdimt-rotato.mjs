import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { openBrowser, sleep } from './native-browser.mjs';
const output=resolve('docs/awwwards/evidence-narrative/sdimt-rotato');
const mode=process.argv[2]||'probe';
const b=await openBrowser(output);
const report={mode,method:'Native Chrome CDP, ANGLE/D3D11 WARP software renderer. Actual Canvas paints and cache reservations. No physical GPU performance claim.',samples:[],checks:{},errors:b.errors};
function instrument(){
  const blobs=new WeakMap(),bitmaps=new WeakMap();
  window.__rotato={requests:[],paints:[],live:0,decoding:0,peakLive:0,peakDecode:0,delay:0};
  const fetchOriginal=window.fetch;
  window.fetch=async(...args)=>{
    const match=String(args[0]).match(/motion-sdimt\/frame_(\d+)\.webp/);
    if(!match)return fetchOriginal(...args);
    const index=Number(match[1]),entry={index,start:performance.now()};window.__rotato.requests.push(entry);
    try{const response=await fetchOriginal(...args);entry.status=response.status;const blob=response.blob.bind(response);response.blob=async()=>{const value=await blob();blobs.set(value,index);return value;};return response;}
    catch(error){entry.error=error.name;throw error;}
  };
  const create=window.createImageBitmap;
  window.createImageBitmap=async(source,...args)=>{
    const index=blobs.get(source);if(!index)return create(source,...args);
    const p=window.__rotato;p.decoding++;p.peakDecode=Math.max(p.peakDecode,p.decoding);
    try{if(p.delay)await new Promise(resolve=>setTimeout(resolve,p.delay));const bitmap=await create(source,...args);bitmaps.set(bitmap,index);p.live++;p.peakLive=Math.max(p.peakLive,p.live);
      const close=bitmap.close.bind(bitmap);let closed=false;bitmap.close=()=>{if(!closed){closed=true;p.live--;close();}};return bitmap;
    }finally{p.decoding--;}
  };
  const draw=CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage=function(source,...args){
    if(this.canvas.closest('[class*=sdimtRotatoMedia]')&&bitmaps.has(source)) {
      let fiber=this.canvas[Object.keys(this.canvas).find(key=>key.startsWith('__reactFiber'))];
      let top=fiber;while(top?.return)top=top.return;if(top?.stateNode?.current&&top!==top.stateNode.current)fiber=fiber.alternate??fiber;
      while(fiber&&!fiber.memoizedProps?.progress?.get)fiber=fiber.return;
      const props=fiber?.memoizedProps;let hook=fiber?.memoizedState,allowed;while(hook){if(typeof hook.memoizedState?.current==='boolean')allowed=hook.memoizedState.current;hook=hook.next;}
      window.__rotato.paints.push({index:bitmaps.get(source),target:1+Math.round(Math.max(0,Math.min(1,props.progress.get()))*240),allowed,hidden:document.hidden,at:performance.now()});
    }
    return draw.call(this,source,...args);
  };
}
await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(${instrument.toString()})()`});
const visit=(locale='pt-br',hash='#sdimt')=>b.visit(`http://localhost:3004/${locale}/awwwards-preview/ember${hash}`);
const state=()=>b.evaluate(`(()=>{
  const section=document.querySelector('#sdimt'),media=section.querySelector('[class*=sdimtRotatoMedia]'),stage=section.querySelector('[class*=sdimtRotatoStage]'),visual=section.querySelector('[class*=sdimtRotatoPresentation]');
  const rect=el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}};
  let fiber=media[Object.keys(media).find(key=>key.startsWith('__reactFiber'))],stats,p;
  while(fiber){if(fiber.memoizedProps?.progress?.get){p=fiber.memoizedProps.progress.get();let hook=fiber.memoizedState;while(hook){if(hook.memoizedState?.current?.stats)stats=hook.memoizedState.current.stats();hook=hook.next;}break;}fiber=fiber.return;}
  return{y:scrollY,width:innerWidth,height:innerHeight,static:section.dataset.rotatoStatic==='true',p,stats,media:rect(media),visual:rect(visual),title:rect(section.querySelector('h2')),caption:rect(section.querySelector('[class*=mediaCaption]')),editorial:rect(section.querySelector('[class*=sdimtEditorial]')),stageTop:stage.getBoundingClientRect().top+scrollY,markerTop:document.querySelector('#sdimt-rotato-read').getBoundingClientRect().top+scrollY,nav:rect(document.querySelector('header')),poster:media.querySelector('img').complete,canvas:!!media.querySelector('canvas'),presented:media.dataset.presented==='true',planeOpacity:getComputedStyle(document.querySelector('[class*=sdimtPlane]')).opacity,overflow:document.documentElement.scrollWidth>innerWidth,probe:window.__rotato};
})()`);
const sample=async name=>{const s=await state();report.samples.push({name,...s,probe:{requests:s.probe.requests.length,paints:s.probe.paints.length,lastPaint:s.probe.paints.at(-1),live:s.probe.live,decoding:s.probe.decoding,peakLive:s.probe.peakLive,peakDecode:s.probe.peakDecode}});console.log(name,JSON.stringify({y:s.y,p:s.p,stats:s.stats,static:s.static}));return s;};
const at=async progress=>{
  await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:200,y:200,deltaX:0,deltaY:1});
  const s=await state();const top=Math.max(100,s.nav.bottom+20);
  await b.evaluate(`window.__lenis.scrollTo(${s.stageTop-top+progress*s.height*1.5},{immediate:true,force:true})`);await sleep(500);
};
try{
  await b.viewport(1440,900);await visit();await sleep(1200);
  let current=await sample('desktop-checkpoint');await b.shot('desktop-checkpoint.png');
  if(mode==='matrix'){
    assert.equal(current.stats.displayed,241);assert.equal(current.overflow,false);assert.equal(Number(current.planeOpacity),0);
    for(const [width,height,locale]of[[1440,900,'en'],[390,844,'pt-br'],[360,800,'en'],[844,390,'en']]){
      await b.viewport(width,height,width<=760);await visit(locale);await sleep(1000);current=await sample(`${width}-${height}-${locale}-checkpoint`);await b.shot(`${width}-${height}-${locale}-checkpoint.png`);
      assert.equal(current.overflow,false);assert.equal(current.poster,true);
      if(height>=600){assert.equal(current.stats.displayed,241);assert.ok(current.media.bottom<height);assert.ok(current.title.y>=current.nav.bottom);}
      else{assert.equal(current.static,true);assert.equal(current.canvas,false);assert.equal(current.probe.requests.length,0);assert.ok(current.title.y>=current.nav.bottom);}
    }
  }
  if(mode==='interaction'){
    for(const [width,height,locale]of[[1440,900,'pt-br'],[390,844,'en']]){
      await b.viewport(width,height,width<=760);await visit(locale);await at(-.4);
      const before=await sample(`${width}-bridge-before`);assert.ok(Number(before.planeOpacity)>.2);await b.shot(`${width}-bridge-before.png`);
      await b.startRecording();
      for(let i=0;i<(width<=760?16:17);i++){
        await b.wheel(i%2?160:120);
        if(i===6){await b.click('header button[aria-pressed]');const frozen=await sample(`${width}-pause`);await b.wheel(240);const held=await sample(`${width}-pause-scroll`);assert.equal(held.p,frozen.p);assert.equal(held.stats.displayed,frozen.stats.displayed);assert.equal(held.probe.requests.length,frozen.probe.requests.length);await b.click('header button[aria-pressed]');await sleep(300);}
        if(i===10)await b.wheel(-320);
        const s=await sample(`${width}-wheel-${i}`);assert.ok(s.stats.entries+s.stats.pending<=s.stats.maxEntries);assert.ok(s.stats.pending<=2);assert.ok(s.stats.estimatedDecodedBytes<=(width<=760?64:96)*1024*1024);
        assert.ok(s.probe.requests.every(r=>r.index<=241));assert.ok(s.probe.paints.every(r=>r.index===r.target&&r.allowed&&!r.hidden));
      }
      await b.key('PageUp');await b.key('PageDown');
      const settled=await sample(`${width}-after-keys`);assert.equal(settled.stats.displayed,241);report.checks[`${width}-trace`]=settled.probe;
      report.checks[`${width}-video`]=await b.stopRecording(`${width}-wheel-pause-reverse.webm`);await at(1.1);await sample(`${width}-reading-hold`);await b.shot(`${width}-reading.png`);
      await b.wheel(600);await b.wheel(600);await sample(`${width}-editorial`);await b.shot(`${width}-editorial.png`);
      if(width<=760){await b.click('details summary');await b.click('details a[href="#sdimt"]');}else await b.click('a[href="#sdimt"]');await sleep(1500);const returned=await sample(`${width}-checkpoint-return`);assert.equal(returned.stats.displayed,241);assert.ok(returned.title.y>=returned.nav.bottom&&returned.title.y<height/2);
    }
    await b.viewport(390,844,true);await visit();await at(.1);
    await b.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:700}]});
    for(let y=660;y>=260;y-=50){await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y}]});await sleep(40);}
    await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(600);assert.ok((await sample('touch-forward')).p>.1);await b.send('Emulation.setTouchEmulationEnabled',{enabled:false});
    await b.viewport(844,390);await sleep(700);const landscape=await sample('resize-landscape');assert.equal(landscape.static,true);assert.equal(landscape.canvas,false);assert.equal(landscape.overflow,false);assert.ok(landscape.title.y>=landscape.nav.bottom&&landscape.media.bottom<390);await b.shot('resize-landscape.png');
  }
  if(mode==='failures'){
    await b.viewport(1440,900);await visit();await at(.35);
    await b.evaluate('window.__rotato.delay=600');await at(.75);await at(.2);await sleep(1700);
    const reversed=await sample('late-decode-reverse');assert.equal(reversed.stats.displayed,reversed.stats.target);assert.ok(reversed.stats.discarded>0);
    await b.evaluate('window.__rotato.delay=0');
    const tab=await b.send('Target.createTarget',{url:'about:blank'});await b.send('Target.activateTarget',{targetId:tab.targetId});await sleep(400);
    const hidden=await sample('hidden');await b.evaluate(`window.__lenis.scrollTo(${hidden.stageTop-Math.max(100,hidden.nav.bottom+20)+hidden.height*1.5*.65},{immediate:true,force:true})`);await sleep(600);const hold=await sample('hidden-no-decodes');assert.equal(hold.probe.requests.length,hidden.probe.requests.length);assert.equal(hold.stats.displayed,hidden.stats.displayed);
    await b.send('Target.closeTarget',{targetId:tab.targetId});await b.send('Page.bringToFront');await sleep(700);const visible=await sample('visible-return');assert.equal(visible.stats.displayed,visible.stats.target);
    await b.click('a[href="#nks"]');await sleep(1500);const away=await sample('offscreen');await sleep(700);assert.equal((await state()).probe.requests.length,away.probe.requests.length);await b.shot('nks-smoke.png');
    await b.send('Network.setCacheDisabled',{cacheDisabled:true});
    await b.send('Fetch.enable',{patterns:[{urlPattern:'*motion-sdimt/frame_*.webp',requestStage:'Request'}]});let failureMode='slow';
    b.on('Fetch.requestPaused',async({requestId})=>{try{if(failureMode==='slow'){await sleep(2200);await b.send('Fetch.continueRequest',{requestId});}else await b.send('Fetch.fulfillRequest',{requestId,responseCode:404,body:''});}catch(error){if(/Invalid InterceptionId/.test(error.message))report.checks.cancelledInterceptions=(report.checks.cancelledInterceptions||0)+1;else b.errors.push(error.message);}});
    await visit();const cold=await sample('slow-cold-poster');assert.equal(cold.presented,false);assert.equal(cold.poster,true);await b.shot('slow-cold-poster.png');await sleep(2600);assert.equal((await sample('slow-ready')).stats.displayed,241);
    failureMode='404';await at(.4);await sleep(800);const failed=await sample('404-retains-frame');assert.equal(failed.stats.displayed,241);assert.ok(failed.stats.failures>0);await b.shot('404-retains-frame.png');
    await visit();await sleep(500);const allFailed=await sample('404-cold-poster');assert.equal(allFailed.presented,false);assert.equal(allFailed.poster,true);await b.shot('404-cold-poster.png');await b.send('Fetch.disable');
    await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await visit('en');const reduced=await sample('reduced');assert.equal(reduced.canvas,false);assert.equal(reduced.probe.requests.length,0);await b.shot('reduced.png');await b.send('Emulation.setEmulatedMedia',{features:[]});
    await b.send('Emulation.setScriptExecutionDisabled',{value:true});await visit();const nojs=await b.evaluate(`(()=>{const s=document.querySelector('#sdimt');return{title:s.querySelector('h2').textContent,fields:s.querySelectorAll('dd').length,link:!!s.querySelector('.awwwards-case-editorial a'),poster:s.querySelector('img').complete,overflow:document.documentElement.scrollWidth>innerWidth}})()`);assert.equal(nojs.poster,true);assert.equal(nojs.link,true);assert.equal(nojs.fields,2);assert.equal(nojs.overflow,false);report.checks.nojs=nojs;await b.shot('no-js.png');await b.send('Emulation.setScriptExecutionDisabled',{value:false});
    await visit();await b.click('header a[href="#intro"]');await sleep(1500);await b.shot('hero-smoke.png');await b.click('header a[href="#process"]');await sleep(1500);await b.until(`document.querySelector('#process [class*=processCanvas]')?.style.opacity==='1'`);await b.shot('process-smoke.png');
    report.checks.process=await b.evaluate(`(()=>{const s=document.querySelector('#process');return{articles:s.querySelectorAll('article').length,firstActive:s.querySelector('article').dataset.active}})()`);assert.equal(report.checks.process.articles,3);assert.equal(report.checks.process.firstActive,'true');
    await b.click('header a[href="#contact"]');await sleep(1500);assert.equal(await b.evaluate(`!!document.activeElement.closest('#contact')`),true);
  }
}catch(error){report.pass=false;report.failure=error.stack;try{report.diagnostic=await state();await b.shot('diagnostic.png');}catch{}process.exitCode=1;console.error(error.stack);}
finally{if(report.pass!==false)report.pass=true;writeFileSync(`${output}/${mode}.json`,JSON.stringify(report,null,2));b.close();}
