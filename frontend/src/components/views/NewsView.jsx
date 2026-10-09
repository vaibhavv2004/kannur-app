import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import PageHeader from "../common/PageHeader";
import { api } from "../../lib/api";

function NewsView() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    api.get("/api/content/news").then((res) => setPageData(res.data)).catch(() => setPageData(null));
  }, []);

  const categories = ["All", "Health", "Culture", "Infrastructure", "Education"];

  const content = pageData;

  if (!content) return null;

  const filteredNews = content.articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 py-8">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <PageHeader bordered={false} title={t("news.pageTitle")} description={t("news.pageDesc")} />

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("news.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-xs"
          />
        </div>
      </div>

      {/* Main Grid Layout: News (Left) & Upcoming Events (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: News Articles */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-850 border-b border-slate-50 pb-2">{t("news.latestAnnouncements")}</h3>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs rounded-full border font-semibold transition cursor-pointer ${
                  activeCategory === cat
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t(`news.categories.${cat}`)}
              </button>
            ))}
          </div>

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredNews.map((article) => (
                <div key={article.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col h-full">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{t(`news.categories.${article.category}`, article.category)}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{article.date}</span>
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-805 text-base leading-snug hover:text-emerald-700 transition cursor-pointer">
                        {article.title}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-emerald-600 group cursor-pointer hover:text-emerald-750">
                      <span>{t("news.readFullPressRelease")}</span>
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 space-y-2">
              <p className="text-slate-500 font-medium">{t("news.noAnnouncements")}</p>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Events */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-850 border-b border-slate-50 pb-2">{t("news.upcomingEvents")}</h3>

          <div className="space-y-4">
            {content.events.map((event) => (
              <div key={event.id} className="bg-slate-90 rounded-2xl p-5 border border-slate-100 flex gap-4 hover:shadow-sm transition">
                {/* Calendar Icon Visual Date */}
                <div className="flex flex-col items-center justify-center bg-emerald-600 text-white rounded-xl h-14 w-14 shrink-0 shadow-sm">
                  <span className="text-xs font-bold uppercase">{event.date.split(" ")[0]}</span>
                  <span className="text-lg font-black leading-none">{event.date.split(" ")[1].replace(",", "")}</span>
                </div>

                {/* Event Details */}
                <div className="space-y-2 flex-1">
                  <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{event.title}</h4>
                  <p className="text-slate-550 text-xs leading-relaxed">{event.desc}</p>

                  <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-450 font-medium border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default NewsView;
