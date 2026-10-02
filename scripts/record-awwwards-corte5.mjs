import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chrome = process.env.CHROME_PATH || 'chrome';
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const root = resolve(process.cwd());
const origin = process.env.AWWWARDS_ORIGIN || 'http://localhost:3002';
const evidence = join(root, 'docs', 'awwwards', 'evidence-narrative', 'corte5');
const temp = mkdtempSync(join(tmpdir(), 'corte5-evidence-'));
const frames = join(temp, 'frames');
mkdirSync(evidence, { recursive: true });
mkdirSync(frames);
const port = 9465;
const browser = spawn(chrome, ['--headless=new', '--no-first-run', '--disable-extensions', '--hide-scrollbars', '--mute-audio', '--disable-gpu', '--enable-unsafe-swiftshader', '--remote-allow-origins=*', `--remote-debugging-port=${port}`, `--user-data-dir=${join(temp, 'profile')}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws;
let nextId = 1;
const pending = new Map();
let recording = null;
const audit = { date: '2026-10-01', method: 'Chrome CDP, software WebGL; actual screencast timestamps, VFR without interpolation', journeys: [], checks: {}, errors: [], failedResponses: [] };
async function check(name, expression) {
  const value = await evaluate(expression);
  audit.checks[name] = value;
  console.log(name, JSON.stringify(value));
  if (value.pass === false) throw new Error(`Browser check failed: ${name}`);
  return value;
}
async function send(method, params = {}) {
  return new Promise((resolveCall, rejectCall) => {
    const id = nextId++;
    pending.set(id, { resolveCall, rejectCall });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function until(predicate, tries = 80) {
  for (let i = 0; i < tries; i++) {
    if (await evaluate(predicate)) return;
    await sleep(150);
  }
  throw new Error(`Timed out: ${predicate}`);
}
async function viewport(width, height, mobile = false) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
}
async function visit(path) {
  await send('Page.navigate', { url: new URL(path, origin).href });
  await until('document.readyState === "complete" && Boolean(document.querySelector("[data-story-chapter]"))');
  await until('Boolean(window.__lenis) || matchMedia("(prefers-reduced-motion: reduce)").matches');
  await sleep(850);
}
async function shot(name, quality = 82) {
  const screenshot = await send('Page.captureScreenshot', { format: 'webp', quality, captureBeyondViewport: false });
  const bytes = Buffer.from(screenshot.data, 'base64');
  writeFileSync(join(evidence, name), bytes);
  console.log(`${name}: ${bytes.length} bytes`);
}
async function scrollTo(id) {
  await evaluate(`(() => { const heading = document.querySelector('#${id} [data-story-read]'); const top = heading.getBoundingClientRect().top + scrollY - Math.min(170, innerHeight * .17); window.__lenis.scrollTo(top, { immediate: true, force: true }); window.scrollTo(0, top); return true; })()`);
  await sleep(260);
}

async function recordJourney(name) {
  const directory = join(temp, name);
  mkdirSync(directory);
  recording = { directory, frames: [] };
  await send('Page.startScreencast', { format: 'jpeg', quality: 78, maxWidth: 1440, maxHeight: 900, everyNthFrame: 2 });
  await evaluate(`(async () => {
    const heading = document.querySelector('#sdimt [data-story-read]');
    const target = heading.getBoundingClientRect().top + scrollY - Math.min(170, innerHeight * .17);
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const move = (y, duration) => new Promise(r => window.__lenis.scrollTo(y, { duration, force: true, onComplete: r }));
    await wait(650);
    await move(target, 4.5);
    await wait(900);
    const nks = document.querySelector('#nks').getBoundingClientRect().top + scrollY + 100;
    await move(nks, 2.5);
    await wait(1200);
    await move(target, 2.2);
    await wait(450);
    await move(0, 2.5);
    await wait(650);
    document.querySelector('a[href="#sdimt"]').click();
    await wait(1600);
    return true;
  })()`);
  await send('Page.stopScreencast');
  const captured = recording;
  recording = null;
  if (captured.frames.length < 10) throw new Error('Insufficient screencast frames');
  const concat = ['ffconcat version 1.0'];
  captured.frames.forEach((frame, index) => {
    concat.push(`file '${frame.path.replaceAll('\\', '/')}'`);
    const duration = index + 1 < captured.frames.length ? Math.max(.001, captured.frames[index + 1].time - frame.time) : .1;
    concat.push(`duration ${duration.toFixed(6)}`);
  });
  concat.push(`file '${captured.frames.at(-1).path.replaceAll('\\', '/')}'`);
  const manifest = join(directory, 'frames.ffconcat');
  writeFileSync(manifest, concat.join('\n'));
  const result = spawnSync(ffmpeg, ['-y', '-v', 'error', '-safe', '0', '-f', 'concat', '-i', manifest, '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-vsync', 'vfr', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(evidence, name)], { windowsHide: true, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  console.log(`${name}: ${captured.frames.length} frames, ${(captured.frames.at(-1).time - captured.frames[0].time).toFixed(2)} seconds`);
  audit.journeys.push({ name, frames: captured.frames.length, seconds: captured.frames.at(-1).time - captured.frames[0].time });
}

try {
  let endpoint;
  for (let i = 0; i < 60; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      endpoint = targets.find(item => item.type === 'page')?.webSocketDebuggerUrl;
      if (endpoint) break;
    } catch {}
    await sleep(150);
  }
  if (!endpoint) throw new Error('Chrome CDP did not start');
  ws = new WebSocket(endpoint);
  ws.onerror = event => console.error('WebSocket error', event.message ?? event);
  ws.onclose = event => console.error('WebSocket closed', event.code, event.reason);
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') audit.errors.push(message.params.exceptionDetails);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) audit.failedResponses.push({ url: message.params.response.url, status: message.params.response.status });
    if (message.method === 'Page.screencastFrame') {
      if (recording) {
        const filename = join(recording.directory, `frame-${String(recording.frames.length).padStart(5, '0')}.jpg`);
        writeFileSync(filename, Buffer.from(message.params.data, 'base64'));
        recording.frames.push({ path: filename, time: message.params.metadata.timestamp });
      }
      send('Page.screencastFrameAck', { sessionId: message.params.sessionId }).catch(() => undefined);
      return;
    }
    if (!message.id || !pending.has(message.id)) return;
    const callback = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callback.rejectCall(new Error(message.error.message));
    else callback.resolveCall(message.result);
  };
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__glPaintCounts = new WeakMap(); for (const Type of [WebGLRenderingContext, WebGL2RenderingContext]) { for (const method of ['drawArrays', 'drawElements']) { const original = Type.prototype[method]; Type.prototype[method] = function(...args) { window.__glPaintCounts.set(this.canvas, (window.__glPaintCounts.get(this.canvas) || 0) + 1); return original.apply(this, args); }; } }` });
  await viewport(1440, 900);
  await visit('/pt-br/awwwards-preview/ember');
  await evaluate(`(() => { const style = document.createElement('style'); style.id='poster-capture'; style.textContent='[class*="heroCopy"],[class*="navShell"],[class*="checkpoint"],[class*="heroFolio"],nextjs-portal{visibility:hidden!important}'; document.head.append(style); return true; })()`);
  const poster = await send('Page.captureScreenshot', { format: 'webp', quality: 86, captureBeyondViewport: false });
  if (process.argv.includes('--write-poster')) writeFileSync(join(root, 'public', 'awwwards', 'plasma-poster.webp'), Buffer.from(poster.data, 'base64'));
  await evaluate('document.querySelector("#poster-capture").remove(); true');
  await shot('01-hero-desktop.webp');
  await recordJourney('04-desktop-scroll.mp4');
  await evaluate('window.__lenis.scrollTo(1250, { immediate: true, force: true }); true');
  await sleep(250);
  await shot('02a-sdimt-arrival.webp');
  await scrollTo('sdimt');
  await shot('02-sdimt-desktop.webp');
  await scrollTo('nks');
  await shot('03-nks-desktop.webp');
  await evaluate(`window.__lenis.scrollTo(document.querySelector('#nks').getBoundingClientRect().top + scrollY + 20, { immediate: true, force: true }); true`);
  await sleep(1500);
  await check('nksSceneExposed', `(() => { const visual = document.querySelector('[class*=openingVisual]').getBoundingClientRect(); const canvas = document.querySelector('#nks canvas[data-engine]'); return { pass: visual.bottom <= 1 && Boolean(canvas), openingBottom: visual.bottom, notebookCanvas: Boolean(canvas) }; })()`);
  await shot('03-nks-laptop-desktop.webp');
  await visit('/pt-br/awwwards-preview/ember?evidence=direct#contact');
  await check('contactDirect', `({ pass: location.hash === '#contact' && document.querySelector('[aria-current=location]')?.getAttribute('href') === '#contact', headingTop: document.querySelector('#contact h2').getBoundingClientRect().top })`);
  await send('Page.reload');
  await until(`document.readyState === 'complete' && document.querySelector('[aria-current=location]')?.getAttribute('href') === '#contact'`);
  await check('contactReload', `({ pass: location.hash === '#contact' && document.querySelector('#contact h2').getBoundingClientRect().top < 180 })`);
  await visit('/pt-br/awwwards-preview/ember?evidence=nav');
  await evaluate(`document.querySelector('a[href="#sdimt"]').click(); true`);
  await sleep(1400);
  await check('completedJumpFocus', `({ pass: document.activeElement.id === 'sdimt-title', focused: document.activeElement.id, hash: location.hash })`);
  await evaluate(`document.querySelector('a[href="#nks"]').click(); true`);
  await sleep(1300);
  await evaluate('history.back(); true');
  await sleep(450);
  await check('historyBack', `({ pass: location.hash === '#sdimt' && document.querySelector('[aria-current=location]')?.getAttribute('href') === '#sdimt' })`);
  await evaluate('history.forward(); true');
  await sleep(450);
  await check('historyForward', `({ pass: location.hash === '#nks' && document.querySelector('[aria-current=location]')?.getAttribute('href') === '#nks' })`);
  await viewport(1024, 768);
  await sleep(500);
  await evaluate(`document.querySelector('a[lang="en"]').click(); true`);
  await until(`location.pathname.startsWith('/en/') && document.querySelector('[aria-current=location]')?.getAttribute('href') === '#nks'`);
  await sleep(450);
  await check('localeAfterResize', `({ pass: location.hash === '#nks' && document.querySelector('#nks h2').getBoundingClientRect().top < 180, width: innerWidth, documentWidth: document.documentElement.scrollWidth })`);
  await shot('10-nks-en-1024.webp');
  await viewport(1440, 900);
  await visit('/en/awwwards-preview/ember?evidence=en');
  await shot('11-hero-en-desktop.webp');
  await recordJourney('04c-en-scroll.mp4');
  await visit('/en/awwwards-preview/ember?evidence=wheel');
  await evaluate(`document.querySelector('a[href="#contact"]').click(); true`);
  await sleep(100);
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 800, y: 600, deltaX: 0, deltaY: 160 });
  await sleep(1300);
  await check('wheelInterrupt', `({ pass: location.hash !== '#contact' && !document.activeElement.closest('#contact'), hash: location.hash, focused: document.activeElement.tagName })`);
  await visit('/pt-br/awwwards-preview/ember?evidence=lifecycle');
  await evaluate(`window.__heroCanvas = document.querySelector('[class*=openingVisual] canvas'); window.__contactCanvas = document.querySelector('[class*=contactPlasma] canvas'); window.__paintStart = [window.__glPaintCounts.get(window.__heroCanvas) || 0, window.__glPaintCounts.get(window.__contactCanvas) || 0]; true`);
  await sleep(800);
  await check('rendererExposure', `(() => { const deltas = [window.__glPaintCounts.get(window.__heroCanvas) - window.__paintStart[0], (window.__glPaintCounts.get(window.__contactCanvas) || 0) - window.__paintStart[1]]; return { pass: deltas[0] > 0 && deltas[1] === 0, drawCalls: deltas }; })()`);
  await evaluate(`document.querySelector('[class*=motionToggle]').click(); true`);
  await sleep(100);
  await evaluate(`window.__paintStart = window.__glPaintCounts.get(window.__heroCanvas); true`);
  await sleep(600);
  await check('plasmaPause', `({ pass: window.__glPaintCounts.get(window.__heroCanvas) === window.__paintStart })`);
  await evaluate(`document.querySelector('[class*=motionToggle]').click(); true`);
  await evaluate(`Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); window.__paintStart = window.__glPaintCounts.get(window.__heroCanvas); true`);
  await sleep(600);
  await check('syntheticHiddenTab', `({ pass: window.__glPaintCounts.get(window.__heroCanvas) === window.__paintStart })`);
  await evaluate(`delete document.visibilityState; delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); true`);
  await sleep(600);
  await check('syntheticVisibleTab', `({ pass: window.__glPaintCounts.get(window.__heroCanvas) > window.__paintStart })`);
  await evaluate(`window.__heroCanvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext(); true`);
  await sleep(450);
  await check('webglContextLoss', `({ pass: document.querySelector('main').dataset.plasmaUnavailable === 'true' && getComputedStyle(document.querySelector('[class*=plasmaPoster]')).backgroundImage.includes('plasma-poster.webp'), canvasVisibility: window.__heroCanvas.style.visibility })`);
  await shot('12-webgl-fallback.webp');

  await viewport(360, 800, true);
  await visit('/pt-br/awwwards-preview/ember?evidence=mobile');
  await shot('05-hero-mobile.webp');
  await recordJourney('04b-mobile-scroll.mp4');
  await scrollTo('sdimt');
  await shot('06-sdimt-mobile.webp');
  await visit('/en/awwwards-preview/ember?evidence=mobile#nks');
  await shot('07-nks-en-mobile.webp');
  const metrics = await evaluate('({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, hash: location.hash, active: document.querySelector("[aria-current=location]")?.getAttribute("href"), nksTop: document.querySelector("#nks [data-story-read]")?.getBoundingClientRect().top })');
  console.log('mobile direct entry', JSON.stringify(metrics));
  audit.checks.mobileDirect = metrics;
  if (metrics.width !== metrics.documentWidth || metrics.active !== '#nks' || metrics.nksTop > 170) throw new Error('Mobile direct-entry/overflow check failed');
  await evaluate(`document.querySelector('[class*=menuButton]').click(); true`);
  await sleep(120);
  await check('mobileMenu', `({ pass: document.querySelector('[class*=menuButton]').getAttribute('aria-expanded') === 'true' && getComputedStyle(document.querySelector('#story-nav-links')).display !== 'none' })`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(120);
  await check('escapeFocus', `({ pass: document.activeElement.matches('[class*=menuButton]') && document.activeElement.getAttribute('aria-expanded') === 'false' })`);
  await evaluate(`document.querySelector('a[href="#contact"]').click(); true`);
  await sleep(100);
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 500 }] });
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(1200);
  await check('touchInterrupt', `({ pass: location.hash !== '#contact' && !document.activeElement.closest('#contact'), hash: location.hash })`);
  await viewport(390, 844, true);
  await visit('/en/awwwards-preview/ember?evidence=390');
  await shot('13-hero-en-mobile390.webp');
  await check('mobile390', `({ pass: innerWidth === document.documentElement.scrollWidth, width: innerWidth })`);
  await viewport(360, 800, true);

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await visit('/pt-br/awwwards-preview/ember?evidence=reduced#sdimt');
  const reduced = await evaluate('({ reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, lenis: Boolean(window.__lenis), visual: getComputedStyle(document.querySelector("[class*=openingVisual]")).display, fallback: getComputedStyle(document.querySelector("[class*=sdimtFallback]")).display, active: document.querySelector("[aria-current=location]")?.getAttribute("href") })');
  console.log('reduced motion', JSON.stringify(reduced));
  audit.checks.reduced = reduced;
  if (!reduced.reduced || reduced.lenis || reduced.visual !== 'none' || reduced.fallback !== 'block' || reduced.active !== '#sdimt') throw new Error('Reduced-motion check failed');
  await shot('08-reduced-motion-mobile.webp');
  await send('Emulation.setEmulatedMedia', { features: [] });

  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await send('Page.navigate', { url: new URL('/pt-br/awwwards-preview/ember?evidence=nojs', origin).href });
  await sleep(1300);
  const documentNode = await send('DOM.getDocument');
  const headings = await send('DOM.querySelectorAll', { nodeId: documentNode.root.nodeId, selector: 'h1' });
  const chapters = await send('DOM.querySelectorAll', { nodeId: documentNode.root.nodeId, selector: '[data-story-chapter]' });
  const links = await send('DOM.querySelectorAll', { nodeId: documentNode.root.nodeId, selector: 'a[href^="#"]' });
  const noJs = { h1: headings.nodeIds.length, chapters: chapters.nodeIds.length, anchors: links.nodeIds.length };
  console.log('no JS', JSON.stringify(noJs));
  audit.checks.noJs = noJs;
  if (noJs.h1 !== 1 || noJs.chapters !== 10 || noJs.anchors < 10) throw new Error('SSR/no-JS content check failed');
  await shot('09-no-js-mobile.webp');
  const cta = await send('DOM.querySelector', { nodeId: documentNode.root.nodeId, selector: '[class*=primaryLink]' });
  const box = await send('DOM.getBoxModel', { nodeId: cta.nodeId });
  const content = box.model.content;
  const x = (content[0] + content[4]) / 2;
  const y = (content[1] + content[5]) / 2;
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  await sleep(300);
  const nativeHistory = await send('Page.getNavigationHistory');
  audit.checks.nativeAnchor = { pass: nativeHistory.entries[nativeHistory.currentIndex].url.endsWith('#sdimt') };
  if (!audit.checks.nativeAnchor.pass) throw new Error('Native no-JS anchor failed');
  await shot('09b-no-js-sdimt-mobile.webp');
  await send('Emulation.setScriptExecutionDisabled', { value: false });
} finally {
  writeFileSync(join(evidence, 'audit.json'), JSON.stringify(audit, null, 2));
  ws?.close();
  browser.kill();
}
