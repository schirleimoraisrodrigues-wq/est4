import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.toml': 'text/plain; charset=utf-8' };

function safeJoin(pathname) {
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = resolve(root, relativePath);
  if (target !== root && !target.startsWith(root + sep)) throw new Error('Caminho inválido');
  return target;
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const target = safeJoin(decodeURIComponent(url.pathname));
    const file = await stat(target)
      .then((info) => (info.isFile() ? target : join(target, 'index.html')))
      .catch(() => join(root, 'index.html'));
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(error.message);
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Terminal Engenharia disponível em http://localhost:${port}`);
});
