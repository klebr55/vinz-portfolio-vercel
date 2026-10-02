import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const option = (name, fallback) => { const index = process.argv.indexOf(name); return index < 0 ? fallback : process.argv[index + 1]; };
const origin = option('--origin', 'http://localhost:3002');
const mode = option('--mode', 'input');
const output = resolve(option('--output', `docs/awwwards/evidence-narrative/electric-identity/${mode}.json`));
const port = 9468;
const temp = mkdtempSync(join(tmpdir(), 'identity-check-'));
const browser = spawn(process.env.CHROME_PATH || 'F:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--no-first-run', '--disable-extensions', '--disable-gpu', '--enable-unsafe-swiftshader', '--remote-allow-origins=*', `--remote-debugging-port=${port}`, `--user-data-dir=${temp}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws;
let id = 0;
const calls = new Map();
const report = { mode, origin, method: 'Native Chrome CDP, trusted browser input, software WebGL', checks: {}, errors: [] };
const send = (method, params = {}) => new Promise((resolve, reject) => { const key = ++id; calls.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); });
const evaluate = async expression => { const value = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (value.exceptionDetails) throw Error(value.exceptionDetails.text); return value.result.value; };
async function until(expression, timeout = 30000) { const start = Date.now(); while (Date.now() - start < timeout) { if (await evaluate(expression)) return; await sleep(150); } throw Error(`Timed out: ${expression}`); }
async function visit(hash = '') { await send('Page.navigate', { url: `${origin}/pt-br/awwwards-preview/ember${hash}` }); await until('Boolean(window.__lenis) && document.readyState === "complete"'); await sleep(900); }
async function wheel(delta) { const before = await evaluate('scrollY'); await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 650, y: 400, deltaX: 0, deltaY: delta }); await sleep(1700); return (await evaluate('scrollY')) - before; }
async function click(selector) { const point = await evaluate(`(() => { const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`); await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point }); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point }); }
try {
  let endpoint;
  for (let n = 0; n < 60; n++) { try { endpoint = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(x => x.type === 'page')?.webSocketDebuggerUrl; } catch {} if (endpoint) break; await sleep(150); }
  if (!endpoint) throw Error('Chrome unavailable');
  ws = new WebSocket(endpoint);
  ws.onmessage = event => { const message = JSON.parse(event.data); if (message.method === 'Runtime.exceptionThrown') report.errors.push(message.params.exceptionDetails.text); const call = calls.get(message.id); if (!call) return; calls.delete(message.id); if (message.error) call.reject(Error(message.error.message)); else call.resolve(message.result); };
  await new Promise(r => ws.onopen = r);
  await send('Page.enable'); await send('Runtime.enable');
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
  } else if (mode === 'process') {
    await visit('#process');
    report.scenePresent = await evaluate('Boolean(document.querySelector("#process canvas"))');
    assert.equal(report.scenePresent, true);
  } else throw Error(`Unknown mode ${mode}`);
  report.pass = true;
} catch (error) { report.pass = false; report.failure = String(error); process.exitCode = 1; }
finally { mkdirSync(dirname(output), { recursive: true }); writeFileSync(output, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2)); ws?.close(); browser.kill(); }
