import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { MdSearch, MdNotificationsNone, MdMenu } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useLogoutMutation } from "@/features/auth/services/authApiSlice";
import { logout } from "@/features/auth/services/authReducer";
import { setSearch } from "@/features/todo/services/todoState";
import { useI18n } from "@/i18n";

interface TodoHeaderProps {
  onMenuClick?: () => void;
}

export const TodoHeader = ({ onMenuClick }: TodoHeaderProps) => {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [search, setSearchValue] = useState("");
  const [logoutApi, logoutState] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } finally {
      dispatch(logout());
      navigate("/auth");
    }
  };

  const initials = user?.username
    ? user.username
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join("")
    : t("homeInitialsFallback");

  const dateLabel = useMemo(() => {
    const locale = language === "id" ? "id-ID" : "en-US";
    return new Date().toLocaleDateString(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [language]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setSearch(search));
    }, 300);

    return () => clearTimeout(timeout);
  }, [dispatch, search]);

  return (
    <header className="flex items-center justify-between py-6 px-6 md:px-8">
      {/* Mobile Menu & Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg bg-[var(--ghost-bg)] text-[var(--text-muted)] hover:bg-[var(--ghost-hover)] transition-colors"
        >
          <MdMenu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {t("homeGreeting")},{" "}
            {user?.username ?? t("homeGreetingFallbackName")}
          </h1>
          <p className="text-sm theme-muted">{dateLabel}</p>
        </div>
      </div>

      {/* Search & Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center theme-input border rounded-xl px-4 py-2.5 focus-within:bg-[var(--ghost-hover)] focus-within:border-purple-500/50 transition-all w-64">
          <MdSearch size={20} className="theme-muted" />
          <input
            type="text"
            placeholder={t("homeSearchPlaceholder")}
            value={search}
            onChange={(event) => setSearchValue(event.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] theme-placeholder ml-2 w-full"
          />
        </div>

        <button className="p-2.5 rounded-xl bg-[var(--ghost-bg)] text-[var(--text-muted)] hover:bg-[var(--ghost-hover)] border border-[var(--ghost-border)] transition-all relative">
          <MdNotificationsNone size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-[var(--surface-strong)]"></span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            disabled={logoutState.isLoading}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[var(--ghost-bg)] hover:bg-[var(--ghost-hover)] border border-[var(--ghost-border)] rounded-xl text-[var(--text-primary)] transition-all disabled:opacity-60"
          >
            {logoutState.isLoading
              ? t("sidebarSigningOut")
              : t("sidebarSignOut")}
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-0.5 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[var(--surface-strong)] rounded-[10px] flex items-center justify-center">
              <span className="font-bold text-xs text-[var(--text-primary)]">
                {initials}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
