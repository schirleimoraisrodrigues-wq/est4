import { seedQuestions, seedSubjects, seedTasks, initialProfile } from './data/seedData.js';
import { calculatePerformance, countAnswered } from './utils/performance.js';
import { calculatePriority } from './utils/priority.js';

const root = document.getElementById('root');
const icons = { dash:'▦', cal:'📅', sub:'🎓', task:'☑', q:'?', card:'▣', user:'◉', sun:'☀', out:'⇱', alert:'⚠', list:'☷', people:'👥' };
const appKey = 'terminal_engenharia_state';
const authKey = 'terminal_engenharia_auth';
const usersKey = 'terminal_engenharia_users';
const nav = [['#/','Dashboard',icons.dash],['#/calendario','Calendário',icons.cal],['#/materias','Matérias',icons.sub],['#/tarefas','Tarefas',icons.task],['#/questoes','Questões',icons.q],['#/flashcards','Flashcards',icons.card],['#/perfil','Perfil',icons.user]];

const defaultState = () => ({ subjects: seedSubjects, tasks: seedTasks, questions: seedQuestions, profile: initialProfile });
const load = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const state = () => load(appKey, defaultState());
const setState = (value) => save(appKey, value);
const session = () => load(authKey, null);
const route = () => location.hash.replace(/^#\/?/, '') || '/';
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
const subjectName = (data, id) => data.subjects.find((s) => s.id === id)?.name || 'Sem matéria';

function boot() {
  if (!localStorage.getItem(appKey)) setState(defaultState());
  addEventListener('hashchange', render);
  render();
}

function render() {
  const user = session();
  const path = route();
  if (!user && !['/login', '/cadastro'].includes(path)) return go('/login');
  if (user && ['/login', '/cadastro'].includes(path)) return go('/');
  root.innerHTML = user ? shell(page(path), path) : authPage(path === '/cadastro');
  bindGlobal();
}

function go(path) { location.hash = `#${path}`; }
function bindGlobal() {
  root.querySelectorAll('[data-go]').forEach((el) => el.onclick = () => go(el.dataset.go));
  root.querySelectorAll('[data-logout]').forEach((el) => el.onclick = () => { localStorage.removeItem(authKey); go('/login'); });
  root.querySelector('form[data-auth]')?.addEventListener('submit', authSubmit);
  root.querySelector('form[data-subject]')?.addEventListener('submit', subjectSubmit);
  root.querySelector('form[data-content]')?.addEventListener('submit', contentSubmit);
  root.querySelector('form[data-task]')?.addEventListener('submit', taskSubmit);
  root.querySelector('form[data-calendar]')?.addEventListener('submit', calendarSubmit);
  root.querySelector('form[data-question]')?.addEventListener('submit', questionSubmit);
  root.querySelectorAll('[data-delete-subject]').forEach((el) => el.onclick = () => { const d=state(); d.subjects=d.subjects.filter((s)=>s.id!==el.dataset.deleteSubject); setState(d); render(); });
  root.querySelectorAll('[data-edit-subject]').forEach((el) => el.onclick = () => { const d=state(); d.subjects=d.subjects.map((s)=>s.id===el.dataset.editSubject?{...s,name:`${s.name}*`}:s); setState(d); render(); });
  root.querySelectorAll('[data-answer]').forEach((el) => el.onclick = () => answerQuestion(el.dataset.answer, el.dataset.value));
  root.querySelectorAll('[data-status]').forEach((el) => el.onchange = () => { const d=state(); d.tasks=d.tasks.map((t)=>t.id===el.dataset.status?{...t,status:el.value}:t); setState(d); render(); });
}

function shell(content, path) {
  return `<div class="shell"><aside class="sidebar"><div class="brand"><div class="brand-icon">${icons.sub}</div><div><div class="kicker">Terminal</div><strong>Engenharia</strong></div></div><nav class="nav">${nav.map(([href,label,icon]) => `<a class="${href === `#${path}` || (path==='/'&&href==='#/') ? 'active' : ''}" href="${href}"><span>${icon}</span><span>${label}</span></a>`).join('')}</nav></aside><main class="main">${content}</main></div>`;
}

function authPage(register) {
  return `<main class="auth"><section class="card auth-box"><div class="auth-hero"><div class="brand"><div class="brand-icon">${icons.sub}</div><strong>Terminal Engenharia</strong></div><p class="kicker">Organização gamificada</p><h1 class="title">Estude como quem comanda um painel de engenharia.</h1><p class="muted mt">Centralize matérias, tarefas, provas, questões e flashcards. O modo offline usa LocalStorage e não depende de pacotes externos para instalar ou buildar.</p></div><form class="auth-form" data-auth="${register ? 'register' : 'login'}"><div><p class="kicker">${register ? 'Criar conta' : 'Acessar conta'}</p><h2> ${register ? 'Cadastro' : 'Login'}</h2></div>${register ? '<label>Nome<input class="input" name="name" required></label>' : ''}<label>E-mail<input class="input" name="email" type="email" required></label><label>Senha<input class="input" name="password" type="password" minlength="4" required></label><p id="auth-error" class="red"></p><button class="btn primary">${register ? 'Criar conta' : 'Entrar'}</button><p class="muted">${register ? 'Já tem conta?' : 'Novo por aqui?'} <a href="#/${register ? 'login' : 'cadastro'}">${register ? 'Entrar' : 'Criar cadastro'}</a></p></form></section></main>`;
}

function authSubmit(event) {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.target));
  const users = load(usersKey, []);
  const error = document.getElementById('auth-error');
  if (event.target.dataset.auth === 'register') {
    if (users.some((u) => u.email === form.email)) return error.textContent = 'Este e-mail já está cadastrado.';
    const user = { id: uid(), name: form.name, email: form.email, password: form.password };
    save(usersKey, [...users, user]); save(authKey, { id: user.id, name: user.name, email: user.email });
  } else {
    const user = users.find((u) => u.email === form.email && u.password === form.password);
    if (!user) return error.textContent = 'E-mail ou senha inválidos.';
    save(authKey, { id: user.id, name: user.name, email: user.email });
  }
  const d = state(); const user = session(); d.profile = { ...d.profile, name: user.name, email: user.email }; setState(d); go('/');
}

