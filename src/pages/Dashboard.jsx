import { AlertTriangle, CalendarDays, ClipboardList, ListChecks, LogOut, Sun, Users, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData.jsx';
import { clearSession } from '../services/storage';
import { calculatePriority } from '../utils/priority';

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const { subjects, tasks, questions } = useAppData();
  const tomorrowExam = tasks.find((task) => task.type === 'prova');
  const pendingTopics = subjects.reduce((total, subject) => total + subject.contents.filter((content) => content.status !== 'dominado').length, 0);
  const lateTasks = tasks.filter((task) => task.status !== 'concluído' && new Date(`${task.dueDate}T23:59:59`) < new Date()).length;
  const urgent = subjects.filter((subject) => calculatePriority(subject, tasks, questions) === 'urgente').length;
  const cards = subjects.flatMap((subject) => subject.contents.map((content) => ({ ...content, subject: subject.name }))).slice(0, 4);

  function logout() {
    clearSession();
    onLogout();
    navigate('/login');
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">OLÁ, ESTUDANTE</p>
          <h1 className="mt-1 text-3xl font-black text-white md:text-5xl">Terminal Engenharia</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline py-2">Modo offline</button>
          <button className="btn-outline h-11 w-11 p-0" aria-label="Alternar tema"><Sun className="h-5 w-5" /></button>
          <button onClick={logout} className="btn-outline h-11 w-11 p-0" aria-label="Sair"><LogOut className="h-5 w-5" /></button>
        </div>
      </header>

      <section className="rounded-[2rem] border border-teal-200/10 bg-teal-900/80 p-6 shadow-glow md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-100/70">OLÁ, ESTUDANTE</p>
        <h2 className="mt-2 text-4xl font-black md:text-6xl">Terminal Engenharia</h2>
        <p className="mt-1 text-xl font-semibold text-teal-100">Painel Geral</p>
        <p className="mt-5 max-w-3xl text-teal-50/80">Modo offline. Hoje vale focar nos temas da prova mais próxima e nas listas de exercícios pendentes.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Mini icon={CalendarDays} value={`${tomorrowExam?.title || 'Cálculo'} amanhã`} label="Próxima prova" />
          <Mini icon={Users} value={String(Math.max(37, pendingTopics))} label="Tópicos pendentes" />
          <Mini icon={ClipboardList} value={String(lateTasks)} label="Listas atrasadas" />
          <Mini icon={AlertTriangle} value={String(urgent)} label="Urgente" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div><p className="section-kicker">Agenda rápida</p><h2 className="mt-1 text-2xl font-black">Provas próximas</h2></div>
          <button onClick={() => navigate('/calendario')} className="btn-outline py-2">Ver plano</button>
        </div>
        <div className="flex items-center justify-between rounded-3xl border border-red-400/30 bg-terminal-card p-5">
          <div className="flex items-center gap-4"><CalendarDays className="text-red-300" /><span className="text-lg font-bold">{tomorrowExam?.title || 'Cálculo'}</span></div>
          <span className="font-black text-red-300">amanhã</span>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="section-kicker">Fila de estudos</p><h2 className="mt-1 text-2xl font-black">Tópicos Pendentes</h2><p className="mt-1 text-slate-400">Cálculo está puxando a fila porque a prova está próxima.</p></div>
          <button onClick={() => navigate('/materias')} className="btn-outline">Ir para Central de Disciplinas</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => <StudyCard key={`${card.subject}-${card.id}`} card={card} />)}
        </div>
      </section>
    </div>
  );
}

function Mini({ icon: Icon, value, label }) {
  return <div className="rounded-3xl border border-white/10 bg-black/15 p-4"><Icon className="mb-4 h-5 w-5 text-teal-100" /><p className="text-lg font-black">{value}</p><p className="text-sm text-teal-50/60">{label}</p></div>;
}

function StudyCard({ card }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#0d1f35] p-5">
      <div className="flex gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-violet-300/20 text-violet-200"><GraduationCap /></div><div><h3 className="font-black">{card.title}</h3><p className="text-sm text-slate-400">{card.subject}</p></div></div>
      <div className="my-6 space-y-3"><p className="text-sm text-slate-300">Prova: amanhã</p><span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs font-bold"><ListChecks className="h-3.5 w-3.5" />Não testado</span></div>
      <div className="grid grid-cols-2 gap-2"><button className="btn-primary py-2">Fazer teste</button><button className="btn-outline py-2">Ver teoria</button></div>
    </article>
  );
}
