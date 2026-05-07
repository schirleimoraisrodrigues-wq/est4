import { Layers } from 'lucide-react';
import { useAppData } from '../hooks/useAppData.jsx';
import { PageTitle } from './Subjects';

export default function Flashcards() {
  const { questions } = useAppData();
  const cards = questions.filter((question) => question.type === 'cards');
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10"><PageTitle kicker="Revisão ativa" title="Flashcards teóricos" text="Cards de conteúdo para estudar dentro da plataforma." /><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <article key={card.id} className="group glass-card min-h-64 p-6 [perspective:1000px]"><div className="flex items-center gap-3 text-teal-200"><Layers /><span className="font-bold">Clique mental: frente e verso</span></div><h2 className="mt-8 text-2xl font-black">{card.prompt}</h2><div className="mt-6 rounded-3xl border border-teal-200/20 bg-teal-500/10 p-4 text-teal-50"><p className="text-xs font-bold uppercase tracking-widest text-teal-200">Verso</p><p className="mt-2">{card.answer}</p></div></article>)}</section></div>;
}
