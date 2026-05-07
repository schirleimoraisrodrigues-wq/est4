import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadState, saveState } from '../services/storage';

const AppDataContext = createContext(null);

export function AppDataProvider({ children, user }) {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (user) {
      setState((current) => ({ ...current, profile: { ...current.profile, name: user.name, email: user.email } }));
    }
  }, [user]);

  const actions = useMemo(() => ({
    addSubject(subject) {
      setState((current) => ({ ...current, subjects: [...current.subjects, { ...subject, id: crypto.randomUUID(), contents: [] }] }));
    },
    updateSubject(id, values) {
      setState((current) => ({ ...current, subjects: current.subjects.map((subject) => (subject.id === id ? { ...subject, ...values } : subject)) }));
    },
    deleteSubject(id) {
      setState((current) => ({ ...current, subjects: current.subjects.filter((subject) => subject.id !== id) }));
    },
    addContent(subjectId, content) {
      setState((current) => ({
        ...current,
        subjects: current.subjects.map((subject) => (subject.id === subjectId
          ? { ...subject, contents: [...subject.contents, { ...content, id: crypto.randomUUID() }] }
          : subject)),
      }));
    },
    addTask(task) {
      setState((current) => ({ ...current, tasks: [...current.tasks, { ...task, id: crypto.randomUUID() }] }));
    },
    updateTask(id, values) {
      setState((current) => ({ ...current, tasks: current.tasks.map((task) => (task.id === id ? { ...task, ...values } : task)) }));
    },
    addQuestion(question) {
      setState((current) => ({ ...current, questions: [...current.questions, { ...question, id: crypto.randomUUID(), attempts: [] }] }));
    },
    answerQuestion(questionId, answer) {
      setState((current) => ({
        ...current,
        questions: current.questions.map((question) => {
          if (question.id !== questionId) return question;
          const correct = answer === question.correctAnswer || answer === question.answer;
          return { ...question, attempts: [...(question.attempts || []), { answer, correct, at: new Date().toISOString() }] };
        }),
      }));
    },
  }), []);

  return <AppDataContext.Provider value={{ ...state, ...actions }}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData deve ser usado dentro de AppDataProvider');
  return context;
}
