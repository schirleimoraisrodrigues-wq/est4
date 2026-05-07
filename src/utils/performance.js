export function calculatePerformance(questions = [], filter = {}) {
  const attempts = questions
    .filter((question) => Object.entries(filter).every(([key, value]) => !value || question[key] === value))
    .flatMap((question) => question.attempts || []);

  if (!attempts.length) return 0;
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return Math.round((correct / attempts.length) * 100);
}

export function countAnswered(questions = []) {
  return questions.reduce((total, question) => total + (question.attempts?.length || 0), 0);
}
