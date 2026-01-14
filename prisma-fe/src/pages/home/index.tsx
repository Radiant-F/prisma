import { useState } from "react";
import {
  TodoHeader,
  TodoSidebar,
  TodoComposer,
  TodoList,
} from "../../features/todo";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white font-sans overflow-hidden flex">
      {/* Background Blobs (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
            fixed md:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
        `}
      >
        <TodoSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
        <TodoHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-6 md:px-8 pb-12 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-3xl mx-auto w-full">
            <TodoComposer />
            <TodoList />
          </div>
        </main>
      </div>
    </div>
  );
}
