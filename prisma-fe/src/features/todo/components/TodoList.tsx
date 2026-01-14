import { TodoItem } from "./TodoItem";

export const TodoList = () => {
  return (
    <div className="space-y-4 pb-20">
      {/* Pending Tasks */}
      <div className="space-y-3">
        <TodoItem
          title="Design Dashboard Mockups"
          category="Design"
          categoryColor="bg-pink-500"
          important
          subtasks={[
            { label: "Dark mode palette", completed: true },
            { label: "Component spacing", completed: false },
          ]}
        />
        <TodoItem
          title="Client Meeting: Q1 Roadmap"
          dueDate="Today 2:00 PM"
          category="Marketing"
          categoryColor="bg-indigo-500"
        />
        <TodoItem
          title="Fix navigation bug on mobile"
          category="Development"
          categoryColor="bg-purple-500"
        />
      </div>

      {/* Section Header */}
      {/* <div className="pt-4 flex items-center gap-4">
        <div className="h-px bg-white/10 flex-1"></div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Completed</span>
        <div className="h-px bg-white/10 flex-1"></div>
      </div> */}

      {/* Completed Tasks (Optional, visually separated) */}
      <div className="pt-2 opacity-80">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">
          Done
        </h4>
        <div className="space-y-3">
          <TodoItem
            title="Weekly Sync with Team"
            completed
            category="General"
            categoryColor="bg-slate-400"
          />
          <TodoItem title="Email response to Sarah" completed />
        </div>
      </div>
    </div>
  );
};
