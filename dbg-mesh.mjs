import fs from 'node:fs';
const src=fs.readFileSync('src/data.js','utf8')+'\n'+fs.readFileSync('src/geometry.js','utf8');
const fn=new Function(src+`;return {waterSystem,waterSurface,pointInPoly,earClip,streamOutline,WATER};`);
const G=fn();
const polys=G.waterSystem();
function segInt(a,b,c,d){const o=(p,q,r)=>Math.sign((q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]));
 return o(a,b,c)!==o(a,b,d)&&o(c,d,a)!==o(c,d,b);}
polys.forEach((p,pi)=>{
 let self=0;
 for(let i=0;i<p.length;i++)for(let j=i+2;j<p.length;j++){if(i===0&&j===p.length-1)continue;
  if(segInt(p[i],p[(i+1)%p.length],p[j],p[(j+1)%p.length]))self++;}
 const {vs,tris}=G.waterSurface(p);
 let bad=0,long=0,out=0;
 for(const t of tris){const A=vs[t[0]],B=vs[t[1]],C=vs[t[2]];
  const e=Math.max(Math.hypot(A[0]-B[0],A[1]-B[1]),Math.hypot(B[0]-C[0],B[1]-C[1]),Math.hypot(C[0]-A[0],C[1]-A[1]));
  if(e>20)long++;
  const cx=(A[0]+B[0]+C[0])/3,cz=(A[1]+B[1]+C[1])/3;
  if(!G.pointInPoly(cx,cz,p))out++;
  const ar=Math.abs((B[0]-A[0])*(C[1]-A[1])-(C[0]-A[0])*(B[1]-A[1]))/2;
  if(ar<0.02&&e>8)bad++;}
 console.log(`poly${pi} n=${p.length} selfInt=${self} tris=${tris.length} longEdge=${long} centroidOutside=${out} sliver=${bad}`);
});
