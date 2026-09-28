const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const FFMPEG_PATH = 'F:\\Users\\Vinz\\AppData\\Local\\Programs\\LNV\\Stremio-4\\ffmpeg.exe';
const CHROME_PATH = 'F:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'docs', 'awwwards', 'evidence-laptop');

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-evidence-'));
  const framesDirDesktop = path.join(tmpDir, 'frames-desktop');
  const framesDirMobile = path.join(tmpDir, 'frames-mobile');
  fs.mkdirSync(framesDirDesktop, { recursive: true });
  fs.mkdirSync(framesDirMobile, { recursive: true });

  const chromeArgs = [
    '--remote-debugging-port=9455',
    '--headless=new',
    '--disable-extensions',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--autoplay-policy=no-user-gesture-required',
    '--enable-webgl',
    '--enable-gpu',
    `--user-data-dir=${tmpDir}`,
    'http://localhost:3001/pt-br/awwwards-preview/ember'
  ];

  console.log('Launching Chrome on port 9455...');
  const proc = spawn(CHROME_PATH, chromeArgs);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9455/json/list');
      const list = await res.json();
      const pageTarget = list && list.find(t => t.type === 'page' && t.url.includes('localhost'));
      if (pageTarget && pageTarget.webSocketDebuggerUrl) {
        wsUrl = pageTarget.webSocketDebuggerUrl;
        console.log('Connected to target:', pageTarget.url);
        break;
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Failed to connect to Chrome');
    proc.kill();
    return;
  }

  const ws = new WebSocket(wsUrl);
  let msgId = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg.result, msg.error);
      callbacks.delete(msg.id);
    }
  };

  await new Promise(resolve => ws.onopen = resolve);

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, (result, error) => {
        if (error) reject(error);
        else resolve(result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');

  async function waitForPageReady() {
    for (let i = 0; i < 50; i++) {
      await new Promise(r => setTimeout(r, 200));
      const res = await send('Runtime.evaluate', {
        expression: 'Boolean(document.querySelector("canvas") && document.querySelector("video")?.readyState >= 2)',
        returnByValue: true
      });
      if (res.result?.value) {
        await new Promise(r => setTimeout(r, 600));
        return true;
      }
    }
    return false;
  }

  async function scrollToProgress(progress, waitMs = 70) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const seq = document.querySelector('[class*="sequence"]');
        const maxScroll = (seq ? seq.offsetHeight : (window.innerHeight * 5.6)) - window.innerHeight;
        const targetY = Math.round(${progress} * maxScroll);
        if (window.__lenis) {
          window.__lenis.scrollTo(targetY, { immediate: true });
        } else {
          window.scrollTo(0, targetY);
        }
        window.dispatchEvent(new Event('scroll'));
      })()`
    });
    await new Promise(r => setTimeout(r, waitMs));
  }

  async function captureShot(filename, clip = null) {
    const params = { format: 'jpeg', quality: 85 };
    if (clip) params.clip = clip;
    const shot = await send('Page.captureScreenshot', params);
    const buf = Buffer.from(shot.data, 'base64');
    const dest = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(dest, buf);
    console.log(`Saved ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  async function captureFrameToDir(dir, index) {
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    const buf = Buffer.from(shot.data, 'base64');
    const num = String(index).padStart(4, '0');
    fs.writeFileSync(path.join(dir, `frame_${num}.jpg`), buf);
  }

  // ==========================================
  // PHASE 1: DESKTOP (1440 x 900)
  // ==========================================
  console.log('\n--- PHASE 1: DESKTOP (1440 x 900) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await waitForPageReady();
  await scrollToProgress(0, 500);

  // 1. Milestone Screenshots
  console.log('Capturing Desktop milestones...');
  await scrollToProgress(0.0, 300);
  await captureShot('01-hero-desktop.jpg');

  await scrollToProgress(0.32, 250);
  await captureShot('02-notebook-frontal-motion-desktop.jpg');

  await scrollToProgress(0.72, 250);
  await captureShot('03-zoom-start-desktop.jpg');

  await scrollToProgress(0.75, 200);
  await captureShot('07-screen-edges-detail-desktop.jpg', { x: 290, y: 180, width: 860, height: 540, scale: 1 });

  await scrollToProgress(0.91, 250);
  await captureShot('04-screen-fullscreen-desktop.jpg');

  // Handover adjacent frames (p=0.935 in 3D canvas vs p=0.945 in HTML)
  await scrollToProgress(0.935, 250);
  await captureShot('handover-before-desktop.jpg');

  await scrollToProgress(0.945, 250);
  await captureShot('05-handover-desktop.jpg');
  await captureShot('handover-after-desktop.jpg');

  await scrollToProgress(0.98, 250);
  await captureShot('06-case-established-desktop.jpg');

  // Reverse back to hero
  await scrollToProgress(0.0, 350);
  await captureShot('reverse-hero-desktop.jpg');

  // 2. Continuous Desktop Video (perceptible pacing through chapters)
  console.log('Recording Desktop video frames (ida, pausa, volta rapida, pausa intermediaria, nova ida)...');
  let frameIdx = 1;

  // Initial pause on hero (20 frames)
  for (let i = 0; i < 20; i++) {
    await captureFrameToDir(framesDirDesktop, frameIdx++);
  }

  // Scrub ida: 0.0 -> 1.0 (120 steps)
  for (let i = 0; i <= 120; i++) {
    const p = i / 120;
    await scrollToProgress(p, 50);
    await captureFrameToDir(framesDirDesktop, frameIdx++);
  }

  // Pausa no case details (24 frames)
  for (let i = 0; i < 24; i++) {
    await captureFrameToDir(framesDirDesktop, frameIdx++);
  }

  // Volta rápida: 1.0 -> 0.0 (35 steps)
  for (let i = 35; i >= 0; i--) {
    const p = i / 35;
    await scrollToProgress(p, 40);
    await captureFrameToDir(framesDirDesktop, frameIdx++);
  }

  // Pausa intermediária na hero (20 frames)
  for (let i = 0; i < 20; i++) {
    await captureFrameToDir(framesDirDesktop, frameIdx++);
  }

  // Nova ida: 0.0 -> 0.95 (50 steps)
  for (let i = 0; i <= 50; i++) {
    const p = (i / 50) * 0.95;
    await scrollToProgress(p, 45);
    await captureFrameToDir(framesDirDesktop, frameIdx++);
  }

  console.log(`Captured ${frameIdx - 1} desktop frames. Encoding video with FFmpeg...`);
  const desktopMp4 = path.join(OUTPUT_DIR, 'passagem-nks-desktop.mp4');
  const ffmpegCmdDesktop = `"${FFMPEG_PATH}" -y -framerate 30 -i "${framesDirDesktop}\\frame_%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 22 -preset medium "${desktopMp4}"`;
  execSync(ffmpegCmdDesktop, { stdio: 'inherit' });
  console.log('Desktop video saved:', desktopMp4);

  // English Hero Desktop
  console.log('Navigating to EN preview...');
  await send('Page.navigate', { url: 'http://localhost:3001/en/awwwards-preview/ember' });
  await waitForPageReady();
  await scrollToProgress(0.0, 300);
  await captureShot('hero-en-desktop.jpg');

  // Reduced motion capture
  console.log('Capturing reduced motion fallback...');
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await send('Page.navigate', { url: 'http://localhost:3001/pt-br/awwwards-preview/ember' });
  await new Promise(r => setTimeout(r, 600));
  await captureShot('reduced-motion-desktop.jpg');
  await send('Emulation.setEmulatedMedia', { features: [] });

  // WebGL unavailable capture
  console.log('Capturing WebGL context loss fallback...');
  await send('Page.navigate', { url: 'http://localhost:3001/pt-br/awwwards-preview/ember' });
  await waitForPageReady();
  await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
      const ext = gl?.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    })()`
  });
  await new Promise(r => setTimeout(r, 500));
  await captureShot('webgl-unavailable-desktop.jpg');

  // ==========================================
  // PHASE 2: MOBILE (390 x 844, DPR 2)
  // ==========================================
  console.log('\n--- PHASE 2: MOBILE (390 x 844, DPR 2) ---');
  await send('Page.navigate', { url: 'http://localhost:3001/pt-br/awwwards-preview/ember' });
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });

  await waitForPageReady();
  await scrollToProgress(0, 500);

  // 1. Mobile Milestones
  console.log('Capturing Mobile milestones...');
  await scrollToProgress(0.0, 300);
  await captureShot('01-hero-mobile.jpg');

  await scrollToProgress(0.32, 250);
  await captureShot('02-notebook-frontal-motion-mobile.jpg');

  await scrollToProgress(0.72, 250);
  await captureShot('03-zoom-start-mobile.jpg');

  await scrollToProgress(0.91, 250);
  await captureShot('04-screen-fullscreen-mobile.jpg');

  // Mobile Handover adjacent frames
  await scrollToProgress(0.935, 250);
  await captureShot('handover-before-mobile.jpg');

  await scrollToProgress(0.945, 250);
  await captureShot('05-handover-mobile.jpg');
  await captureShot('handover-after-mobile.jpg');

  await scrollToProgress(0.98, 250);
  await captureShot('06-case-established-mobile.jpg');

  // Reverse back to mobile hero
  await scrollToProgress(0.0, 350);
  await captureShot('reverse-hero-mobile.jpg');

  // 2. Continuous Mobile Video
  console.log('Recording Mobile video frames...');
  let mobFrameIdx = 1;

  for (let i = 0; i < 20; i++) {
    await captureFrameToDir(framesDirMobile, mobFrameIdx++);
  }

  // Scrub ida: 0.0 -> 1.0 (120 steps)
  for (let i = 0; i <= 120; i++) {
    const p = i / 120;
    await scrollToProgress(p, 50);
    await captureFrameToDir(framesDirMobile, mobFrameIdx++);
  }

  // Pausa no case details (24 frames)
  for (let i = 0; i < 24; i++) {
    await captureFrameToDir(framesDirMobile, mobFrameIdx++);
  }

  // Volta rápida: 1.0 -> 0.0 (35 steps)
  for (let i = 35; i >= 0; i--) {
    const p = i / 35;
    await scrollToProgress(p, 40);
    await captureFrameToDir(framesDirMobile, mobFrameIdx++);
  }

  // Pausa intermediária (20 frames)
  for (let i = 0; i < 20; i++) {
    await captureFrameToDir(framesDirMobile, mobFrameIdx++);
  }

  // Nova ida: 0.0 -> 0.95 (50 steps)
  for (let i = 0; i <= 50; i++) {
    const p = (i / 50) * 0.95;
    await scrollToProgress(p, 45);
    await captureFrameToDir(framesDirMobile, mobFrameIdx++);
  }

  console.log(`Captured ${mobFrameIdx - 1} mobile frames. Encoding video with FFmpeg...`);
  const mobileMp4 = path.join(OUTPUT_DIR, 'passagem-nks-mobile.mp4');
  const ffmpegCmdMobile = `"${FFMPEG_PATH}" -y -framerate 30 -i "${framesDirMobile}\\frame_%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium "${mobileMp4}"`;
  execSync(ffmpegCmdMobile, { stdio: 'inherit' });
  console.log('Mobile video saved:', mobileMp4);

  // ==========================================
  // PHASE 3: COMPACT MOBILE (360 x 800)
  // ==========================================
  console.log('\n--- PHASE 3: COMPACT MOBILE (360 x 800) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 360,
    height: 800,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: 'http://localhost:3001/pt-br/awwwards-preview/ember' });
  await waitForPageReady();
  await scrollToProgress(0.0, 300);
  await captureShot('01-hero-360.jpg');

  await scrollToProgress(0.945, 250);
  await captureShot('05-handover-360.jpg');

  ws.close();
  proc.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
  console.log('\n--- ALL EVIDENCE GENERATED SUCCESSFULLY ---');
}

main().catch(err => {
  console.error('Error generating evidence:', err);
  process.exit(1);
});
