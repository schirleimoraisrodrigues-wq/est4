import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { useAppData } from '../hooks/useAppData.jsx';
import { Field } from '../components/Forms';
import { PageTitle } from './Subjects';

const colors = { prova: 'bg-red-500/20 text-red-100 border-red-300/30', trabalho: 'bg-amber-500/20 text-amber-100 border-amber-300/30', revisão: 'bg-sky-500/20 text-sky-100 border-sky-300/30', apresentação: 'bg-violet-500/20 text-violet-100 border-violet-300/30', tarefa: 'bg-teal-500/20 text-teal-100 border-teal-300/30', evento: 'bg-slate-500/20 text-slate-100 border-slate-300/30' };

export default function Calendar() {
  const data = useAppData();
  const [form, setForm] = useState({ title: '', description: '', subjectId: data.subjects[0]?.id || '', dueDate: new Date().toISOString().slice(0, 10), type: 'evento', priority: 'média', status: 'pendente' });
  const days = Array.from({ length: 30 }, (_, index) => new Date(2026, 4, index + 1));
  function submit(event) { event.preventDefault(); data.addTask(form); setForm({ ...form, title: '', description: '' }); }
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10"><PageTitle kicker="Calendário" title="Plano mensal" text="Alternativa simples ao FullCalendar com eventos coloridos por tipo." /><div className="grid gap-6 xl:grid-cols-[1fr_360px]"><section className="grid grid-cols-2 gap-3 md:grid-cols-5 lg:grid-cols-7">{days.map((day) => { const iso = day.toISOString().slice(0, 10); const events = data.tasks.filter((task) => task.dueDate === iso); return <div key={iso} className="min-h-36 rounded-3xl border border-white/10 bg-white/[0.03] p-3"><p className="mb-3 text-sm font-black">{day.getDate()}</p><div className="space-y-2">{events.map((event) => <div key={event.id} className={`rounded-2xl border px-3 py-2 text-xs font-bold ${colors[event.type]}`}>{event.title}</div>)}</div></div>; })}</section><form onSubmit={submit} className="glass-card h-fit space-y-3 p-5"><h2 className="flex items-center gap-2 text-xl font-black"><CalendarPlus />Nova atividade</h2><Field label="Título"><input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field><Field label="Data"><input className="input-field" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field><Field label="Tipo"><select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{Object.keys(colors).map((item) => <option key={item}>{item}</option>)}</select></Field><button className="btn-primary w-full">Adicionar pelo calendário</button></form></div></div>;
}
