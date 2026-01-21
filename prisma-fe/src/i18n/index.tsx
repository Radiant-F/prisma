import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Language = "en" | "id";

const DEFAULT_LANGUAGE: Language = "en";
const STORAGE_KEY = "prisma.language";

const translations = {
  en: {
    languageLabel: "Language",
    languageEnglish: "English",
    languageIndonesian: "Bahasa Indonesia",

    themeLabel: "Theme",
    themeSystem: "Device",
    themeLight: "Light",
    themeDark: "Dark",

    settingsTitle: "Settings",

    navFeatures: "Features",
    navDemo: "Demo",
    navPricing: "Pricing",
    navLogin: "Log in",
    navGetStarted: "Get Started",

    heroBadge: "v2.0 is now live",
    heroTitleLine1: "Organize your",
    heroTitleHighlight: "chaos",
    heroTitleLine2: "effortlessly.",
    heroSubtitle:
      "Prisma isn't just a todo list. It's a clarity engine. Break down complex projects into nestable sub-tasks, filter by importance, and regain your flow state.",
    heroCtaPrimary: "Start for free",
    heroCtaSecondary: "Watch demo",

    featuresTitle: "Crafted for focus",
    featuresSubtitle:
      "Everything you need to get things done, minus the clutter.",
    feature1Title: "Nested Sub-tasks",
    feature1Desc:
      "Break big goals into manageable chunks. Infinite nesting allows you to detail every step of your project.",
    feature2Title: "Smart Organization",
    feature2Desc:
      "Tag, filter, and sort by importance. Keep your work life separate from your personal groceries.",
    feature3Title: "Voice & Quick Add",
    feature3Desc:
      "Capture ideas instantly. With our clutter-free interface, adding a new task takes milliseconds.",

    footerRights: "© 2026 Prisma Inc. All rights reserved.",

    sidebarAll: "All",
    sidebarImportant: "Important",
    sidebarCompleted: "Completed",
    sidebarTags: "Tags",
    sidebarNewTagPlaceholder: "New tag name",
    sidebarTagNameRequired: "Tag name is required.",
    sidebarTagMaxChars: "Max 32 characters.",
    sidebarColorHint: "Use hex color like #8B5CF6.",
    sidebarAddTag: "Add Tag",
    sidebarSaving: "Saving...",
    sidebarSave: "Save",
    sidebarCancel: "Cancel",
    sidebarNoTags: "No tags created.",
    sidebarSettings: "Settings",
    sidebarSignOut: "Sign Out",
    sidebarSigningOut: "Signing out...",
  },
  id: {
    languageLabel: "Bahasa",
    languageEnglish: "English",
    languageIndonesian: "Bahasa Indonesia",

    themeLabel: "Tema",
    themeSystem: "Perangkat",
    themeLight: "Terang",
    themeDark: "Gelap",

    settingsTitle: "Pengaturan",

    navFeatures: "Fitur",
    navDemo: "Demo",
    navPricing: "Harga",
    navLogin: "Masuk",
    navGetStarted: "Mulai",

    heroBadge: "v2.0 sudah rilis",
    heroTitleLine1: "Atur",
    heroTitleHighlight: "kekacauanmu",
    heroTitleLine2: "dengan mudah.",
    heroSubtitle:
      "Prisma bukan sekadar daftar tugas. Ini adalah mesin kejernihan. Pecah proyek kompleks menjadi sub-tugas bersarang, filter berdasarkan prioritas, dan kembalikan fokus Anda.",
    heroCtaPrimary: "Mulai gratis",
    heroCtaSecondary: "Tonton demo",

    featuresTitle: "Dibuat untuk fokus",
    featuresSubtitle:
      "Semua yang Anda butuhkan untuk menyelesaikan pekerjaan, tanpa kekacauan.",
    feature1Title: "Sub-tugas Bersarang",
    feature1Desc:
      "Bagi tujuan besar menjadi bagian yang mudah dikelola. Bersarang tanpa batas membantu Anda merinci setiap langkah proyek.",
    feature2Title: "Organisasi Cerdas",
    feature2Desc:
      "Beri tag, filter, dan urutkan berdasarkan prioritas. Pisahkan pekerjaan dari urusan pribadi Anda.",
    feature3Title: "Suara & Tambah Cepat",
    feature3Desc:
      "Tangkap ide dengan cepat. Dengan antarmuka bebas gangguan, menambah tugas hanya perlu milidetik.",

    footerRights: "© 2026 Prisma Inc. Hak cipta dilindungi.",

    sidebarAll: "Semua",
    sidebarImportant: "Penting",
    sidebarCompleted: "Selesai",
    sidebarTags: "Tag",
    sidebarNewTagPlaceholder: "Nama tag baru",
    sidebarTagNameRequired: "Nama tag wajib diisi.",
    sidebarTagMaxChars: "Maks 32 karakter.",
    sidebarColorHint: "Gunakan warna heks seperti #8B5CF6.",
    sidebarAddTag: "Tambah Tag",
    sidebarSaving: "Menyimpan...",
    sidebarSave: "Simpan",
    sidebarCancel: "Batal",
    sidebarNoTags: "Belum ada tag.",
    sidebarSettings: "Pengaturan",
    sidebarSignOut: "Keluar",
    sidebarSigningOut: "Sedang keluar...",
  },
} as const;

type Translations = typeof translations.en;

type TranslationKey = keyof Translations;

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "id" || stored === "en" ? stored : DEFAULT_LANGUAGE;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: TranslationKey) => translations[language][key],
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};

export type { Language, TranslationKey };
