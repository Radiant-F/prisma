import { MdSearch, MdNotificationsNone, MdMenu } from "react-icons/md";

interface TodoHeaderProps {
  onMenuClick?: () => void;
}

export const TodoHeader = ({ onMenuClick }: TodoHeaderProps) => {
  return (
    <header className="flex items-center justify-between py-6 px-6 md:px-8">
      {/* Mobile Menu & Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
        >
          <MdMenu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Good Morning, Alex
          </h1>
          <p className="text-sm text-slate-400">Tuesday, January 13</p>
        </div>
      </div>

      {/* Search & Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:bg-white/10 focus-within:border-purple-500/50 transition-all w-64">
          <MdSearch size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 ml-2 w-full"
          />
        </div>

        <button className="p-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all relative">
          <MdNotificationsNone size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-slate-900"></span>
        </button>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-0.5 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <span className="font-bold text-xs text-white">AJ</span>
          </div>
        </div>
      </div>
    </header>
  );
};