function page(path) {
  const pages = { '/': dashboard, '/calendario': calendar, '/materias': subjects, '/tarefas': tasks, '/questoes': questions, '/flashcards': flashcards, '/perfil': profile };
  return (pages[path] || dashboard)();
}

function dashboard() {
  const d = state();
  const exam = d.tasks.find((t) => t.type === 'prova');
  const pending = d.subjects.reduce((sum, s) => sum + s.contents.filter((c) => c.status !== 'dominado').length, 0);
  const late = d.tasks.filter((t) => t.status !== 'concluído' && new Date(`${t.dueDate}T23:59:59`) < new Date()).length;
  const urgent = d.subjects.filter((s) => calculatePriority(s, d.tasks, d.questions) === 'urgente').length;
  const cards = d.subjects.flatMap((s) => s.contents.map((c) => ({...c, subject:s.name}))).slice(0,4);
  return `<header class="header"><div><p class="kicker">OLÁ, ESTUDANTE</p><h1 class="title">Terminal Engenharia</h1></div><div class="header-actions"><button class="btn">Modo offline</button><button class="btn">${icons.sun}</button><button class="btn" data-logout>${icons.out}</button></div></header><section class="hero"><p class="kicker">OLÁ, ESTUDANTE</p><h2>Terminal Engenharia</h2><strong>Painel Geral</strong><p>Modo offline. Hoje vale focar nos temas da prova mais próxima e nas listas de exercícios pendentes.</p><div class="grid four mt">${mini(icons.cal, `${exam?.title || 'Cálculo'} amanhã`, 'Próxima prova')}${mini(icons.people, Math.max(37,pending), 'Tópicos pendentes')}${mini(icons.list, late, 'Listas atrasadas')}${mini(icons.alert, urgent, 'Urgente')}</div></section><section><div class="section-head"><div><p class="kicker">Agenda rápida</p><h2>Provas próximas</h2></div><button class="btn" data-go="/calendario">Ver plano</button></div><div class="agenda"><strong>${icons.cal} ${exam?.title || 'Cálculo'}</strong><strong class="red">amanhã</strong></div></section><section><div class="section-head"><div><p class="kicker">Fila de estudos</p><h2>Tópicos Pendentes</h2><p class="muted">Cálculo está puxando a fila porque a prova está próxima.</p></div><button class="btn" data-go="/materias">Ir para Central de Disciplinas</button></div><div class="grid four">${cards.map(studyCard).join('')}</div></section>`;
}
function mini(icon, value, label){ return `<div class="mini"><div>${icon}</div><strong>${value}</strong><span>${label}</span></div>`; }
function studyCard(c){ return `<article class="study-card"><div class="study-top"><div class="round-icon" style="width:3rem;height:3rem">${icons.sub}</div><div><h3>${c.title}</h3><p class="muted">${c.subject}</p></div></div><p>Prova: amanhã</p><span class="badge">${icons.list} Não testado</span><div class="grid two mt"><button class="btn primary">Fazer teste</button><button class="btn">Ver teoria</button></div></article>`; }

