import fs from 'node:fs';
const src=fs.readFileSync('src/data.js','utf8')+'\n'+fs.readFileSync('src/geometry.js','utf8');
const G=new Function(src+`;return {buildEnvironment,COL};`)();
const env=G.buildEnvironment();
const v=env.verts;
// cluster vertices with 3<y<6 by rounding position
const pts=[];
for(let i=0;i<v.length;i+=12){const y=v[i+1];if(y>3&&y<6)pts.push([v[i],y,v[i+2],v[i+6],v[i+7],v[i+8]]);}
console.log('verts y3-6:',pts.length);
// find horizontal extents: group by z rounded 0.5 and y rounded 0.5
const groups=new Map();
for(const p of pts){const k=p[1].toFixed(1)+'|'+p[2].toFixed(1);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p);}
let shown=0;
for(const [k,g] of groups){const xs=g.map(p=>p[0]);const ext=Math.max(...xs)-Math.min(...xs);
 if(ext>8&&shown<25){console.log(k,'n='+g.length,'x',Math.min(...xs).toFixed(1),'..',Math.max(...xs).toFixed(1),'col',g[0][3].toFixed(2),g[0][4].toFixed(2),g[0][5].toFixed(2));shown++;}}
