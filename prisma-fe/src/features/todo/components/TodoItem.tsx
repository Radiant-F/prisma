import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdStar,
  MdStarBorder,
  MdDeleteOutline,
  MdEdit,
} from "react-icons/md";

interface TodoItemProps {
  title: string;
  completed?: boolean;
  important?: boolean;
  category?: string;
  categoryColor?: string;
  dueDate?: string;
  subtasks?: { label: string; completed: boolean }[];
}

export const TodoItem = ({
  title,
  completed = false,
  important = false,
  category,
  categoryColor = "bg-slate-500",
  dueDate,
  subtasks,
}: TodoItemProps) => {
  return (
    <div
      className={`group relative p-4 rounded-2xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2
        ${
          completed
            ? "bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100"
            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-0.5"
        }
    `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          className={`mt-0.5 text-xl transition-colors ${
            completed
              ? "text-emerald-400"
              : "text-slate-500 hover:text-purple-400"
          }`}
        >
          {completed ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-base font-medium truncate pr-8 ${
                completed
                  ? "text-slate-500 line-through decoration-slate-600"
                  : "text-slate-200"
              }`}
            >
              {title}
            </h3>
            <button
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                important
                  ? "opacity-100 text-amber-400"
                  : "text-slate-600 hover:text-amber-400"
              }`}
            >
              {important ? <MdStar size={20} /> : <MdStarBorder size={20} />}
            </button>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {category && (
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full ${categoryColor}`} />
                {category}
              </span>
            )}

            {dueDate && (
              <span
                className={`text-xs ${
                  completed ? "text-slate-600" : "text-slate-400"
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
              <div className="absolute left-[-23px] top-[-10px] bottom-2 w-px bg-white/10 rounded-full" />

              {subtasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 cursor-pointer"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      task.completed ? "bg-emerald-500/50" : "bg-white/20"
                    }`}
                  />
                  <span
                    className={task.completed ? "line-through opacity-60" : ""}
                  >
                    {task.label}
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
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Edit"
        >
          <MdEdit size={16} />
        </button>
        <button
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
          title="Delete"
        >
          <MdDeleteOutline size={16} />
        </button>
      </div>
    </div>
  );
};
