import { useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { Field } from '../components/Forms';
import { useAppData } from '../hooks/useAppData.jsx';
import { calculatePerformance } from '../utils/performance';
import { calculatePriority } from '../utils/priority';

export default function Subjects() {
  const data = useAppData();
  const [form, setForm] = useState({ name: '', color: '#2dd4bf', description: '' });
  const [selected, setSelected] = useState(data.subjects[0]?.id);
  const selectedSubject = data.subjects.find((subject) => subject.id === selected) || data.subjects[0];
  const [content, setContent] = useState({ title: '', summary: '', difficulty: 'média', status: 'não iniciado', lastReview: new Date().toISOString().slice(0, 10) });

  function addSubject(event) {
    event.preventDefault();
    data.addSubject(form);
    setForm({ name: '', color: '#2dd4bf', description: '' });
  }

  function addContent(event) {
    event.preventDefault();
    data.addContent(selectedSubject.id, content);
    setContent({ title: '', summary: '', difficulty: 'média', status: 'não iniciado', lastReview: new Date().toISOString().slice(0, 10) });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <PageTitle kicker="Central de disciplinas" title="Matérias e conteúdos" />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="grid gap-4 md:grid-cols-2">
          {data.subjects.map((subject) => {
            const performance = calculatePerformance(data.questions, { subjectId: subject.id });
            const priority = calculatePriority(subject, data.tasks, data.questions);
            return (
              <article key={subject.id} onClick={() => setSelected(subject.id)} className={`glass-card cursor-pointer p-5 ${selectedSubject?.id === subject.id ? 'ring-2 ring-teal-300/40' : ''}`}>
                <div className="flex items-start justify-between"><div className="h-4 w-14 rounded-full" style={{ background: subject.color }} /><span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold capitalize text-teal-100">{priority}</span></div>
                <h2 className="mt-5 text-2xl font-black">{subject.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{subject.description}</p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm"><Metric value={`${performance}%`} label="Desempenho" /><Metric value={subject.contents.length} label="Conteúdos" /><Metric value={data.tasks.filter((task) => task.subjectId === subject.id).length} label="Tarefas" /></div>
                <div className="mt-5 flex gap-2"><button onClick={(event) => { event.stopPropagation(); data.updateSubject(subject.id, { name: `${subject.name}*` }); }} className="btn-outline flex-1 py-2"><Edit3 className="h-4 w-4" />Editar</button><button onClick={(event) => { event.stopPropagation(); data.deleteSubject(subject.id); }} className="btn-outline py-2 text-red-200"><Trash2 className="h-4 w-4" /></button></div>
              </article>
            );
          })}
        </section>
        <aside className="space-y-4">
          <form onSubmit={addSubject} className="glass-card space-y-3 p-5"><h3 className="text-xl font-black">Adicionar matéria</h3><Field label="Nome"><input className="input-field" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="Cor"><input className="input-field h-12" type="color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} /></Field><Field label="Descrição"><textarea className="input-field" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field><button className="btn-primary w-full"><Plus className="h-4 w-4" />Adicionar</button></form>
          {selectedSubject && <form onSubmit={addContent} className="glass-card space-y-3 p-5"><h3 className="text-xl font-black">Conteúdo em {selectedSubject.name}</h3><Field label="Título"><input className="input-field" required value={content.title} onChange={(event) => setContent({ ...content, title: event.target.value })} /></Field><Field label="Resumo"><textarea className="input-field" value={content.summary} onChange={(event) => setContent({ ...content, summary: event.target.value })} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Dificuldade"><select className="input-field" value={content.difficulty} onChange={(event) => setContent({ ...content, difficulty: event.target.value })}><option>baixa</option><option>média</option><option>alta</option></select></Field><Field label="Status"><select className="input-field" value={content.status} onChange={(event) => setContent({ ...content, status: event.target.value })}><option>não iniciado</option><option>estudando</option><option>revisado</option><option>dominado</option></select></Field></div><Field label="Última revisão"><input className="input-field" type="date" value={content.lastReview} onChange={(event) => setContent({ ...content, lastReview: event.target.value })} /></Field><button className="btn-primary w-full">Adicionar conteúdo</button></form>}
        </aside>
      </div>
    </div>
  );
}

function Metric({ value, label }) { return <div className="rounded-2xl bg-white/5 p-3"><p className="font-black">{value}</p><p className="text-xs text-slate-500">{label}</p></div>; }
export function PageTitle({ kicker, title, text }) { return <div><p className="section-kicker">{kicker}</p><h1 className="mt-2 text-3xl font-black md:text-5xl">{title}</h1>{text && <p className="mt-2 text-slate-400">{text}</p>}</div>; }
