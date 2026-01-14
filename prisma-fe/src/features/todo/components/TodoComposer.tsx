import { MdAdd, MdCalendarToday, MdLabelOutline } from "react-icons/md";

export const TodoComposer = () => {
  return (
    <div className="mb-8">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:bg-white/10 transition-all shadow-lg shadow-black/20">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="p-1 rounded-full bg-purple-500/20 text-purple-400">
            <MdAdd size={20} />
          </div>
          <input
            type="text"
            placeholder="Add a new task..."
            className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full text-base py-2"
          />
        </div>

        <div className="flex items-center justify-between px-3 pb-1 mt-1 border-t border-white/5 pt-2">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <MdCalendarToday size={14} />
              <span>Today</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <MdLabelOutline size={14} />
              <span>Tag</span>
            </button>
          </div>
          <button className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-purple-500/20">
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};
