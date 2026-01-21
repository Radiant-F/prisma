import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/hooks";
import {
  TodoHeader,
  TodoSidebar,
  TodoComposer,
  TodoList,
} from "../../features/todo";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isReady } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isReady, navigate]);

  return (
    <div className="min-h-screen theme-page font-sans overflow-hidden flex">
      {/* Background Blobs (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob bg-[var(--blob-1)]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-[var(--blob-2)]" />
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
