import { MdFormatListBulleted, MdLayers, MdMic } from "react-icons/md";

export const Features = () => {
  return (
    <section
      id="features"
      className="relative z-10 py-24 bg-slate-900/50 backdrop-blur-sm border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Crafted for focus</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Everything you need to get things done, minus the clutter.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <MdFormatListBulleted className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Nested Sub-tasks</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Break big goals into manageable chunks. Infinite nesting allows
              you to detail every step of your project.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <MdLayers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Organization</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tag, filter, and sort by importance. Keep your work life separate
              from your personal groceries.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <MdMic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Voice & Quick Add</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Capture ideas instantly. With our clutter-free interface, adding a
              new task takes milliseconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
