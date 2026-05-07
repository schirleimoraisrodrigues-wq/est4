import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, UserPlus } from 'lucide-react';
import { loginUser, registerUser } from '../services/auth';
import { setSession } from '../services/storage';

export default function AuthPage({ mode, onAuth }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const user = isRegister ? registerUser(form) : loginUser(form);
      setSession(user);
      onAuth(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 text-white">
      <section className="glass-card grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-teal-900/50 p-8 lg:p-12">
          <div className="mb-16 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <BookOpen className="text-teal-200" />
            <span className="font-black">Terminal Engenharia</span>
          </div>
          <p className="section-kicker">Organização gamificada</p>
          <h1 className="mt-4 text-4xl font-black leading-tight lg:text-6xl">Estude como quem comanda um painel de engenharia.</h1>
          <p className="mt-6 max-w-xl text-slate-300">Centralize matérias, tarefas, provas, questões e flashcards. O modo offline com LocalStorage mantém o app funcional enquanto Firebase ou Supabase não são conectados.</p>
        </div>
        <form onSubmit={submit} className="space-y-5 p-8 lg:p-12">
          <div>
            <p className="section-kicker">{isRegister ? 'Criar conta' : 'Acessar conta'}</p>
            <h2 className="mt-2 text-3xl font-black">{isRegister ? 'Cadastro' : 'Login'}</h2>
          </div>
          {isRegister && (
            <label className="relative block">
              <UserPlus className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input className="input-field pl-12" placeholder="Nome" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
          )}
          <label className="relative block">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
            <input className="input-field pl-12" type="email" placeholder="E-mail" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="relative block">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
            <input className="input-field pl-12" type="password" placeholder="Senha" required minLength={4} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
          {error && <p className="rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <button className="btn-primary w-full" type="submit">{isRegister ? 'Criar conta' : 'Entrar'}</button>
          <p className="text-center text-sm text-slate-400">{isRegister ? 'Já tem conta?' : 'Novo por aqui?'} <Link className="font-bold text-teal-200" to={isRegister ? '/login' : '/cadastro'}>{isRegister ? 'Entrar' : 'Criar cadastro'}</Link></p>
        </form>
      </section>
    </main>
  );
}
