const USERS_KEY = 'terminal_engenharia_users';

function loadUsers() {
  const saved = localStorage.getItem(USERS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser({ name, email, password }) {
  const users = loadUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error('Este e-mail já está cadastrado.');
  }
  const user = { id: crypto.randomUUID(), name, email, password };
  saveUsers([...users, user]);
  return { id: user.id, name, email };
}

export function loginUser({ email, password }) {
  const user = loadUsers().find((item) => item.email === email && item.password === password);
  if (!user) throw new Error('E-mail ou senha inválidos.');
  return { id: user.id, name: user.name, email: user.email };
}
