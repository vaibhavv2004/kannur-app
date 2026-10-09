import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import PageHeader from "../common/PageHeader";
import { api } from "../../lib/api";

function ConstituencyView() {
  const { t } = useTranslation();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    api.get("/api/content/constituency").then((res) => setPageData(res.data)).catch(() => setPageData(null));
  }, []);

  const content = pageData;

  if (!content) return null;

  return (
    <div className="space-y-12 py-8">
      {/* Page Header */}
      <PageHeader title={t("constituency.pageTitle")} description={t("constituency.pageDesc")} />

      {/* History and Demographics */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-emerald-50 rounded-2xl p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2">
              <Info className="h-5 w-5 text-emerald-600" />
              <span>{t("constituency.heritageHeading")}</span>
            </h3>
            {content.heritageParagraphs.map((para, idx) => (
              <p key={idx} className="text-slate-600 text-sm leading-relaxed">{para}</p>
            ))}
          </div>
        </div>

        {/* Quick Facts Panel */}
        <div className="space-y-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-2">{t("constituency.quickFactsHeading")}</h3>
          <div className="space-y-4">
            {content.quickFacts.map((fact, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-400"></div>
                <div>
                  <span className="text-xs text-slate-400 block">{fact.label}</span>
                  <span className="text-sm font-bold text-slate-200">{fact.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landmarks Grid */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-850 text-center sm:text-left">{t("constituency.landmarksHeading")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.landmarks.map((landmark, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition">
              <img
                src={landmark.image}
                alt={landmark.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 space-y-2">
                <h4 className="font-bold text-slate-850 text-lg">{landmark.name}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{landmark.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ConstituencyView;
