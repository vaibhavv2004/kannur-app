import { useState, useEffect } from "react";
import { keyStats, newsArticles } from "../../constants/data";
import { ArrowRight, ChevronRight, FileText, Settings, Award, Users } from "lucide-react";
import siteConfig from "../../config/siteConfig";
import EditableText from "../common/EditableText";
import SectionTitle from "../common/SectionTitle";

function HomeView({ setCurrentTab, isAdmin }) {
  // Local state for editable content
  const [heroTitle, setHeroTitle] = useState(() => sessionStorage.getItem("cms_home_title") || "Dedicated to the Growth of Kannur");
  const [heroSubtitle, setHeroSubtitle] = useState(() => sessionStorage.getItem("cms_home_subtitle") || `Welcome to the official web portal of ${siteConfig.mlaName}. Together, let's build a smarter, healthier, and more prosperous constituency.`);
  
  const [stats, setStats] = useState(() => {
    const saved = sessionStorage.getItem("cms_home_stats");
    return saved ? JSON.parse(saved) : keyStats;
  });

  // Sync to session storage
  useEffect(() => sessionStorage.setItem("cms_home_title", heroTitle), [heroTitle]);
  useEffect(() => sessionStorage.setItem("cms_home_subtitle", heroSubtitle), [heroSubtitle]);
  useEffect(() => sessionStorage.setItem("cms_home_stats", JSON.stringify(stats)), [stats]);

  const updateStat = (idx, field, newValue) => {
    const newStats = [...stats];
    newStats[idx][field] = newValue;
    setStats(newStats);
  };
  const quickActions = [
    { title: "Submit Grievance", desc: "File public petitions or raise local issues", icon: FileText, tab: "/contact", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { title: "Welfare Schemes", desc: "Find eligibility and register for local benefits", icon: Award, tab: "/schemes", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { title: "Development Works", desc: "Track road, sports, and infrastructure progress", icon: Settings, tab: "/development", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { title: "Meet the MLA", desc: "View Camp office details and public hours", icon: Users, tab: "/contact", color: "bg-purple-50 text-purple-600 border-purple-100" }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-1"></div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-8 py-16 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400 border border-emerald-500/20">
              <span>Democratic Representation</span>
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent pb-1">
              <EditableText
                value={heroTitle}
                onSave={setHeroTitle}
                isAdmin={isAdmin}
                inputClassName="text-xl font-bold bg-white/10 border-white/30 text-slate-800"
              />
            </h2>
            <p className="max-w-md text-lg text-slate-300">
              <EditableText
                value={heroSubtitle}
                onSave={setHeroSubtitle}
                isAdmin={isAdmin}
                multiline={true}
                inputClassName="text-sm font-normal bg-white/10 border-white/30 text-slate-800"
              />
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setCurrentTab("/contact")}
                className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-700 transition cursor-pointer"
              >
                <span>Submit Grievance</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentTab("/about")}
                className="flex items-center space-x-2 rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-750 transition cursor-pointer"
              >
                <span>Read Biography</span>
              </button>
            </div>
          </div>
          
          {/* Hero Image Side */}
          <div className="mt-12 lg:mt-0 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-20 blur-xl group-hover:opacity-30 transition"></div>
              <img
                src="mla.jpg"
                alt={siteConfig.mlaName}
                className="relative z-10 w-80 h-96 object-cover rounded-2xl border-4 border-slate-800 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-white rounded-3xl border border-emerald-50 p-8 shadow-xs">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <span className="text-3xl font-extrabold text-slate-800 bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                <EditableText value={stat.value} onSave={(val) => updateStat(idx, "value", val)} isAdmin={isAdmin} />
              </span>
              <span className="text-sm font-bold text-slate-700 mt-1">
                <EditableText value={stat.label} onSave={(val) => updateStat(idx, "label", val)} isAdmin={isAdmin} />
              </span>
              <span className="text-xs text-slate-500 mt-1">
                <EditableText value={stat.desc} onSave={(val) => updateStat(idx, "desc", val)} isAdmin={isAdmin} multiline={true} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="space-y-6">
        <SectionTitle title="Quick Citizen Portal" subtitle="Access digital services and updates instantly. Click any card to redirect to the respective tab." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={() => setCurrentTab(action.tab)}
                className={`group border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between ${action.color}`}
              >
                <div>
                  <div className="inline-flex p-3 rounded-xl bg-white shadow-xs mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-850 mb-1">{action.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{action.desc}</p>
                </div>
                <div className="flex items-center text-xs font-bold mt-4 opacity-70 group-hover:opacity-100 transition">
                  <span>Open Portal</span>
                  <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent News Snippet */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-850">Recent Activities</h3>
            <p className="text-slate-500 text-sm">Stay updated with latest decisions and events in the constituency.</p>
          </div>
          <button
            onClick={() => setCurrentTab("/news")}
            className="flex items-center space-x-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            <span>View All News</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsArticles.slice(0, 2).map((article) => (
            <div key={article.id} className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-100 hover:shadow-md transition">
              <img
                src={article.image}
                alt={article.title}
                className="w-full md:w-44 h-48 md:h-full object-cover shrink-0"
              />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">{article.category}</span>
                  <h4 className="font-bold text-slate-800 text-lg mt-2 line-clamp-2 leading-snug">{article.title}</h4>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">{article.summary}</p>
                </div>
                <span className="text-xs font-medium text-slate-400 mt-4">{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomeView;
