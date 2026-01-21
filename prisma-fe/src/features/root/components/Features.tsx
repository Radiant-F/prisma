import { MdFormatListBulleted, MdLayers, MdMic } from "react-icons/md";
import { useI18n } from "@/i18n";

export const Features = () => {
  const { t } = useI18n();

  return (
    <section
      id="features"
      className="relative z-10 py-24 theme-surface border-t theme-divider backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t("featuresTitle")}</h2>
          <p className="theme-muted max-w-2xl mx-auto">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl theme-card border hover:border-[var(--card-border-hover)] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <MdFormatListBulleted className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("feature1Title")}</h3>
            <p className="theme-muted text-sm leading-relaxed">
              {t("feature1Desc")}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl theme-card border hover:border-pink-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <MdLayers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("feature2Title")}</h3>
            <p className="theme-muted text-sm leading-relaxed">
              {t("feature2Desc")}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl theme-card border hover:border-indigo-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <MdMic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("feature3Title")}</h3>
            <p className="theme-muted text-sm leading-relaxed">
              {t("feature3Desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
