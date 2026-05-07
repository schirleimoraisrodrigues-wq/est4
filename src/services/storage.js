import { initialProfile, seedQuestions, seedSubjects, seedTasks } from '../data/seedData';

const APP_KEY = 'terminal_engenharia_state';
const AUTH_KEY = 'terminal_engenharia_auth';

export function loadState() {
  const saved = localStorage.getItem(APP_KEY);
  if (saved) return JSON.parse(saved);
  const state = { subjects: seedSubjects, tasks: seedTasks, questions: seedQuestions, profile: initialProfile };
  saveState(state);
  return state;
}

export function saveState(state) {
  localStorage.setItem(APP_KEY, JSON.stringify(state));
}

export function getSession() {
  const saved = localStorage.getItem(AUTH_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function setSession(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}
