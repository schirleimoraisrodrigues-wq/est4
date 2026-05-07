import { calculatePerformance } from './performance.js';

const DAY = 1000 * 60 * 60 * 24;
const priorityLabels = ['baixa', 'média', 'alta', 'urgente'];

export function calculatePriority(subject, tasks = [], questions = [], now = new Date()) {
  let score = 0;
  const performance = calculatePerformance(questions, { subjectId: subject.id });
  const relatedTasks = tasks.filter((task) => task.subjectId === subject.id);

  if (performance < 50) score += 2;
  if (performance >= 50 && performance < 70) score += 1;

  relatedTasks.forEach((task) => {
    const due = new Date(`${task.dueDate}T12:00:00`);
    const days = Math.ceil((due - now) / DAY);
    if (task.status !== 'concluído' && days < 0) score += 3;
    if (task.type === 'prova' && days >= 0 && days <= 7) score += 2;
    if (task.priority === 'alta') score += 1;
  });

  const difficult = subject.contents.filter((content) => content.difficulty === 'alta').length;
  score += difficult >= 2 ? 2 : difficult;

  subject.contents.forEach((content) => {
    const last = content.lastReview ? new Date(`${content.lastReview}T12:00:00`) : null;
    if (!last || (now - last) / DAY > 21) score += 1;
  });

  return priorityLabels[Math.min(priorityLabels.length - 1, Math.floor(score / 2))];
}
