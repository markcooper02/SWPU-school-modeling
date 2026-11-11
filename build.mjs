import fs from 'node:fs';
const css=fs.readFileSync('src/style.css','utf8');
const js=['src/data.js','src/geometry.js','src/engine.js','src/ui.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n');
let html=fs.readFileSync('src/index.html','utf8');
html=html.replace('/*__CSS__*/',()=>css).replace('/*__JS__*/',()=>js);
fs.writeFileSync('swpu-chengdu-campus-3d.html',html);
console.log('built',html.length,'bytes');
