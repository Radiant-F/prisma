import { useState } from "react";
import { Link } from "react-router";
import { MdSettings } from "react-icons/md";
import { LanguageSelect, ThemeSelect } from "@/components";
import { useI18n } from "@/i18n";

export const Navigation = () => {
  const { t } = useI18n();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <nav className="relative z-50 w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto text-[var(--text-primary)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Prisma</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
          <a
            href="#features"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            {t("navFeatures")}
          </a>
          <a
            href="#demo"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            {t("navDemo")}
          </a>
          <a
            href="#pricing"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            {t("navPricing")}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors hidden sm:block"
          >
            {t("navLogin")}
          </Link>
          <Link
            to="/auth"
            className="px-5 py-2.5 bg-[var(--ghost-bg)] hover:bg-[var(--ghost-hover)] border border-[var(--ghost-border)] rounded-xl text-sm font-semibold backdrop-blur-md transition-all"
          >
            {t("navGetStarted")}
          </Link>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl bg-[var(--ghost-bg)] hover:bg-[var(--ghost-hover)] border border-[var(--ghost-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            aria-label="Open settings"
          >
            <MdSettings size={18} />
          </button>
        </div>
      </nav>

      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="w-full max-w-sm theme-card border rounded-2xl shadow-2xl p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {t("settingsTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <LanguageSelect
                showLabel
                className="flex-col items-start gap-2"
                selectClassName="w-full"
              />
              <ThemeSelect
                showLabel
                className="flex-col items-start gap-2"
                selectClassName="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
