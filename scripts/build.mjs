import { cp, mkdir, rm, copyFile, readFile, writeFile } from 'node:fs/promises';

const appRoutes = ['login', 'cadastro', 'calendario', 'materias', 'tarefas', 'questoes', 'flashcards', 'perfil'];
const rootIndex = await readFile('index.html', 'utf8');
const nestedIndex = rootIndex
  .replace('href="./src/static.css"', 'href="../src/static.css"')
  .replace('src="./src/static-app.js"', 'src="../src/static-app.js"');

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await copyFile('404.html', 'dist/404.html');
await copyFile('_redirects', 'dist/_redirects');
await cp('src', 'dist/src', { recursive: true });

for (const route of appRoutes) {
  await mkdir(`dist/${route}`, { recursive: true });
  await writeFile(`dist/${route}/index.html`, nestedIndex);
}

console.log('Build concluído em dist/ com páginas por rota e fallbacks SPA para evitar erro 404.');
