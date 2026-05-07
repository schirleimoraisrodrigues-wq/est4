import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BookOpen, CalendarDays, CheckSquare, GraduationCap, HelpCircle, Layers, User } from 'lucide-react';

const items = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/calendario', label: 'Calendário', icon: CalendarDays },
  { to: '/materias', label: 'Matérias', icon: GraduationCap },
  { to: '/tarefas', label: 'Tarefas', icon: CheckSquare },
  { to: '/questoes', label: 'Questões', icon: HelpCircle },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export default function AppShell() {
  return (
    <div className="min-h-screen bg-terminal-bg text-white">
      <aside className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-terminal-bg/95 px-2 py-2 backdrop-blur lg:bottom-auto lg:right-auto lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-t-0 lg:p-6">
        <div className="mb-10 hidden lg:flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-500/20 text-teal-200"><BookOpen /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Terminal</p>
            <p className="font-black">Engenharia</p>
          </div>
        </div>
        <nav className="grid grid-cols-7 gap-1 lg:flex lg:flex-col lg:gap-2">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.65rem] font-semibold transition lg:flex-row lg:px-4 lg:py-3 lg:text-sm ${isActive ? 'bg-teal-500/15 text-teal-200' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="pb-24 lg:ml-72 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
