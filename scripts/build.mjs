import { cp, mkdir, rm, copyFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await copyFile('404.html', 'dist/404.html');
await copyFile('_redirects', 'dist/_redirects');
await cp('src', 'dist/src', { recursive: true });
console.log('Build concluído em dist/ com fallback SPA para evitar erro 404.');
