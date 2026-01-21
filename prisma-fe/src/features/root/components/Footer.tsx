import { useI18n } from "@/i18n";

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="relative z-10 py-12 px-6 border-t theme-divider text-center theme-muted text-sm">
      <p>{t("footerRights")}</p>
    </footer>
  );
};
