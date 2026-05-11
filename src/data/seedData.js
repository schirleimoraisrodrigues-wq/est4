export const seedSubjects = [
  {
    id: 'calculo',
    name: 'Cálculo',
    color: '#2dd4bf',
    description: 'Limites, derivadas, integrais e aplicações em engenharia.',
    contents: [
      { id: 'vigas', title: 'Deformação de Vigas', summary: 'Linha elástica, flecha máxima e condições de contorno.', difficulty: 'alta', status: 'estudando', lastReview: '2026-04-20' },
      { id: 'numericos', title: 'Métodos Numéricos', summary: 'Bisseção, Newton-Raphson e interpolação.', difficulty: 'média', status: 'não iniciado', lastReview: '2026-03-22' },
    ],
  },
  {
    id: 'hidraulica',
    name: 'Hidráulica',
    color: '#38bdf8',
    description: 'Escoamento, energia, perdas de carga e máquinas hidráulicas.',
    contents: [
      { id: 'bernoulli', title: 'Equação de Bernoulli', summary: 'Conservação de energia em linhas de corrente.', difficulty: 'alta', status: 'estudando', lastReview: '2026-04-12' },
      { id: 'fluidos', title: 'Mecânica dos Fluidos', summary: 'Propriedades, estática e dinâmica dos fluidos.', difficulty: 'média', status: 'revisado', lastReview: '2026-04-29' },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    color: '#a78bfa',
    description: 'Programação aplicada, análise de dados e automação.',
    contents: [
      { id: 'listas', title: 'Listas e Funções', summary: 'Coleções, funções puras e resolução de exercícios.', difficulty: 'baixa', status: 'dominado', lastReview: '2026-05-01' },
    ],
  },
  {
    id: 'fisica',
    name: 'Física',
    color: '#fb7185',
    description: 'Mecânica, energia, ondas e eletromagnetismo.',
    contents: [
      { id: 'cinematica', title: 'Cinemática Vetorial', summary: 'Movimento em duas dimensões e decomposição vetorial.', difficulty: 'média', status: 'não iniciado', lastReview: '2026-03-30' },
    ],
  },
];

export const seedTasks = [
  { id: 'prova-calculo', title: 'Cálculo', description: 'Prova P2: aplicações de integrais.', subjectId: 'calculo', dueDate: '2026-05-07', type: 'prova', priority: 'alta', status: 'pendente' },
  { id: 'lista-hidraulica', title: 'Lista de Bernoulli', description: 'Resolver exercícios 1 a 12.', subjectId: 'hidraulica', dueDate: '2026-05-10', type: 'tarefa', priority: 'média', status: 'em andamento' },
  { id: 'review-python', title: 'Revisão Python', description: 'Refazer cards de funções.', subjectId: 'python', dueDate: '2026-05-12', type: 'revisão', priority: 'baixa', status: 'pendente' },
];

export const seedQuestions = [
  { id: 'q1', subjectId: 'hidraulica', contentId: 'bernoulli', type: 'múltipla escolha', prompt: 'Em Bernoulli ideal, qual grandeza é conservada ao longo da linha de corrente?', options: ['Energia mecânica específica', 'Massa específica', 'Viscosidade', 'Rugosidade'], correctAnswer: 'Energia mecânica específica', attempts: [] },
  { id: 'q2', subjectId: 'calculo', contentId: 'numericos', type: 'verdadeiro ou falso', prompt: 'O método de Newton-Raphson usa derivadas para aproximar raízes.', options: ['Verdadeiro', 'Falso'], correctAnswer: 'Verdadeiro', attempts: [] },
  { id: 'card1', subjectId: 'calculo', contentId: 'vigas', type: 'cards', prompt: 'O que representa a flecha em uma viga?', answer: 'O deslocamento transversal máximo ou local provocado pelo carregamento.', attempts: [] },
];

export const initialProfile = {
  name: 'Estudante',
  email: 'estudante@terminal.dev',
  streak: 7,
};
