import { useEffect, useState } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { taskApi } from './api/taskApi';
import { TaskForm } from './components/TaskForm';
import { TaskColumn } from './components/TaskColumn';
import type { Task, TaskRequest, TaskStatus } from './types/task';
import './App.css';

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'TODO', title: 'À faire' },
  { status: 'IN_PROGRESS', title: 'En cours' },
  { status: 'IN_REVIEW', title: 'En revue' },
  { status: 'DONE', title: 'Terminé' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gestion du thème
  const [theme, setTheme] = useState<'light' | 'dark'>(
      (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  async function refresh() {
    try {
      setError(null);
      setTasks(await taskApi.getAll());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(payload: TaskRequest) {
    try {
      const created = await taskApi.create(payload);
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: number) {
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  // Gestion du Drag & Drop
  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;

    // Déposé en dehors d'une colonne
    if (!destination) return;

    // Déposé au même endroit
    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
      return;
    }

    // Optimistic UI update
    const id = Number(draggableId);
    const newStatus = destination.droppableId as TaskStatus;
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (!taskToUpdate) return;

    // Mise à jour locale immédiate
    setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    // Appel API
    try {
      await taskApi.update(id, {
        title: taskToUpdate.title,
        description: taskToUpdate.description ?? undefined,
        status: newStatus,
        priority: taskToUpdate.priority,
        dueDate: taskToUpdate.dueDate,
      });
    } catch (e) {
      // Rollback en cas d'erreur
      setError((e as Error).message);
      refresh();
    }
  }

  return (
      <div className="app">
        <header>
          <div className="header-left">
            <h1>📋 TaskFlow</h1>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
            </button>
          </div>
        </header>

        <main>
          <TaskForm onSubmit={handleCreate} />

          {error && <div className="error">⚠️ {error}</div>}

          {loading ? (
              <p className="loading">Chargement...</p>
          ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                  {COLUMNS.map((col) => (
                      <TaskColumn
                          key={col.status}
                          status={col.status}
                          title={col.title}
                          tasks={tasks.filter((t) => t.status === col.status)}
                          onDelete={handleDelete}
                      />
                  ))}
                </div>
              </DragDropContext>
          )}
        </main>
      </div>
  );
}