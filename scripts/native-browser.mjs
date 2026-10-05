import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function openBrowser(output, port=9471) {
 output=resolve(output);mkdirSync(output,{recursive:true});
 const temp=mkdtempSync(join(tmpdir(),'business-check-'));
 const browser=spawn(process.env.CHROME_PATH || 'F:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--disable-extensions','--use-gl=angle','--use-angle=d3d11-warp','--disable-gpu-sandbox','--no-sandbox','--disable-features=RendererCodeIntegrity,NetworkServiceSandbox','--enable-unsafe-swiftshader','--remote-allow-origins=*',`--remote-debugging-port=${port}`,`--user-data-dir=${temp}`,'about:blank'],{stdio:['ignore','ignore','pipe'],windowsHide:true});
 browser.stderr.on('data', data => { if (process.env.DEBUG_BROWSER) console.error(String(data)); });
 let endpoint,ws,id=0,recording;
 const calls=new Map(),errors=[],requests=[],events=new Map();
 for(let i=0;i<60;i++){try{endpoint=(await(await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(p=>p.type==='page')?.webSocketDebuggerUrl;}catch{}if(endpoint)break;await sleep(150);}
 if(!endpoint){browser.kill();throw Error('Chrome CDP unavailable');}
 const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;const timer=setTimeout(()=>{calls.delete(key);reject(Error(`CDP timeout: ${method}`));},15000);calls.set(key,{resolve,reject,timer});ws.send(JSON.stringify({id:key,method,params}));});
 ws=new WebSocket(endpoint);
 ws.onmessage=event=>{const message=JSON.parse(event.data);if(process.env.DEBUG_BROWSER)console.error(message.id,message.method);
  if(message.method==='Page.screencastFrame'){
   if(recording){const data=message.params.data;recording.frames.push({time:message.params.metadata.timestamp});recording.chain=recording.chain.then(()=>evaluate(`(async()=>{const capture=window.__nativeCapture;const image=await createImageBitmap(await(await fetch('data:image/jpeg;base64,${data}')).blob());capture.context.drawImage(image,0,0,capture.canvas.width,capture.canvas.height);image.close();capture.track.requestFrame();})()`));}
   send('Page.screencastFrameAck',{sessionId:message.params.sessionId}).catch(()=>{});return;
  }
  if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails);
  if(message.method==='Network.requestWillBeSent')requests.push(message.params.request.url);
  events.get(message.method)?.(message.params);
  const call=calls.get(message.id);if(!call)return;clearTimeout(call.timer);calls.delete(message.id);message.error?call.reject(Error(message.error.message)):call.resolve(message.result);
 };
 await new Promise(r=>ws.onopen=r);
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 const evaluate=async expression=>{const value=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(value.exceptionDetails)throw Error(JSON.stringify(value.exceptionDetails));return value.result.value;};
 const until=async(expression,timeout=20000)=>{const start=Date.now();while(Date.now()-start<timeout){if(await evaluate(expression))return;await sleep(150);}throw Error(`Timed out: ${expression}`);};
 return {send,evaluate,until,errors,requests,on:(name,callback)=>events.set(name,callback),
  async viewport(width,height,mobile=false){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});},
  async visit(url){await send('Page.navigate',{url:'about:blank'});await sleep(100);await send('Page.navigate',{url});await until(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)} && !!document.querySelector('main')`);await sleep(700);},
  async shot(name){const result=await send('Page.captureScreenshot',{format:'png'});writeFileSync(join(output,name),Buffer.from(result.data,'base64'));},
  async wheel(delta){await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:200,y:200,deltaX:0,deltaY:delta});await sleep(650);},
  async key(key){await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:{PageDown:34,PageUp:33,Home:36,End:35}[key]});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:{PageDown:34,PageUp:33,Home:36,End:35}[key]});await sleep(700);},
  async click(selector){const point=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});await sleep(300);},
  async startRecording(){
   await evaluate(`(()=>{const canvas=document.createElement('canvas');const scale=Math.min(1,1440/innerWidth,900/innerHeight);canvas.width=Math.round(innerWidth*scale);canvas.height=Math.round(innerHeight*scale);const stream=canvas.captureStream(0),chunks=[];const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8',videoBitsPerSecond:1500000});const done=new Promise(resolve=>{recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onstop=()=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(new Blob(chunks,{type:'video/webm'}));};});window.__nativeCapture={canvas,context:canvas.getContext('2d'),recorder,track:stream.getVideoTracks()[0],done};recorder.start();})()`);
   recording={frames:[],chain:Promise.resolve()};await send('Page.startScreencast',{format:'jpeg',quality:75,maxWidth:1440,maxHeight:900,everyNthFrame:2});
  },
  async stopRecording(name){
   await send('Page.stopScreencast');const captured=recording;recording=null;await captured.chain;
   const base64=await evaluate(`(async()=>{const capture=window.__nativeCapture;capture.recorder.stop();const data=await capture.done;capture.track.stop();delete window.__nativeCapture;return data;})()`);
   name=name.replace(/\.mp4$/,'.webm');writeFileSync(join(output,name),Buffer.from(base64,'base64'));
   return {name,frames:captured.frames.length,seconds:captured.frames.at(-1).time-captured.frames[0].time,timestamps:captured.frames.map(frame=>frame.time),method:'Actual Chrome CDP screencast streamed live to detached Canvas/MediaRecorder VP8 WebM; no interpolation. Capture adds browser encode work.'};
  },
  close(){ws.close();browser.kill();},
 };
}
