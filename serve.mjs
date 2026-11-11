import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const srv = http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '');
  const file = path.join(root, name);
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain; charset=utf-8' });
  fs.createReadStream(file).pipe(res);
});
srv.listen(8731, '127.0.0.1', () => console.log('serving on 8731'));