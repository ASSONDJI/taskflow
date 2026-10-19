import { useState } from 'react';
import type { TaskPriority, TaskRequest } from '../types/task';

interface Props {
  onSubmit: (payload: TaskRequest) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre de la tâche"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description (optionnelle)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
      >
        <option value="LOW">Basse</option>
        <option value="MEDIUM">Moyenne</option>
        <option value="HIGH">Haute</option>
      </select>
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? 'Ajout...' : 'Ajouter'}
      </button>
    </form>
  );
}
