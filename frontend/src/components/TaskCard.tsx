import { Draggable } from '@hello-pangea/dnd';
import type { Task } from '../types/task';

interface Props {
  task: Task;
  index: number;
  onDelete: (id: number) => void;
}

const PRIORITY_LABELS = { LOW: 'Basse', MEDIUM: 'Moyenne', HIGH: 'Haute' } as const;

export function TaskCard({ task, index, onDelete }: Props) {
  return (
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`task-card priority-${task.priority.toLowerCase()} ${snapshot.isDragging ? 'is-dragging' : ''}`}
                style={{ ...provided.draggableProps.style }}
            >
              <div className="task-header">
                <span className="badge priority">{PRIORITY_LABELS[task.priority]}</span>
                <button className="btn-delete-icon" onClick={() => onDelete(task.id)} title="Supprimer">
                  ✕
                </button>
              </div>
              <h3 className="task-title">{task.title}</h3>
              {task.description && <p className="task-desc">{task.description}</p>}
              <div className="task-footer">
                <span className="task-id">#{task.id}</span>
              </div>
            </div>
        )}
      </Draggable>
  );
}