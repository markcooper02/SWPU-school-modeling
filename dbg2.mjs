import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'C:/Users/Mark/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:900,height:700}});
await p.goto('file://'+process.cwd()+'/swpu-chengdu-campus-3d.html');
await p.waitForFunction(()=>document.getElementById('loading').classList.contains('hide'),null,{timeout:120000});
const info=await p.evaluate(()=>{const G=window.__SWPU.GL;const gl=G.gl;
  // read static vertex y range by drawing? just inspect CPU arrays not retained. Check counts & uniforms
  return {staticCount:G.static.count,wireCount:G.staticWire.count,waterCount:G.waterMesh.count,treeCount:G.trees.count,
    uProj:!!G.main.u.uProj,uView:!!G.main.u.uView,uHeight:!!G.main.u.uHeight,
    prog:gl.getProgramParameter(G.main.p,gl.LINK_STATUS),
    err:gl.getError()};});
console.log(JSON.stringify(info));
await p.evaluate(()=>{window.__SWPU.state.wire=true;window.__SWPU.state.fog=0;});
await p.waitForTimeout(7000);
await p.screenshot({path:'dbg-wire.png'});
await b.close();
