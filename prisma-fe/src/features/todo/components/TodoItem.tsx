import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdStar,
  MdStarBorder,
  MdDeleteOutline,
  MdEdit,
} from "react-icons/md";
import type { Todo } from "../todo";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onToggleImportance: (todo: Todo) => void;
  onToggleSubtask: (todo: Todo, subtaskId: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export const TodoItem = ({
  todo,
  onToggleComplete,
  onToggleImportance,
  onToggleSubtask,
  onEdit,
  onDelete,
}: TodoItemProps) => {
  const completed = todo.completed;
  const important = todo.importance >= 4;
  const dueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : undefined;
  const subtasks = todo.subtasks;

  return (
    <div
      className={`group relative p-4 rounded-2xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2
        ${
          completed
            ? "bg-[var(--surface-strong)] border-[var(--card-border)] opacity-60 hover:opacity-100"
            : "theme-card border hover:bg-[var(--card-hover)] hover:border-[var(--card-border-hover)] hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-0.5"
        }
    `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          className={`mt-0.5 text-xl transition-colors ${
            completed
              ? "text-emerald-400"
              : "text-[var(--text-muted)] hover:text-purple-400"
          }`}
          onClick={() => onToggleComplete(todo)}
        >
          {completed ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-base font-medium truncate pr-8 ${
                completed
                  ? "theme-subtle line-through decoration-slate-400"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {todo.title}
            </h3>
            <button
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                important
                  ? "opacity-100 text-amber-400"
                  : "text-[var(--text-subtle)] hover:text-amber-400"
              }`}
              onClick={() => onToggleImportance(todo)}
            >
              {important ? <MdStar size={20} /> : <MdStarBorder size={20} />}
            </button>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {todo.tags.map((tag) => (
              <span
                key={tag.id}
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider theme-pill px-2 py-1 rounded-md border"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tag.color ?? "#64748B" }}
                />
                {tag.name}
              </span>
            ))}

            {dueDate && (
              <span
                className={`text-xs ${
                  completed ? "theme-subtle" : "theme-muted"
                }`}
              >
                {dueDate}
              </span>
            )}
          </div>

          {/* Subtasks (if any) */}
          {subtasks && subtasks.length > 0 && (
            <div className="mt-3 space-y-1 relative">
              {/* Line connector */}
              <div className="absolute left-[-23px] top-[-10px] bottom-2 w-px bg-[var(--divider)] rounded-full" />

              {subtasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 text-sm theme-muted hover:text-[var(--text-primary)] cursor-pointer"
                  onClick={() => onToggleSubtask(todo, task.id)}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      task.completed
                        ? "bg-emerald-500/50"
                        : "bg-[var(--ghost-border)]"
                    }`}
                  />
                  <span
                    className={task.completed ? "line-through opacity-60" : ""}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-4 right-12 flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
        <button
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--ghost-hover)] rounded-lg transition-colors"
          title="Edit"
          onClick={() => onEdit(todo)}
        >
          <MdEdit size={16} />
        </button>
        <button
          className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-400/10 rounded-lg transition-colors"
          title="Delete"
          onClick={() => onDelete(todo)}
        >
          <MdDeleteOutline size={16} />
        </button>
      </div>
    </div>
  );
};
