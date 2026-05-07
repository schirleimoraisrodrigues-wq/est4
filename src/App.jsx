import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { AppDataProvider } from './hooks/useAppData.jsx';
import { getSession } from './services/storage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Questions from './pages/Questions';
import Flashcards from './pages/Flashcards';
import Profile from './pages/Profile';

export default function App() {
  const [user, setUser] = useState(() => getSession());

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage mode="login" onAuth={setUser} />} />
      <Route path="/cadastro" element={user ? <Navigate to="/" replace /> : <AuthPage mode="register" onAuth={setUser} />} />
      <Route element={<ProtectedRoute user={user} />}>
        <Route element={<AppDataProvider user={user}><AppShell /></AppDataProvider>}>
          <Route index element={<Dashboard onLogout={() => setUser(null)} />} />
          <Route path="calendario" element={<Calendar />} />
          <Route path="materias" element={<Subjects />} />
          <Route path="tarefas" element={<Tasks />} />
          <Route path="questoes" element={<Questions />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}
