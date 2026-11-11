import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'C:/Users/Mark/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1180,height:780}});p.setDefaultTimeout(90000);
await p.goto('file://'+process.cwd()+'/swpu-chengdu-campus-3d.html');
await p.waitForFunction(()=>document.getElementById('loading').classList.contains('hide'),null,{timeout:120000});
await p.evaluate(()=>{const c=window.__SWPU.cam;c.tAz=0;c.tEl=1.52;c.tDist=220;c.tTarget=[-8.5,0,-208.5];const e=document.getElementById('t-labels');e.checked=false;e.dispatchEvent(new Event('change'));});
await p.waitForTimeout(2000);
await p.screenshot({path:'w-topclose.png',timeout:90000});
await b.close();console.log('done');