function subjects(){ const d=state(); return `${title('Central de disciplinas','Matérias e conteúdos')}<div class="split"><section class="grid two">${d.subjects.map((s)=>`<article class="glass"><div style="height:.35rem;width:4rem;border-radius:99px;background:${s.color}"></div><h2>${s.name}</h2><p class="muted">${s.description}</p><span class="badge">${calculatePriority(s,d.tasks,d.questions)}</span><div class="grid three mt">${metric(`${calculatePerformance(d.questions,{subjectId:s.id})}%`,'Desempenho')}${metric(s.contents.length,'Conteúdos')}${metric(d.tasks.filter((t)=>t.subjectId===s.id).length,'Tarefas')}</div><div class="row mt"><button class="btn" data-edit-subject="${s.id}">Editar</button><button class="btn danger" data-delete-subject="${s.id}">Excluir</button></div></article>`).join('')}</section><aside class="grid"><form class="glass grid" data-subject><h3>Adicionar matéria</h3><label>Nome<input class="input" name="name" required></label><label>Cor<input class="input" type="color" name="color" value="#2dd4bf"></label><label>Descrição<textarea class="input" name="description"></textarea></label><button class="btn primary">Adicionar</button></form><form class="glass grid" data-content><h3>Adicionar conteúdo</h3><label>Matéria<select class="input" name="subjectId">${options(d.subjects)}</select></label><label>Título<input class="input" name="title" required></label><label>Resumo<textarea class="input" name="summary"></textarea></label><div class="grid two"><label>Dificuldade<select class="input" name="difficulty"><option>baixa</option><option>média</option><option>alta</option></select></label><label>Status<select class="input" name="status"><option>não iniciado</option><option>estudando</option><option>revisado</option><option>dominado</option></select></label></div><label>Última revisão<input class="input" type="date" name="lastReview" value="${today()}"></label><button class="btn primary">Adicionar conteúdo</button></form></aside></div>`; }
function tasks(){ const d=state(); return `${title('Atividades','Tarefas, provas e trabalhos')}<div class="split"><form class="glass grid" data-task>${taskFields(d)}<button class="btn primary">Adicionar atividade</button></form><section class="list">${d.tasks.map((t)=>`<article class="glass task-row"><div><p class="kicker">${t.type} · ${t.priority} · ${subjectName(d,t.subjectId)}</p><h2>${t.title}</h2><p class="muted">${t.description}</p></div><div class="row"><strong>${t.dueDate}</strong><select class="input" data-status="${t.id}">${['pendente','em andamento','concluído'].map((s)=>`<option ${s===t.status?'selected':''}>${s}</option>`).join('')}</select></div></article>`).join('')}</section></div>`; }
function calendar(){ const d=state(); const days=Array.from({length:30},(_,i)=>new Date(2026,4,i+1)); return `${title('Calendário','Plano mensal','Eventos coloridos por tipo e criação rápida pelo calendário.')}<div class="split"><section class="calendar">${days.map((day)=>{const iso=day.toISOString().slice(0,10); const events=d.tasks.filter((t)=>t.dueDate===iso); return `<div class="day"><strong>${day.getDate()}</strong>${events.map((e)=>`<div class="event ${e.type}">${e.title}</div>`).join('')}</div>`}).join('')}</section><form class="glass grid" data-calendar><h3>Nova atividade</h3>${taskFields(d,true)}<button class="btn primary">Adicionar pelo calendário</button></form></div>`; }
function questions(){ const d=state(); return `${title('Banco de questões','Questões e desempenho',`Desempenho geral: ${calculatePerformance(d.questions)}%`)}<div class="split"><form class="glass grid" data-question><label>Matéria<select class="input" name="subjectId">${options(d.subjects)}</select></label><label>Conteúdo<input class="input" name="contentId" placeholder="ID ou nome do conteúdo"></label><label>Tipo<select class="input" name="type"><option>múltipla escolha</option><option>verdadeiro ou falso</option><option>cards</option></select></label><label>Enunciado / frente<textarea class="input" name="prompt" required></textarea></label><label>Alternativas (uma por linha)<textarea class="input" name="options">A\nB\nC\nD</textarea></label><label>Resposta correta / verso<input class="input" name="correctAnswer" required></label><button class="btn primary">Cadastrar questão</button></form><section class="list">${d.questions.map((q)=>`<article class="glass"><span class="badge">${q.type}</span><h2>${q.prompt}</h2><p class="muted">Tentativas: ${q.attempts?.length||0}</p><div class="row">${(q.options?.length?q.options:['Verdadeiro','Falso',q.answer].filter(Boolean)).map((o)=>`<button class="btn" data-answer="${q.id}" data-value="${o}">${o}</button>`).join('')}</div></article>`).join('')}</section></div>`; }
function flashcards(){ const d=state(); const cards=d.questions.filter((q)=>q.type==='cards'); return `${title('Revisão ativa','Flashcards teóricos','Cards de conteúdo para estudar dentro da plataforma.')}<section class="grid three">${cards.map((c)=>`<article class="glass"><p class="kicker">Frente</p><h2>${c.prompt}</h2><div class="glass mt"><p class="kicker">Verso</p><p>${c.answer}</p></div></article>`).join('')}</section>`; }
function profile(){ const d=state(); return `${title('Perfil','Seu progresso')}<section class="glass"><p class="muted">Nome</p><h2>${d.profile.name}</h2><p class="muted">E-mail</p><strong>${d.profile.email}</strong></section><section class="grid four mt">${metric(`${d.profile.streak} dias`,'Sequência de estudos')}${metric(d.tasks.filter((t)=>t.status==='concluído').length,'Tarefas concluídas')}${metric(countAnswered(d.questions),'Questões respondidas')}${metric(`${calculatePerformance(d.questions)}%`,'Taxa geral de acertos')}</section>`; }

