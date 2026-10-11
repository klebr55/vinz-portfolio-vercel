import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { openBrowser, sleep } from './native-browser.mjs';
const phase=process.argv[2]||'before';
const output='docs/awwwards/evidence-narrative/process-rotato-polish';
const b=await openBrowser(output);
const report={phase,errors:b.errors};
const visit=hash=>b.visit(`http://localhost:3004/pt-br/awwwards-preview/ember${hash}`);
const move=async y=>{await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:180,y:200,deltaX:0,deltaY:1});await b.evaluate(`window.__lenis.scrollTo(${y},{immediate:true,force:true})`);await sleep(250);};
const processState=()=>b.evaluate(`(()=>{const s=document.querySelector('#process');return{top:s.getBoundingClientRect().top,ready:s.querySelector('[class*=processCanvas]')?.style.opacity==='1',canvas:!!s.querySelector('canvas'),waiting:!!s.querySelector('[class*=processWaiting]')}})()`);
try{
 await b.viewport(1440,900);await visit('#sdimt');
 const top=await b.evaluate(`document.querySelector('#process').getBoundingClientRect().top+scrollY`);
 await move(top-1060);await sleep(1600);report.prepared=await processState();
 if(phase==='after')assert.equal(report.prepared.ready,true);
 await move(top-890);report.entry=await processState();
 await b.send('Network.setCacheDisabled',{cacheDisabled:true});
 await b.send('Fetch.enable',{patterns:[{urlPattern:'*laptop-aullwen-original.glb',requestStage:'Request'}]});
 let policy='slow';
 b.on('Fetch.requestPaused',async({requestId})=>{try{if(policy==='slow'){await sleep(4000);await b.send('Fetch.continueRequest',{requestId});}else await b.send('Fetch.fulfillRequest',{requestId,responseCode:404,body:''});}catch(error){if(!/Invalid InterceptionId/.test(error.message))b.errors.push(error.message);}});
 await visit('#sdimt');
 const nksTop=await b.evaluate(`document.querySelector('#nks').getBoundingClientRect().top+scrollY`);
 await move(nksTop-100);
 report.nksSlow=await b.evaluate(`(()=>{const s=document.querySelector('#nks'),p=s.querySelector('[class*=nksSticky]>img');return{poster:!!p&&p.complete,canvas:!!s.querySelector('canvas:not([class*=frameBuffer])'),ready:s.dataset.sceneReady}})()`);
 await b.shot(`nks-slow-${phase}.png`);
 if(phase==='after')assert.equal(report.nksSlow.poster,true);
 await sleep(4500);report.nksLoaded=await b.evaluate(`({poster:!!document.querySelector('#nks [class*=nksSticky]>img'),ready:document.querySelector('#nks').dataset.sceneReady})`);
 policy='404';await visit('#nks');await sleep(500);report.nksFailed=await b.evaluate(`({poster:!!document.querySelector('#nks [class*=nksSticky]>img'),ready:document.querySelector('#nks').dataset.sceneReady,heading:document.querySelector('#nks h2').textContent})`);
 if(phase==='after')assert.equal(report.nksFailed.poster,true);
 await b.send('Fetch.disable');
 report.pass=true;console.log(JSON.stringify(report));
}catch(error){report.pass=false;report.failure=error.stack;process.exitCode=1;console.error(error.stack);}
finally{writeFileSync(`${output}/readiness-${phase}.json`,JSON.stringify(report));b.close();}
