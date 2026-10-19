import type { Task, TaskRequest } from '../types/task';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Erreur API (${res.status}): ${errorBody}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const taskApi = {
  getAll: (): Promise<Task[]> =>
    fetch(`${API_BASE}/tasks`).then(handleResponse<Task[]>),

  getById: (id: number): Promise<Task> =>
    fetch(`${API_BASE}/tasks/${id}`).then(handleResponse<Task>),

  create: (payload: TaskRequest): Promise<Task> =>
    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse<Task>),

  update: (id: number, payload: TaskRequest): Promise<Task> =>
    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse<Task>),

  delete: (id: number): Promise<void> =>
    fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' }).then(
      handleResponse<void>,
    ),
};
