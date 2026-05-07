import { cp, mkdir, rm, copyFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const routes = ['login', 'cadastro', 'calendario', 'materias', 'tarefas', 'questoes', 'flashcards', 'perfil'];

function routeRedirectHtml(route) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Terminal Engenharia - redirecionando</title>
    <script>
      (function () {
        var route = '/${route}';
        var path = window.location.pathname;
        var index = path.lastIndexOf('/${route}');
        var base = index >= 0 ? path.slice(0, index + 1) : '/';
        window.location.replace(window.location.origin + base + '#' + route + window.location.search);
      }());
    </script>
  </head>
  <body>Redirecionando para o Terminal Engenharia...</body>
</html>
`;
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await copyFile('404.html', 'dist/404.html');
await copyFile('_redirects', 'dist/_redirects');
await cp('src', 'dist/src', { recursive: true });

for (const route of routes) {
  const file = join('dist', route, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, routeRedirectHtml(route));
}

console.log('Build concluído em dist/ com fallbacks SPA para evitar erro 404 em rotas diretas.');
