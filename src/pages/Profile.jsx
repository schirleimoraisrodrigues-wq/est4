import { Award, CheckCircle2, Flame, Target } from 'lucide-react';
import { useAppData } from '../hooks/useAppData.jsx';
import { countAnswered, calculatePerformance } from '../utils/performance';
import { PageTitle } from './Subjects';

export default function Profile() {
  const { profile, tasks, questions } = useAppData();
  const stats = [
    { icon: Flame, label: 'Sequência de estudos', value: `${profile.streak} dias` },
    { icon: CheckCircle2, label: 'Tarefas concluídas', value: tasks.filter((task) => task.status === 'concluído').length },
    { icon: Award, label: 'Questões respondidas', value: countAnswered(questions) },
    { icon: Target, label: 'Taxa geral de acertos', value: `${calculatePerformance(questions)}%` },
  ];
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10"><PageTitle kicker="Perfil" title="Seu progresso" /><section className="glass-card p-6"><p className="text-sm text-slate-400">Nome</p><h2 className="text-3xl font-black">{profile.name}</h2><p className="mt-4 text-sm text-slate-400">E-mail</p><p className="font-semibold text-teal-100">{profile.email}</p></section><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map(({ icon: Icon, label, value }) => <article key={label} className="glass-card p-5"><Icon className="text-teal-200" /><p className="mt-6 text-3xl font-black">{value}</p><p className="text-sm text-slate-400">{label}</p></article>)}</section></div>;
}
