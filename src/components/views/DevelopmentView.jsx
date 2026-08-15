import { useState, useEffect } from "react";
import { developmentProjects } from "../../constants/data";
import { Hammer, CircleCheck, Clock, ShieldAlert } from "lucide-react";
import EditableText from "../common/EditableText";

function DevelopmentView({ isAdmin }) {
  const [filter, setFilter] = useState("All");
  
  const [projects, setProjects] = useState(() => {
    const saved = sessionStorage.getItem("cms_dev_projects");
    return saved ? JSON.parse(saved) : developmentProjects;
  });

  useEffect(() => sessionStorage.setItem("cms_dev_projects", JSON.stringify(projects)), [projects]);

  const updateProject = (id, field, val) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const categories = ["All", "Infrastructure", "Healthcare", "Sports", "Tourism", "Education"];

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter(p => p.category === filter);

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

  return (
    <div className="space-y-8 py-8">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">Development Projects</h2>
          <p className="text-slate-500 mt-1">Track infrastructure works and community progress across the constituency.</p>
        </div>
        <div className="flex h-10 items-center justify-center rounded-lg bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-700">
          <span>Active Funds Allocated: ₹94.5 Cr</span>
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
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{project.category}</span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${getStatusStyle(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span>{project.status}</span>
                </div>
              </div>
              <h4 className="font-extrabold text-slate-800 text-lg leading-tight">
                <EditableText value={project.title} onSave={(val) => updateProject(project.id, "title", val)} isAdmin={isAdmin} />
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                <EditableText value={project.desc} onSave={(val) => updateProject(project.id, "desc", val)} isAdmin={isAdmin} multiline={true} />
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Progress</span>
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
                <span className="text-slate-400 font-medium">Allocated Budget</span>
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
