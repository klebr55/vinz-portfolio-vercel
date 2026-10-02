const {chromium}=require(process.env.REVIEW_PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || undefined,headless:true,args:['--no-sandbox']});
const results=[];
for(const mode of ['current-unconditional','no-cancel-control','guarded-control']){
 const page=await browser.newPage({viewport:{width:1200,height:800}});
 await page.setContent('<!doctype html><html><body style="margin:0;height:6000px;background:linear-gradient(blue,red)">Lenis isolated reproduction</body></html>');
 await page.addScriptTag({path:require('node:path').resolve('node_modules/lenis/dist/lenis.js')});
 await page.evaluate(mode=>{
 window.instance=new Lenis({autoRaf:false,anchors:false,duration:1.15,smoothWheel:true,syncTouch:false});
 window.navigating=false;
 const cancelTravel=()=>{if(mode==='guarded-control'&&!window.navigating)return;window.navigating=false;window.instance.scrollTo(window.instance.scroll,{immediate:true,force:true});};
 if(mode!=='no-cancel-control')window.addEventListener('wheel',cancelTravel,{passive:true});
 requestAnimationFrame(function frame(t){window.instance.raf(t);requestAnimationFrame(frame);});
 },mode);
 await page.waitForTimeout(100);
 await page.mouse.move(600,400);
 const before=await page.evaluate(()=>window.scrollY);
 await page.mouse.wheel(0,500);
 await page.waitForTimeout(1350);
 const after=await page.evaluate(()=>({scrollY:window.scrollY,target:window.instance.targetScroll,isScrolling:window.instance.isScrolling}));
 results.push({mode,before,...after});
 await page.close();
}
await browser.close();
console.log(JSON.stringify(results,null,2));
fs.writeFileSync(process.env.REVIEW_OUTPUT || 'wheel-results.json',JSON.stringify({scope:'Isolated actual Lenis 1.3.26 with the runtime wheel reset reproduced; not a live-site browser validation.',browser:'Chrome Headless Shell 140.0.7339.16',input:'Playwright mouse.wheel(0,500), idle navigation, 1350ms settling',results},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
