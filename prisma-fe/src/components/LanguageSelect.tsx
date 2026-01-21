import { useI18n, type Language } from "@/i18n";
import type { ChangeEvent } from "react";

type LanguageSelectProps = {
  showLabel?: boolean;
  className?: string;
  selectClassName?: string;
};

export const LanguageSelect = ({
  showLabel = true,
  className = "",
  selectClassName = "",
}: LanguageSelectProps) => {
  const { language, setLanguage, t } = useI18n();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      {showLabel && (
        <span className="text-xs font-semibold theme-muted">
          {t("languageLabel")}
        </span>
      )}
      <select
        value={language}
        onChange={handleChange}
        className={`px-3 py-2 rounded-lg border text-xs outline-none bg-[var(--ghost-bg)] border-[var(--ghost-border)] text-[var(--text-primary)] ${selectClassName}`.trim()}
        aria-label={t("languageLabel")}
      >
        <option value="en">{t("languageEnglish")}</option>
        <option value="id">{t("languageIndonesian")}</option>
      </select>
    </div>
  );
};
