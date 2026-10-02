import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const option = (name, fallback) => { const index = process.argv.indexOf(name); return index < 0 ? fallback : process.argv[index + 1]; };
const origin = option('--origin', 'http://localhost:3002');
const mode = option('--mode', 'input');
const output = resolve(option('--output', `docs/awwwards/evidence-narrative/electric-identity/${mode}.json`));
const port = Number(option('--port', '9468'));
const temp = mkdtempSync(join(tmpdir(), 'identity-check-'));
const browser = spawn(process.env.CHROME_PATH || 'F:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--no-first-run', '--disable-extensions', '--disable-gpu', '--enable-unsafe-swiftshader', '--remote-allow-origins=*', `--remote-debugging-port=${port}`, `--user-data-dir=${temp}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws;
let recording;
let failAsset = false;
let delayAsset = 0;
let assetWaiting = false;
let id = 0;
const calls = new Map();
const report = { mode, origin, method: 'Native Chrome CDP, trusted browser input, software WebGL', checks: {}, errors: [] };
function instrumentRuntime() {
  let current;
  let tick;
  let writes = 0;
  window.__runtimeProbe = { active: 0, maxPerTick: 0 };
  Object.defineProperty(Window.prototype, '__lenis', { configurable: true, get() { return current; }, set(instance) {
    if (!instance || current === instance) return;
    current = instance;
    window.__runtimeProbe.active++;
    const raf = instance.raf.bind(instance);
    instance.raf = time => { if(tick === time) writes++; else {tick=time;writes=1;} window.__runtimeProbe.maxPerTick=Math.max(window.__runtimeProbe.maxPerTick,writes); return raf(time); };
    const destroy = instance.destroy.bind(instance);
    instance.destroy = () => { window.__runtimeProbe.active--; if(current===instance)current=null; return destroy(); };
  }});
  window.__identityMorphs = new WeakMap();
  const names = new WeakMap();
  for(const Type of [WebGLRenderingContext,WebGL2RenderingContext]) {
    const location = Type.prototype.getUniformLocation;
    Type.prototype.getUniformLocation = function(...args) { const result=location.apply(this,args); if(result)names.set(result,args[1]); return result; };
    const uniform = Type.prototype.uniform1f;
    Type.prototype.uniform1f = function(location,value) { if(names.get(location)==='uMorph')window.__identityMorphs.set(this.canvas,value); return uniform.call(this,location,value); };
  }
}
const send = (method, params = {}) => new Promise((resolve, reject) => { const key = ++id; calls.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); });
const evaluate = async expression => { const value = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (value.exceptionDetails) throw Error(value.exceptionDetails.text); return value.result.value; };
async function shot(name) { const result = await send('Page.captureScreenshot', { format: 'png' }); mkdirSync(dirname(output), { recursive: true }); writeFileSync(join(dirname(output), name), Buffer.from(result.data, 'base64')); }
async function startRecording() { recording = []; await send('Page.startScreencast', { format: 'jpeg', quality: 75, maxWidth: 1440, maxHeight: 900, everyNthFrame: 2 }); }
async function stopRecording(name) {
  await send('Page.stopScreencast');
  const frames = recording; recording = null;
  if (!frames?.length) throw Error('No screencast frames');
  const manifest = join(temp, 'frames.ffconcat');
  const lines = ['ffconcat version 1.0'];
  frames.forEach((f,i) => { lines.push(`file '${f.path.replaceAll('\\','/')}'`); lines.push(`duration ${Math.max(.001,(frames[i+1]?.time ?? f.time+.1)-f.time)}`); });
  writeFileSync(manifest, lines.join('\n'));
  const encoded = spawnSync(process.env.FFMPEG_PATH || 'F:/Users/Vinz/AppData/Local/Programs/LNV/Stremio-4/ffmpeg.exe', ['-y','-v','error','-safe','0','-f','concat','-i',manifest,'-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2','-vsync','vfr','-c:v','libx264','-preset','veryfast','-crf','28','-pix_fmt','yuv420p','-movflags','+faststart',join(dirname(output),name)], { windowsHide: true, encoding: 'utf8' });
  if(encoded.status !== 0) throw Error(encoded.stderr);
  report.video = { name, frames: frames.length, seconds: frames.at(-1).time-frames[0].time, method: 'Actual Chrome screencast timestamps, VFR, no interpolation' };
}
async function until(expression, timeout = 30000) { const start = Date.now(); while (Date.now() - start < timeout) { if (await evaluate(expression)) return; await sleep(150); } throw Error(`Timed out: ${expression}`); }
async function visit(hash = '') { await send('Page.navigate', { url: `${origin}/pt-br/awwwards-preview/ember${hash}` }); await until('(Boolean(window.__lenis) || matchMedia("(prefers-reduced-motion: reduce)").matches) && document.readyState === "complete"'); await sleep(900); }
async function wheel(delta) { const before = await evaluate('scrollY'); await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 650, y: 400, deltaX: 0, deltaY: delta }); await sleep(1700); return (await evaluate('scrollY')) - before; }
async function click(selector) { const point = await evaluate(`(() => { const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`); await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point }); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point }); }
try {
  let endpoint;
  for (let n = 0; n < 60; n++) { try { endpoint = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(x => x.type === 'page')?.webSocketDebuggerUrl; } catch {} if (endpoint) break; await sleep(150); }
  if (!endpoint) throw Error('Chrome unavailable');
  ws = new WebSocket(endpoint);
  ws.onmessage = event => { const message = JSON.parse(event.data); if(message.method==='Fetch.requestPaused'){assetWaiting=true;sleep(delayAsset).then(()=>send(failAsset?'Fetch.failRequest':'Fetch.continueRequest',{requestId:message.params.requestId,...(failAsset?{errorReason:'Failed'}:{})}));return;} if (message.method === 'Page.screencastFrame') { if(recording) { const path=join(temp,`frame-${recording.length}.jpg`); writeFileSync(path,Buffer.from(message.params.data,'base64')); recording.push({path,time:message.params.metadata.timestamp}); } send('Page.screencastFrameAck',{sessionId:message.params.sessionId}); return; } if (message.method === 'Runtime.exceptionThrown') report.errors.push(message.params.exceptionDetails); const call = calls.get(message.id); if (!call) return; calls.delete(message.id); if (message.error) call.reject(Error(message.error.message)); else call.resolve(message.result); };
  await new Promise(r => ws.onopen = r);
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Network.setCacheDisabled',{cacheDisabled:true});
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `(${instrumentRuntime.toString()})()` });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__identityPaints=new WeakMap();window.__identityContexts=new WeakSet();window.__identityCreated=0;for(const T of [WebGLRenderingContext,WebGL2RenderingContext])for(const name of ['drawArrays','drawElements']){const f=T.prototype[name];T.prototype[name]=function(...args){if(this.canvas.closest('[data-electric-logo]')){if(!window.__identityContexts.has(this.canvas)){window.__identityContexts.add(this.canvas);window.__identityCreated++;}window.__identityPaints.set(this.canvas,(window.__identityPaints.get(this.canvas)||0)+1);}return f.apply(this,args);}}` });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  if(mode === 'seam') await send('Page.addScriptToEvaluateOnNewDocument',{source:`const timer=window.setTimeout;window.setTimeout=(f,d,...a)=>timer(f,d===2800||d===4000?7000:d,...a);`});
  await visit();
  if(mode === 'source') {
    const original=readFileSync('docs/awwwards/reference-sources/identity-review-2026-10-02/vinz-alt.owner.svg','utf8');
    const raster=await evaluate(`(async()=>{const im=new Image();im.src='data:image/svg+xml;base64,${Buffer.from(original).toString('base64')}';await im.decode();const c=document.createElement('canvas');c.width=810;c.height=810;const x=c.getContext('2d');x.drawImage(im,0,0,810,810);return c.toDataURL().split(',')[1]})()`);
    mkdirSync(dirname(output),{recursive:true});writeFileSync(join(dirname(output),'vinz-process-original.png'),Buffer.from(raster,'base64'));
    await shot('hero-before.png');
    await send('Page.navigate',{url:'https://sdimt-seplag.lovable.app/?panel=home'});await sleep(4000);
    report.publicPurpose=await evaluate('document.body.innerText');await shot('sdimt-public-source.png');
  } else if(mode === 'source-mobile') {
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await send('Page.navigate',{url:'https://sdimt-seplag.lovable.app/?panel=home'});await sleep(4500);
    report.purpose=await evaluate('document.body.innerText');await shot('sdimt-public-mobile.png');await startRecording();await sleep(12000);await stopRecording('sdimt-public-mobile-motion.mp4');
  } else if(mode === 'bridge') {
    report.samples=[];
    const sample=async label=>{const r=await evaluate(`(()=>{const b=document.querySelector('[data-bridge-phase]'),v=b.querySelector('video'),n=document.querySelector('header nav'),p=document.querySelector('[class*=sdimtPlane]').getBoundingClientRect();return {y:scrollY,phase:b.dataset.bridgePhase,p:Number(b.dataset.bridgeProgress),presented:b.dataset.presentedFrame,videoTime:v.currentTime,paused:v.paused,ready:v.readyState,navWidth:n.getBoundingClientRect().width,plane:{left:p.left,top:p.top,width:p.width,height:p.height},lenis:window.__runtimeProbe.active,raf:window.__runtimeProbe.maxPerTick}})()`);report.samples.push({label,...r});return r;};
    await startRecording();await shot('hero-rhythm.png');await sample('top');
    for(let i=0;i<19;i++){await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:650,y:400,deltaX:0,deltaY:i%2?120:80});await sleep(i%2?600:900);await sample(`short-${i}`);if(i===10)await shot('bridge-poster-expanding.png');}
    await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:650,y:400,deltaX:0,deltaY:240});await sleep(1000);await sample('burst-240');
    await until(`document.querySelector('[data-bridge-phase]').dataset.presentedFrame==='true'`,15000);const playing=await sample('first-frame');assert.ok(playing.p>=1);await shot('bridge-first-frame.png');
    await wheel(-120);const frozen=await sample('reverse-frozen');assert.equal(frozen.paused,true);const frozenTime=frozen.videoTime;await sleep(1000);assert.equal((await sample('reverse-hold')).videoTime,frozenTime);assert.equal(frozen.presented,'true');await shot('bridge-reverse-frame.png');
    await wheel(120);await sleep(1000);await sample('forward-resume');
    await click('[class*=bridgeControls] button');const paused=await sample('global-pause');assert.equal(paused.paused,true);await sleep(700);assert.equal((await sample('pause-hold')).videoTime,paused.videoTime);await click('[class*=bridgeControls] button');await sleep(600);
    for(let i=0;i<9;i++){await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:650,y:400,deltaX:0,deltaY:i%2?480:240});await sleep(900);await sample(`handoff-${i}`);if(i===3)await shot('sdimt-accommodation.png');if(i===6)await shot('sdimt-reading-rhythm.png');}
    await stopRecording('bridge-short-wheel-pause-reverse.mp4');
    const after=await sample('case-exit');assert.equal(after.paused,true);assert.equal(after.lenis,1);assert.equal(after.raf,1);
    await click('header a[href="#intro"]');await until('scrollY<5',6000);report.restored=await sample('top-return');assert.ok(report.restored.y<5);assert.ok(report.restored.navWidth>900);await shot('nav-top-return.png');
  } else if(mode === 'failures') {
    const bridgeState=()=>evaluate(`(()=>{const b=document.querySelector('[data-bridge-phase]'),v=b.querySelector('video');return {phase:b.dataset.bridgePhase,p:Number(b.dataset.bridgeProgress),presented:b.dataset.presentedFrame,time:v.currentTime,paused:v.paused,ready:v.readyState}})()`);
    const at=async y=>{await evaluate(`window.__lenis.scrollTo(${y},{immediate:true})`);await sleep(250);};
    await at(1950);await until(`document.querySelector('[data-bridge-phase]').dataset.presentedFrame==='true'`);await sleep(200);
    const tab=await send('Target.createTarget',{url:'about:blank'});await send('Target.activateTarget',{targetId:tab.targetId});await sleep(300);assert.equal(await evaluate('document.hidden'),true);const a=await bridgeState();await sleep(900);const b=await bridgeState();report.hidden={a,b};assert.equal(b.paused,true);assert.equal(a.time,b.time);await send('Target.closeTarget',{targetId:tab.targetId});await send('Page.bringToFront');await sleep(400);assert.equal((await bridgeState()).paused,false);
    await at(0);await sleep(200);report.reset=await bridgeState();assert.equal(report.reset.presented,'false');assert.equal(report.reset.time,0);
    const rejected=await send('Page.addScriptToEvaluateOnNewDocument',{source:`HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Rejected test','NotAllowedError'));}`});await visit();await at(1950);await sleep(500);report.rejected=await bridgeState();assert.equal(report.rejected.phase,'fallback');assert.equal(report.rejected.presented,'false');await shot('bridge-autoplay-rejected.png');await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:rejected.identifier});
    const delayed=await send('Page.addScriptToEvaluateOnNewDocument',{source:`const original=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const video=this;return new Promise((resolve,reject)=>setTimeout(()=>original.call(video).then(resolve,reject),2500));};`});await visit();await at(1950);await at(3400);await sleep(3200);report.delayedOffscreen=await bridgeState();assert.equal(report.delayedOffscreen.paused,true);assert.equal(report.delayedOffscreen.presented,'false');await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:delayed.identifier});
    await send('Fetch.enable',{patterns:[{urlPattern:'*sdimt/bridge/landing.mp4',requestStage:'Request'}]});delayAsset=8000;await visit();await at(1000);report.slowExpanding=await bridgeState();assert.ok(report.slowExpanding.ready<2);assert.equal(report.slowExpanding.paused,true);assert.equal(report.slowExpanding.presented,'false');await shot('bridge-slow-poster.png');await at(1950);await until(`document.querySelector('[data-bridge-phase]').dataset.presentedFrame==='true'`,12000);report.slowReady=await bridgeState();delayAsset=0;await send('Fetch.disable');
    await send('Fetch.enable',{patterns:[{urlPattern:'*sdimt/bridge/landing.mp4',requestStage:'Request'}]});failAsset=true;await visit();await at(1950);await sleep(500);report.failed=await bridgeState();assert.equal(report.failed.presented,'false');assert.equal(report.failed.paused,true);await shot('bridge-video-failed.png');failAsset=false;await send('Fetch.disable');
    await visit();await at(1000);await wheel(-240);report.interruptedBeforePlay=await bridgeState();assert.equal(report.interruptedBeforePlay.time,0);assert.equal(report.interruptedBeforePlay.presented,'false');
    await visit();await evaluate(`document.querySelector('header a[href="#about"]').focus()`);await wheel(500);report.focusPreserved=await evaluate(`document.activeElement===document.querySelector('header a[href="#about"]')`);assert.equal(report.focusPreserved,true);await shot('navbar-focus-compact.png');
  } else if(mode === 'nav-probe') {
    await visit('#process');await sleep(400);report.nav=await evaluate(`(()=>{const n=document.querySelector('header nav'),r=n.getBoundingClientRect();return {nav:{width:r.width,left:r.left,right:r.right,gap:getComputedStyle(n).gap,columnGap:getComputedStyle(n).columnGap,padding:getComputedStyle(n).padding},children:[...n.children].map(c=>{const b=c.getBoundingClientRect();return {name:c.className,style:c.getAttribute('style'),width:b.width,left:b.left,right:b.right,gap:getComputedStyle(c).gap}})}})()`);
  } else if(mode === 'process-rhythm') {
    await visit('#about');await evaluate(`window.__lenis.scrollTo(document.querySelector('#process').getBoundingClientRect().top+scrollY-80,{immediate:true})`);await sleep(500);await until('Boolean(document.querySelector("#process canvas"))');await startRecording();
    report.samples=[];
    const state=async label=>{const value=await evaluate(`(()=>{const section=document.querySelector('#process'),stage=section.firstElementChild,r=section.getBoundingClientRect(),v=stage.getBoundingClientRect();return {y:scrollY,p:Math.max(0,Math.min(1,-r.top/(section.offsetHeight-innerHeight))),stickyDistance:section.offsetHeight-innerHeight,stageTop:v.top,stageBottom:v.bottom,canvas:!!section.querySelector('canvas'),fallback:!section.querySelector('img').hidden}})()`);report.samples.push({label,...value});return value;};
    await state('arrival');
    for(let i=0;i<11;i++){await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:650,y:400,deltaX:0,deltaY:i%2?120:80});await sleep(i%2?650:1000);const value=await state(`short-${i}`);if(i===3)await shot('process-short-drawing.png');if(i===6)await shot('process-short-volume.png');if(value.p>=.78){await shot('process-short-reading.png');break;}}
    const reading=report.samples.at(-1);assert.ok(reading.p>=.78);assert.ok(reading.stageBottom<=901);
    await click('header button[aria-pressed]');await sleep(300);assert.equal(await evaluate(`!document.querySelector('#process img').hidden`),true);await shot('process-global-pause.png');await click('header button[aria-pressed]');await sleep(400);
    await wheel(-240);await state('reverse-240');await shot('process-short-reverse.png');await wheel(120);await state('forward-again');await stopRecording('process-short-wheel-pause-reverse.mp4');
  } else if(mode === 'mobile') {
    report.layouts=[];
    for(const [width,height] of [[360,800],[390,844],[1440,900]]) for(const locale of ['pt-br','en']) {
      await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<760});await send('Emulation.setTouchEmulationEnabled',{enabled:width<760});
      await send('Page.navigate',{url:`${origin}/${locale}/awwwards-preview/ember`});await until('Boolean(window.__lenis)');await sleep(500);await shot(`rhythm-${locale}-${width}-hero.png`);
      if(width<760){
        await click('button[aria-controls="story-nav-links"]');assert.equal(await evaluate(`document.querySelector('#story-nav-links').dataset.open==='true'`),true);
        await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});assert.equal(await evaluate(`document.activeElement===document.querySelector('button[aria-controls="story-nav-links"]')`),true);
        await startRecording();
        for(let i=0;i<10;i++){
          await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:650}]});for(let y=610;y>=270;y-=40){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y}]});await sleep(35);}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(350);
          if(await evaluate(`Number(document.querySelector('[data-bridge-phase]').dataset.bridgeProgress)>1`))break;
        }
        await until(`document.querySelector('[data-bridge-phase]').dataset.presentedFrame==='true'`,15000);await shot(`rhythm-${locale}-${width}-playing.png`);
        await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:300}]});for(let y=340;y<=620;y+=40){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y}]});await sleep(35);}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(400);
        assert.equal(await evaluate(`document.querySelector('[data-bridge-phase] video').paused`),true);await shot(`rhythm-${locale}-${width}-reverse.png`);await stopRecording(`bridge-touch-${locale}-${width}.mp4`);
      }
      await evaluate(`window.__lenis.scrollTo(document.querySelector('[class*=sdimtReading]').getBoundingClientRect().top+scrollY-100,{immediate:true})`);await sleep(500);await shot(`rhythm-${locale}-${width}-reading.png`);
      const layout=await evaluate(`(()=>{const n=document.querySelector('header nav'),links=[...n.querySelectorAll('a,button')].filter(a=>a.getBoundingClientRect().width>0);return {locale:'${locale}',width:${width},overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,chapters:document.querySelectorAll('[data-story-chapter]').length,targets:links.map(a=>({name:a.getAttribute('aria-label')||a.textContent,width:a.getBoundingClientRect().width,height:a.getBoundingClientRect().height,insideNav:a.getBoundingClientRect().left>=n.getBoundingClientRect().left && a.getBoundingClientRect().right<=n.getBoundingClientRect().right})),videoFit:getComputedStyle(document.querySelector('[data-bridge-phase] video')).objectFit}})()`);report.layouts.push(layout);assert.equal(layout.overflow,false);assert.equal(layout.h1,1);assert.equal(layout.chapters,10);for(const target of layout.targets){assert.ok(target.height>=44);assert.equal(target.insideNav,true);}
      if(width<760)assert.equal(layout.videoFit,'contain');
    }
  } else if(mode === 'seam') {
    await until('Boolean(document.querySelector("[data-electric-logo] canvas"))');
    report.shapes=[];report.samples=[];report.seamHoldOnly='Test-only hold extended to 7s to capture each shape; original cycle timing is not tested in this mode';
    for(const name of ['vinz','react','gsap']) {
      await until(`document.querySelector('[data-hero-identity]').dataset.displayedIdentity==='${name}'`,120000);
      for(const [tone,color] of [['dark','#100e17'],['light','#426fa3']]){
        await evaluate(`document.querySelector('[class*=plasmaCanvas]').style.visibility='hidden';document.querySelector('[class*=plasmaPoster]').style.background='${color}'`);
        for(const side of ['left','right']){const pt=await evaluate(`(()=>{const r=document.querySelector('[data-electric-logo]').getBoundingClientRect();return {x:${'side'}==='left'?r.left+5:r.right-5,y:r.top+r.height/2}})()`.replaceAll('side',JSON.stringify(side)));await send('Input.dispatchMouseEvent',{type:'mouseMoved',...pt});await sleep(250);const actual=await evaluate(`document.querySelector('[data-hero-identity]').dataset.displayedIdentity`);report.samples.push({expected:name,actual,tone,side});assert.equal(actual,name);await shot(`seam-${name}-${tone}-${side}.png`);}
      }
      report.shapes.push(name);await evaluate(`document.querySelector('[class*=plasmaCanvas]').style.visibility='visible'`);
    }
  } else throw Error('Unknown mode');
  report.pass = true;
} catch (error) { report.pass = false; report.failure = String(error); process.exitCode = 1; }
finally { mkdirSync(dirname(output), { recursive: true }); writeFileSync(output, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2)); ws?.close(); browser.kill(); }
