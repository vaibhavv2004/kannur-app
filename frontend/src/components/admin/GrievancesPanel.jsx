import { useState } from "react";
import { Shield, Clock, AlertCircle, CheckCircle, Inbox, Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import { getStatusColor } from "../../lib/grievanceStatus";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function GrievancesPanel({ adminToken, grievances, refreshGrievances }) {
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  const selectedGrievance = grievances.find(g => g.id === selectedId) || null;
  const newCount = grievances.filter(g => g.is_new).length;

  const filteredGrievances = grievances
    .filter(g => filter === "All" || g.status === filter)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const markAsRead = async (g) => {
    if (!g.is_new) return;
    await api.patch(`/api/grievances/${g.id}`, { status: g.status }, adminToken);
    refreshGrievances();
  };

  const updateStatus = async (id, newStatus) => {
    await api.patch(`/api/grievances/${id}`, { status: newStatus }, adminToken);
    refreshGrievances();
  };

  const deleteGrievance = async (id) => {
    await api.del(`/api/grievances/${id}`, adminToken);
    setSelectedId(null);
    refreshGrievances();
  };

  const handleSelect = (g) => {
    setSelectedId(g.id);
    markAsRead(g);
  };

  const total = grievances.length;
  const pending = grievances.filter(g => g.status === "Pending").length;
  const progress = grievances.filter(g => g.status === "In Progress").length;
  const resolved = grievances.filter(g => g.status === "Resolved").length;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Petitions", val: total, icon: Shield, color: "border-slate-100 text-slate-800" },
          { label: "Pending Reviews", val: pending, icon: AlertCircle, color: "border-amber-100 text-amber-700 bg-amber-50/30" },
          { label: "In Action", val: progress, icon: Clock, color: "border-blue-100 text-blue-700 bg-blue-50/30" },
          { label: "Resolved", val: resolved, icon: CheckCircle, color: "border-emerald-100 text-emerald-700 bg-emerald-50/30" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`border rounded-2xl p-5 flex items-center justify-between bg-white shadow-xs ${stat.color}`}>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                <span className="text-2xl font-extrabold mt-1 block">{stat.val}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 border border-current/10">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {["All", "Pending", "In Progress", "Resolved"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all cursor-pointer ${
              filter === tab ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
            {tab === "All" && newCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold">
                {newCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredGrievances.length > 0 ? filteredGrievances.map(g => (
            <div
              key={g.id}
              onClick={() => handleSelect(g)}
              className={`group p-5 rounded-2xl bg-white border cursor-pointer hover:shadow-sm transition-all flex justify-between items-start gap-4 ${
                selectedId === g.id
                  ? "border-slate-900 ring-1 ring-slate-900/10 shadow-sm"
                  : g.is_new
                  ? "border-red-200 bg-red-50/20"
                  : "border-slate-100"
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{g.petition_id}</span>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="text-xs text-slate-400">{formatDate(g.created_at)}</span>
                  {g.is_new && (
                    <span className="flex items-center gap-1 bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block"></span>
                      New
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm leading-snug truncate">{g.subject}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{g.message}</p>
                <p className="text-[10px] font-semibold text-slate-400">{g.name} · {g.category}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${getStatusColor(g.status)}`}>
                {g.status}
              </span>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
              <Inbox className="h-10 w-10 opacity-40" />
              <p className="text-sm font-medium">No grievances in this category.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedGrievance ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5 sticky top-24 animate-in slide-in-from-right duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedGrievance.petition_id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusColor(selectedGrievance.status)}`}>
                    {selectedGrievance.status}
                  </span>
                </div>
                <h3 className="font-black text-slate-800 text-base leading-snug">{selectedGrievance.subject}</h3>
                <p className="text-xs text-slate-400 mt-1">{formatDate(selectedGrievance.created_at)}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Citizen Details</span>
                  <p className="font-bold text-slate-800 text-sm">{selectedGrievance.name}</p>
                  <p className="text-slate-500">{selectedGrievance.phone}</p>
                  <p className="text-slate-500">{selectedGrievance.email}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</span>
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-md border border-emerald-100">
                    {selectedGrievance.category}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedGrievance.message}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Update Status</span>
                <div className="flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    {["Pending", "In Progress", "Resolved"].map(st => (
                      <button
                        key={st}
                        onClick={() => updateStatus(selectedGrievance.id, st)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                          selectedGrievance.status === st
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this grievance? This action cannot be undone.")) {
                        deleteGrievance(selectedGrievance.id);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition cursor-pointer"
                    title="Delete spam/unnecessary grievance"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-3 py-20">
              <Inbox className="h-10 w-10 opacity-30" />
              <p>Click any grievance on the left to view details and update its status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrievancesPanel;
