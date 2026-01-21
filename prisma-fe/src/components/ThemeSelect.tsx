import type { ChangeEvent } from "react";
import { useTheme, type ThemeMode } from "@/theme";
import { useI18n } from "@/i18n";

type ThemeSelectProps = {
  showLabel?: boolean;
  className?: string;
  selectClassName?: string;
};

export const ThemeSelect = ({
  showLabel = true,
  className = "",
  selectClassName = "",
}: ThemeSelectProps) => {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as ThemeMode);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      {showLabel && (
        <span className="text-xs font-semibold theme-muted">
          {t("themeLabel")}
        </span>
      )}
      <select
        value={theme}
        onChange={handleChange}
        className={`px-3 py-2 rounded-lg border text-xs outline-none bg-[var(--ghost-bg)] border-[var(--ghost-border)] text-[var(--text-primary)] ${selectClassName}`.trim()}
        aria-label={t("themeLabel")}
      >
        <option value="system">{t("themeSystem")}</option>
        <option value="light">{t("themeLight")}</option>
        <option value="dark">{t("themeDark")}</option>
      </select>
    </div>
  );
};
