import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
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
let id = 0;
const calls = new Map();
const report = { mode, origin, method: 'Native Chrome CDP, trusted browser input, software WebGL', checks: {}, errors: [] };
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
  ws.onmessage = event => { const message = JSON.parse(event.data); if(message.method==='Fetch.requestPaused'){send(failAsset?'Fetch.failRequest':'Fetch.continueRequest',{requestId:message.params.requestId,...(failAsset?{errorReason:'Failed'}:{})});return;} if (message.method === 'Page.screencastFrame') { if(recording) { const path=join(temp,`frame-${recording.length}.jpg`); writeFileSync(path,Buffer.from(message.params.data,'base64')); recording.push({path,time:message.params.metadata.timestamp}); } send('Page.screencastFrameAck',{sessionId:message.params.sessionId}); return; } if (message.method === 'Runtime.exceptionThrown') report.errors.push(message.params.exceptionDetails.text); const call = calls.get(message.id); if (!call) return; calls.delete(message.id); if (message.error) call.reject(Error(message.error.message)); else call.resolve(message.result); };
  await new Promise(r => ws.onopen = r);
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__identityPaints=new WeakMap();window.__identityContexts=new WeakSet();window.__identityCreated=0;for(const T of [WebGLRenderingContext,WebGL2RenderingContext])for(const name of ['drawArrays','drawElements']){const f=T.prototype[name];T.prototype[name]=function(...args){if(this.canvas.closest('[data-electric-logo]')){if(!window.__identityContexts.has(this.canvas)){window.__identityContexts.add(this.canvas);window.__identityCreated++;}window.__identityPaints.set(this.canvas,(window.__identityPaints.get(this.canvas)||0)+1);}return f.apply(this,args);}}` });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await visit();
  if (mode === 'input') {
    report.wheelAdvance = await wheel(500);
    report.wheelReverse = await wheel(-300);
    await visit();
    await click('a[href="#sdimt"]'); await sleep(240);
    report.interruptionAdvance = await wheel(500);
    report.lateDestinationFocus = await evaluate('document.activeElement?.closest("[data-story-chapter]")?.id === "sdimt"');
    await visit(); await click('a[href="#sdimt"]'); await sleep(1500);
    report.afterCompletedCheckpointAdvance = await wheel(500);
    assert.ok(report.wheelAdvance > 0); assert.ok(report.wheelReverse < 0); assert.ok(report.interruptionAdvance > 0); assert.equal(report.lateDestinationFocus, false); assert.ok(report.afterCompletedCheckpointAdvance > 0);
  } else if (mode === 'hero') {
    report.heroPresent = await evaluate('Boolean(document.querySelector("[data-hero-identity]"))');
    assert.equal(report.heroPresent, true);
    await until('document.querySelector("[data-electric-logo] canvas") && window.__identityCreated === 1');
    mkdirSync(dirname(output), { recursive: true }); await startRecording();
    report.completedCycle = ['vinz'];
    let previous = 'vinz';
    const started = Date.now();
    while (Date.now() - started < 120000 && report.completedCycle.length < 7) {
      const current = await evaluate('document.querySelector("[data-hero-identity]").dataset.displayedIdentity');
      if (current !== previous) { report.completedCycle.push(current); previous = current; await shot(`hero-${current}.png`); }
      await sleep(150);
    }
    report.activeElectricRenderers = await evaluate('document.querySelectorAll("[data-electric-logo] canvas").length');
    report.rendererRecreationsDuringCycle = await evaluate('window.__identityCreated - 1');
    report.labelMatchesPresentedShape = await evaluate('document.querySelector("[data-hero-identity] figcaption span").textContent === "VINZ"');
    const image = await send('Page.captureScreenshot', { format: 'png' }); mkdirSync(dirname(output), { recursive: true }); writeFileSync(join(dirname(output), 'hero-desktop.png'), Buffer.from(image.data, 'base64'));
    await click('button[class*="motionToggle"]'); await sleep(150);
    const paints = await evaluate('window.__identityPaints.get(document.querySelector("[data-electric-logo] canvas")) || 0'); await sleep(800);
    report.framesWhilePaused = await evaluate(`(window.__identityPaints.get(document.querySelector('[data-electric-logo] canvas')) || 0) - ${paints}`);
    await stopRecording('hero-full-cycle.mp4');
    await click('button[class*="motionToggle"]'); await sleep(700);
    const hiddenBefore = await evaluate('document.querySelector("[data-hero-identity]").dataset.displayedIdentity');
    const tab = await send('Target.createTarget', { url: 'about:blank' });
    await send('Target.activateTarget', { targetId: tab.targetId }); await sleep(300);
    report.actualHidden = await evaluate('document.hidden');
    await sleep(6000);
    const hiddenAfter = await evaluate('document.querySelector("[data-hero-identity]").dataset.displayedIdentity');
    report.hiddenCatchUp = hiddenBefore !== hiddenAfter;
    await send('Target.closeTarget', { targetId: tab.targetId }); await send('Page.bringToFront');
    await send('Fetch.enable', { patterns: [{ urlPattern: '*identity/react.png', requestStage: 'Request' }] }); failAsset = true;
    await visit(); await sleep(10000);
    report.lastValidShapeRetainedOnError = await evaluate('document.querySelector("[data-hero-identity]").dataset.displayedIdentity === "vinz" && document.querySelector("[data-electric-logo]").style.opacity === "1"');
    failAsset = false; await send('Fetch.disable');
    assert.equal(report.actualHidden, true); assert.equal(report.hiddenCatchUp, false); assert.equal(report.lastValidShapeRetainedOnError, true);
    assert.deepEqual(report.completedCycle, ['vinz', 'react', 'typescript', 'tailwind', 'motion', 'gsap', 'vinz']); assert.equal(report.activeElectricRenderers, 1); assert.equal(report.rendererRecreationsDuringCycle, 0); assert.equal(report.labelMatchesPresentedShape, true); assert.equal(report.framesWhilePaused, 0);
  } else if (mode === 'assets') {
    mkdirSync(dirname(output), { recursive: true });
    for (const name of ['vinz','react','typescript','tailwind','motion','gsap']) {
      const raster = await evaluate(`(async()=>{const image=new Image();image.src='/awwwards/identity/${name}.svg';await image.decode();const c=document.createElement('canvas');c.width=810;c.height=810;const x=c.getContext('2d');const fit=810/Math.max(image.naturalWidth,image.naturalHeight);x.drawImage(image,0,0,image.naturalWidth*fit,image.naturalHeight*fit);return c.toDataURL('image/png').split(',')[1];})()`);
      writeFileSync(join(dirname(output), `${name}-original-raster.png`), Buffer.from(raster,'base64'));
    }
  } else if (mode === 'process') {
    await visit('#process');
    await until('Boolean(document.querySelector("#process canvas"))'); await sleep(2500);
    report.scenePresent = await evaluate('Boolean(document.querySelector("#process canvas"))');
    assert.equal(report.scenePresent, true);
    await shot('process-direct.png');
    await visit('#about');
    await startRecording();
    for(let n=0;n<12;n++) { await wheel(300); if(await evaluate('document.querySelector("#process").getBoundingClientRect().top < 400')) break; }
    await sleep(1500); await shot('process-contour.png');
    report.forward = await wheel(650); await shot('process-volume.png');
    await wheel(650); await shot('process-reading.png');
    report.reverse = await wheel(-850); await shot('process-reverse.png');
    await stopRecording('process-wheel-forward-reverse.mp4');
    assert.ok(report.forward > 0); assert.ok(report.reverse < 0);
  } else if (mode === 'audit') {
    report.layouts = [];
    for(const [width,height] of [[360,800],[390,844],[1440,900]]) {
      await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<760});
      await send('Emulation.setTouchEmulationEnabled',{enabled:width<760});
      for(const locale of ['pt-br','en']) {
        await send('Page.navigate',{url:`${origin}/${locale}/awwwards-preview/ember`}); await until('Boolean(window.__lenis)'); await sleep(800);
        const layout = await evaluate(`(()=>{const hero=document.querySelector('[data-hero-identity]'); const text=document.querySelector('h1'); const a=hero.getBoundingClientRect(),b=text.getBoundingClientRect();return {locale:${JSON.stringify(locale)},width:${width},horizontalOverflow:document.documentElement.scrollWidth>innerWidth,heroRight:a.right,textRight:b.right,heroBelowText:a.top>=b.bottom,canvasFocus:!!document.querySelector('canvas[tabindex]')}})()`);
        report.layouts.push(layout); assert.equal(layout.horizontalOverflow,false); assert.equal(layout.canvasFocus,false);
        await shot(`hero-${locale}-${width}.png`);
        if(width<760) { const before=await evaluate('scrollY'); await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:650}]}); for(let y=600;y>=260;y-=40){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y}]});await sleep(45);} await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(700); report.checks[`touch-${locale}-${width}`]=(await evaluate('scrollY'))-before; assert.ok(report.checks[`touch-${locale}-${width}`]>0); await shot(`hero-symbol-${locale}-${width}.png`); }
        await send('Page.navigate',{url:`${origin}/${locale}/awwwards-preview/ember#process`});await until('Boolean(document.querySelector("#process canvas"))');await sleep(1500);await shot(`process-${locale}-${width}.png`);
      }
    }
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]}); await visit(); await sleep(800);
    report.reducedHeroNoRenderer=await evaluate('!document.querySelector("[data-electric-logo] canvas") && !document.querySelector("[data-hero-identity] img").hidden'); assert.equal(report.reducedHeroNoRenderer,true);await shot('hero-reduced.png');
    await send('Page.navigate',{url:`${origin}/pt-br/awwwards-preview/ember#process`});await sleep(2200);report.reducedProcessNoRenderer=await evaluate('!document.querySelector("#process canvas") && !document.querySelector("#process img").hidden'); assert.equal(report.reducedProcessNoRenderer,true);await shot('process-reduced.png');
    await send('Emulation.setEmulatedMedia',{features:[]});await send('Emulation.setScriptExecutionDisabled',{value:true});await send('Page.navigate',{url:`${origin}/pt-br/awwwards-preview/ember`});await sleep(2000);report.noJsHero=await evaluate('!!document.querySelector("[data-hero-identity] img") && !document.querySelector("[data-hero-identity] img").hidden');await shot('hero-no-js.png');await send('Emulation.setScriptExecutionDisabled',{value:false});assert.equal(report.noJsHero,true);
  } else throw Error(`Unknown mode ${mode}`);
  report.pass = true;
} catch (error) { report.pass = false; report.failure = String(error); process.exitCode = 1; }
finally { mkdirSync(dirname(output), { recursive: true }); writeFileSync(output, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2)); ws?.close(); browser.kill(); }
