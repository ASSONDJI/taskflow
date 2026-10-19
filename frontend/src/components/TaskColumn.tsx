import { Droppable } from '@hello-pangea/dnd';
import type { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

interface Props {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onDelete: (id: number) => void;
}

export function TaskColumn({ status, title, tasks, onDelete }: Props) {
  return (
    <div className="kanban-column">
      <div className="column-header">
        <h2>{title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-body ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onDelete={onDelete} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
