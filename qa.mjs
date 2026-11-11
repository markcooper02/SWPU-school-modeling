import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'C:/Users/Mark/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errs=[];
const p=await b.newPage({viewport:{width:1180,height:780}});p.setDefaultTimeout(90000);
p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('file://'+process.cwd()+'/swpu-chengdu-campus-3d.html');
await p.waitForFunction(()=>document.getElementById('loading').classList.contains('hide'),null,{timeout:120000});
const R={};
await p.waitForTimeout(5000);await p.screenshot({path:'qa-hero.png',timeout:90000});
R.initial=await p.evaluate(()=>({ok:window.__SWPU.glOK,tris:document.getElementById('st-tris').textContent}));
// orbit drag
const c=await p.$('#glcanvas');const box=await c.boundingBox();
const az0=await p.evaluate(()=>window.__SWPU.cam.tAz);
await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2+120,box.y+box.height/2+40,{steps:6});await p.mouse.up();
R.orbit=await p.evaluate(a0=>({changed:Math.abs(window.__SWPU.cam.tAz-a0)>0.1,az:window.__SWPU.cam.tAz}),az0);
// wheel zoom
const d0=await p.evaluate(()=>window.__SWPU.cam.tDist);
await p.mouse.wheel(0,-300);
R.zoom=await p.evaluate(d=>({changed:window.__SWPU.cam.tDist<d,dist:window.__SWPU.cam.tDist}),d0);
// sliders
await p.evaluate(()=>{const set=(id,v)=>{const e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input'));};set('c-time',21);set('c-height',2.2);set('c-trees',40);set('c-fog',60);});
R.sliders=await p.evaluate(()=>({hour:window.__SWPU.state.hour,height:window.__SWPU.state.height,trees:window.__SWPU.state.trees,fog:window.__SWPU.state.fog,out:document.getElementById('o-time').value}));
// search + select
await p.fill('#search','图书馆');
R.search=await p.evaluate(()=>document.querySelectorAll('.b-item').length);
await p.click('.b-item');
R.select=await p.evaluate(()=>({sel:window.__SWPU.state.selected,detail:document.getElementById('detail-card').classList.contains('show'),name:document.getElementById('detail-name').textContent}));
// toggles
await p.evaluate(()=>{for(const id of ['t-wire','t-grid']){const e=document.getElementById(id);e.checked=true;e.dispatchEvent(new Event('change'));}});
R.toggles=await p.evaluate(()=>({wire:window.__SWPU.state.wire,grid:window.__SWPU.state.grid}));
await p.evaluate(()=>{for(const id of ['t-wire','t-grid']){const e=document.getElementById(id);e.checked=true;e.dispatchEvent(new Event('change'));}});
// reset
await p.click('#btn-reset');
R.reset=await p.evaluate(()=>({hour:window.__SWPU.state.hour,height:window.__SWPU.state.height,sel:window.__SWPU.state.selected}));
// export PNG
const dl=p.waitForEvent('download',{timeout:30000}).catch(()=>null);
await p.click('#btn-export');const d=await dl;R.export=!!d;
// top view
await p.click('[data-view="top"]');
R.top=await p.evaluate(()=>window.__SWPU.cam.tEl>1.4);
await p.waitForTimeout(2500);
await p.screenshot({path:'qa-desktop.png',timeout:90000});
// mobile
const m=await b.newPage({viewport:{width:390,height:844}});m.setDefaultTimeout(90000);
m.on('pageerror',e=>errs.push('MOB '+e.message));
await m.goto('file://'+process.cwd()+'/swpu-chengdu-campus-3d.html');
await m.waitForFunction(()=>document.getElementById('loading').classList.contains('hide'),null,{timeout:120000});
R.mobile=await m.evaluate(()=>({controls:document.getElementById('controls').getBoundingClientRect().height,canvasW:document.getElementById('glcanvas').clientWidth,overflow:document.documentElement.scrollWidth>window.innerWidth+1,sliders:document.querySelectorAll('#controls input[type=range]').length}));
await m.waitForTimeout(3000);await m.screenshot({path:'qa-mobile.png',timeout:90000});
// fallback
const f=await b.newPage({viewport:{width:1000,height:700}});
await f.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=function(){return null;};});
await f.goto('file://'+process.cwd()+'/swpu-chengdu-campus-3d.html');
await f.waitForTimeout(800);
R.fallback=await f.evaluate(()=>({show:document.getElementById('fallback').classList.contains('show'),rects:document.querySelectorAll('#fallback rect[data-id]').length}));
await f.click('#fallback rect[data-id]');
R.fallbackSelect=await f.evaluate(()=>document.getElementById('detail-card').classList.contains('show'));
console.log(JSON.stringify(R,null,1));console.log('ERRORS',errs.slice(0,8));
await b.close();
