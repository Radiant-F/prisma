import {
  MdOutlineCheckCircle,
  MdRadioButtonUnchecked,
  MdAdd,
  MdOutlineLabel,
} from "react-icons/md";

export const Hero = () => {
  return (
    <main className="relative z-10 pt-20 pb-32 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            v2.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Organize your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              chaos
            </span>{" "}
            effortlessly.
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Prisma isn't just a todo list. It's a clarity engine. Break down
            complex projects into nestable sub-tasks, filter by importance, and
            regain your flow state.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-semibold shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
              Start for free
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold backdrop-blur-sm transition-all w-full sm:w-auto">
              Watch demo
            </button>
          </div>

          <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Fake "Used by" logos */}
            <span className="text-xl font-bold">Acme.</span>
            <span className="text-xl font-serif italic">Globex</span>
            <span className="text-xl font-mono">Soylent</span>
          </div>
        </div>

        {/* App Mockup */}
        <div className="relative perspective-1000 group">
          {/* Glow effect behind card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          {/* The Interface Card */}
          <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transform transition-transform duration-500 group-hover:rotate-y-2 group-hover:scale-[1.01]">
            {/* Mockup Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">My Tasks</h3>
                <p className="text-slate-400 text-sm">Tuesday, Jan 13</p>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <span className="text-xs font-bold">JD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <button className="px-4 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/20 whitespace-nowrap">
                All Tasks
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-medium border border-white/5 hover:bg-white/10 transition whitespace-nowrap">
                High Prio
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-medium border border-white/5 hover:bg-white/10 transition whitespace-nowrap">
                Design
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {/* Task 1: Completed */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4 group/item hover:bg-white/10 transition-colors">
                <div className="mt-1 cursor-pointer">
                  <MdOutlineCheckCircle className="text-emerald-400 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-500 line-through decoration-slate-600">
                    Morning Standup
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-500">
                      Team
                    </span>
                  </div>
                </div>
              </div>

              {/* Task 2: Active with Subtasks */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 flex items-start gap-4 group/item">
                <div className="mt-1 cursor-pointer">
                  <MdRadioButtonUnchecked className="text-white/30 hover:text-purple-400 transition-colors w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-white">
                      Website Redesign
                    </h4>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      High
                    </span>
                  </div>

                  {/* Subtasks */}
                  <div className="mt-4 space-y-2 relative">
                    <div className="absolute left-[-15px] top-2 bottom-4 w-px bg-white/10"></div>

                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                      <span className="text-xs text-slate-300">
                        Create wireframes
                      </span>
                    </div>
                    <div className="flex items-center gap-3 opacity-60">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                      <span className="text-xs text-slate-500 line-through">
                        Gather assets
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <span className="flex items-center gap-1 text-[10px] text-purple-300 font-medium">
                      <MdOutlineLabel className="w-3.5 h-3.5" /> Design
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Due Tomorrow
                    </span>
                  </div>
                </div>
              </div>

              {/* Task 3: Simple */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4 group/item hover:bg-white/10 transition-colors">
                <div className="mt-1 cursor-pointer">
                  <MdRadioButtonUnchecked className="text-white/30 hover:text-purple-400 transition-colors w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-200">
                    Review PR #402
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      Dev
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAB Mockup */}
            <div className="absolute bottom-6 right-6 w-12 h-12 bg-purple-500 rounded-full shadow-lg shadow-purple-500/40 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
              <MdAdd className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
