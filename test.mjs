import { chromium } from 'playwright';
const browser=await chromium.launch({executablePath:'C:/Users/Mark/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push('PAGE: '+e.message));
await page.goto('file://'+process.cwd()+'/swpu-chengdu-campus-3d.html');
await page.waitForFunction(()=>document.getElementById('loading').classList.contains('hide'),null,{timeout:120000});
await page.waitForTimeout(2500);
const info=await page.evaluate(()=>{
  const c=document.getElementById('glcanvas');const gl=c.getContext('webgl2');
  let varr=0,mean=0;
  if(gl){const w=96,h=96;const px=new Uint8Array(w*h*4);gl.readPixels((c.width-w)/2,(c.height-h)/2,w,h,gl.RGBA,gl.UNSIGNED_BYTE,px);
    let sum=0,sum2=0;for(let i=0;i<px.length;i+=4){const l=px[i]+px[i+1]+px[i+2];sum+=l;sum2+=l*l;}const n=px.length/4;mean=sum/n;varr=sum2/n-mean*mean;}
  return {w:c.width,h:c.height,varr:Math.round(varr),mean:Math.round(mean),fps:document.getElementById('st-fps').textContent,tris:document.getElementById('st-tris').textContent,fallback:document.getElementById('fallback').classList.contains('show')};
});
console.log(JSON.stringify(info));console.log('ERRORS',errors.slice(0,6));
await page.screenshot({path:'shot-desktop.png'});
await browser.close();
