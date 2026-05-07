# Terminal Engenharia

Plataforma pessoal de organização e gamificação de estudos com autenticação local, dashboard, matérias, conteúdos, tarefas, calendário, questões, flashcards, perfil, desempenho e prioridade automática.

## Por que não há dependências no `npm install`?

O ambiente de execução bloqueou downloads do registry npm com HTTP 403. Para eliminar o erro de instalação e permitir build confiável, o app agora possui um runtime estático sem pacotes externos: `npm install` audita um pacote vazio e `npm run build` copia os arquivos necessários para `dist/`.

A interface preserva a experiência SPA e evita erro 404 usando rotas por hash (`#/materias`, `#/tarefas`, etc.), arquivos de fallback para hospedagens estáticas (`404.html`, `_redirects`, `vercel.json`, `netlify.toml` e `firebase.json`) e, no build, páginas físicas em `dist/login`, `dist/materias`, `dist/tarefas` e demais rotas internas.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Persistência

Os dados são salvos em LocalStorage enquanto Firebase ou Supabase não são integrados.
