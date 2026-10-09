import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CircleCheck, Clock, ShieldAlert } from "lucide-react";
import PageHeader from "../common/PageHeader";
import { api } from "../../lib/api";

function DevelopmentView() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("All");
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    api.get("/api/content/development").then((res) => setPageData(res.data)).catch(() => setPageData(null));
  }, []);

  const categories = ["All", "Infrastructure", "Healthcare", "Sports", "Tourism", "Education"];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CircleCheck className="h-4 w-4 text-emerald-600" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-slate-600" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const content = pageData;

  if (!content) return null;

  const filteredProjects = filter === "All"
    ? content.projects
    : content.projects.filter(p => p.category === filter);

  return (
    <div className="space-y-8 py-8">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <PageHeader bordered={false} title={t("development.pageTitle")} description={t("development.pageDesc")} />
        <div className="flex h-10 items-center justify-center rounded-lg bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-700">
          <span>{t("development.activeFundsAllocated", { amount: content.activeFundsAllocated })}</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-sm rounded-lg border font-medium transition cursor-pointer ${
              filter === cat
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t(`development.categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{t(`development.categories.${project.category}`, project.category)}</span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${getStatusStyle(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span>{t(`development.statusLabels.${project.status}`, project.status)}</span>
                </div>
              </div>
              <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{project.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{project.desc}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">{t("development.progress")}</span>
                <span className="text-slate-800 font-bold">{project.progress}%</span>
              </div>
              {/* Progress Bar Container */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-400 font-medium">{t("development.allocatedBudget")}</span>
                <span className="text-slate-800 font-bold">{project.budget}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DevelopmentView;
