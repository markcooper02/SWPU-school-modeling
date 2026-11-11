import fs from 'node:fs';
const src=fs.readFileSync('src/data.js','utf8')+'\n'+fs.readFileSync('src/geometry.js','utf8');
const G=new Function(src+`;return {buildEnvironment,buildBuilding,buildings,MB};`)();
const env=G.buildEnvironment();
const mb=new G.MB();mb.v=Array.from(env.verts);mb.n=env.vcount;mb.i=Array.from(env.idx);
for(const b of G.buildings)G.buildBuilding(mb,b);
const m=mb.finalize();const v=m.verts,idx=m.idx;
const out=[];
for(let i=0;i<idx.length;i+=3){
 const A=idx[i]*12,B=idx[i+1]*12,C=idx[i+2]*12;
 const ax=v[A],ay=v[A+1],az=v[A+2],bx=v[B],by=v[B+1],bz=v[B+2],cx=v[C],cy=v[C+1],cz=v[C+2];
 const e1=Math.hypot(bx-ax,by-ay,bz-az),e2=Math.hypot(cx-bx,cy-by,cz-bz),e3=Math.hypot(ax-cx,ay-cy,az-cz);
 const L=Math.max(e1,e2,e3);if(L<12)continue;
 const ar=Math.abs((bx-ax)*(cz-az)-(cx-ax)*(bz-az))/2;
 const ny=v[A+4];
 if(ar/L<0.35&&Math.abs(ny)>0.9)out.push({L:+L.toFixed(1),w:+(ar/L).toFixed(2),x:+((ax+bx+cx)/3).toFixed(1),y:+ay.toFixed(2),z:+((az+bz+cz)/3).toFixed(1),col:[v[A+6],v[A+7],v[A+8]].map(q=>+q.toFixed(2))});
}
out.sort((a,b)=>b.L-a.L);
console.log(out.slice(0,30));
console.log('total thin',out.length);
const near=out.filter(o=>o.z>-280&&o.z<-195&&o.L<90&&o.L>8);
console.log('NEAR',JSON.stringify(near.slice(0,40)));
