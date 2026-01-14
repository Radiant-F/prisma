import { Link } from "react-router";

export const Navigation = () => {
  return (
    <nav className="relative z-50 w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="font-bold text-lg">P</span>
        </div>
        <span className="text-xl font-bold tracking-tight">Prisma</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#features" className="hover:text-white transition-colors">
          Features
        </a>
        <a href="#demo" className="hover:text-white transition-colors">
          Demo
        </a>
        <a href="#pricing" className="hover:text-white transition-colors">
          Pricing
        </a>
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/auth"
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
        >
          Log in
        </Link>
        <Link
          to="/auth"
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-semibold backdrop-blur-md transition-all"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};
