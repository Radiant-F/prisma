import { Navigation, Hero, Features, Footer } from "../../features/root";

export default function LandingPage() {
  return (
    <div className="min-h-screen theme-page selection:bg-purple-500/30 font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob bg-[var(--blob-1)]" />
        <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000 bg-[var(--blob-2)]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000 bg-[var(--blob-3)]" />
      </div>

      <Navigation />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
