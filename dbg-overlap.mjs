import fs from 'node:fs';
const src=fs.readFileSync('src/data.js','utf8')+'\n'+fs.readFileSync('src/geometry.js','utf8');
const G=new Function(src+`;return {buildings,waterSystem,pointInPoly,distToPolyEdge,mx2x,my2z,S};`)();
const polys=G.waterSystem();
for(const b of G.buildings){for(const p of b.parts){
  const x0=p.x-p.w/2,x1=p.x+p.w/2,y0=p.y-p.h/2,y1=p.y+p.h/2;
  const corners=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
  let hit=null;
  for(const [pi,poly] of polys.entries()){
    if(corners.some(c=>G.pointInPoly(c[0],c[1],poly))||poly.some(q=>q[0]>x0&&q[0]<x1&&q[1]>y0&&q[1]<y1)){hit=pi;break;}}
  if(hit!==null)console.log(b.name,'part',p.x,p.y,p.w,p.h,'-> poly',hit);
}}