function title(k,t,txt=''){ return `<div class="header"><div><p class="kicker">${k}</p><h1 class="title">${t}</h1>${txt?`<p class="muted">${txt}</p>`:''}</div></div>`; }
function metric(v,l){ return `<div class="metric"><strong>${v}</strong><span class="muted">${l}</span></div>`; }
function options(items){ return items.map((s)=>`<option value="${s.id}">${s.name}</option>`).join(''); }
function today(){ return new Date().toISOString().slice(0,10); }
function taskFields(d, simple=false){ return `<label>Título<input class="input" name="title" required></label>${simple?'':'<label>Descrição<textarea class="input" name="description"></textarea></label>'}<label>Matéria<select class="input" name="subjectId">${options(d.subjects)}</select></label><div class="grid two"><label>Entrega<input class="input" type="date" name="dueDate" value="${today()}"></label><label>Tipo<select class="input" name="type"><option>tarefa</option><option>prova</option><option>trabalho</option><option>revisão</option><option>apresentação</option><option>evento</option></select></label></div><div class="grid two"><label>Prioridade<select class="input" name="priority"><option>baixa</option><option>média</option><option>alta</option></select></label><label>Status<select class="input" name="status"><option>pendente</option><option>em andamento</option><option>concluído</option></select></label></div>`; }
function formObj(form){ return Object.fromEntries(new FormData(form)); }
function subjectSubmit(e){ e.preventDefault(); const d=state(); d.subjects.push({...formObj(e.target), id:uid(), contents:[]}); setState(d); render(); }
function contentSubmit(e){ e.preventDefault(); const f=formObj(e.target); const d=state(); d.subjects=d.subjects.map((s)=>s.id===f.subjectId?{...s,contents:[...s.contents,{...f,id:uid()}]}:s); setState(d); render(); }
function taskSubmit(e){ e.preventDefault(); const d=state(); d.tasks.push({...formObj(e.target), id:uid()}); setState(d); render(); }
function calendarSubmit(e){ taskSubmit(e); }
function questionSubmit(e){ e.preventDefault(); const f=formObj(e.target); const d=state(); const isCard=f.type==='cards'; d.questions.push({...f,id:uid(),options:isCard?[]:f.options.split('\n').filter(Boolean),answer:isCard?f.correctAnswer:undefined,attempts:[]}); setState(d); render(); }
function answerQuestion(id, answer){ const d=state(); d.questions=d.questions.map((q)=>q.id===id?{...q,attempts:[...(q.attempts||[]),{answer,correct:answer===(q.correctAnswer||q.answer),at:new Date().toISOString()}]}:q); setState(d); alert(answer === (d.questions.find((q)=>q.id===id)?.correctAnswer || d.questions.find((q)=>q.id===id)?.answer) ? 'Você acertou!' : 'Você errou. Revise a teoria.'); render(); }

boot();
