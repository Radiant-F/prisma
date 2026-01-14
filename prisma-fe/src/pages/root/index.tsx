import { Navigation, Hero, Features, Footer } from "../../features/root";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-pink-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <Navigation />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
