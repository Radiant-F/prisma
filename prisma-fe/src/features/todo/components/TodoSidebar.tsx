import { Link } from "react-router";
import {
  MdDashboard,
  MdStar,
  MdCheckCircle,
  MdAdd,
  MdSettings,
  MdLogout,
} from "react-icons/md";

export const TodoSidebar = ({ className = "" }: { className?: string }) => {
  const navItems = [
    { icon: <MdDashboard size={20} />, label: "My Day", active: true },
    {
      icon: <MdStar size={20} />,
      label: "Important",
      iconClass: "text-amber-400",
    },
    { icon: <MdCheckCircle size={20} />, label: "Completed" },
  ];

  const tags = [
    { label: "Design", color: "bg-pink-500" },
    { label: "Development", color: "bg-purple-500" },
    { label: "Marketing", color: "bg-indigo-500" },
  ];

  return (
    <aside
      className={`flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border-r border-white/10 ${className}`}
    >
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="font-bold text-white text-lg">P</span>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          Prisma
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        {/* Main Filters */}
        <div className="space-y-1">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium
                ${
                  item.active
                    ? "bg-white/10 text-white shadow-lg shadow-purple-500/10 border border-white/5"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <span className={`transition-colors ${item.iconClass || ""}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Tags Section */}
        <div>
          <div className="px-4 mb-3 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Tags</span>
            <button className="hover:text-white transition-colors">
              <MdAdd size={16} />
            </button>
          </div>
          <div className="space-y-1">
            {tags.map((tag, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm group"
              >
                <div
                  className={`w-2 h-2 rounded-full ${tag.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
                />
                <span>{tag.label}</span>
                <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                  2
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm">
          <MdSettings size={20} />
          Settings
        </button>
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm"
        >
          <MdLogout size={20} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
};
