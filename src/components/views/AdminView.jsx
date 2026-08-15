import { useState, useEffect } from "react";
import { Shield, Bell, CheckCircle, Clock, AlertCircle, LogOut, Inbox, Trash2, Edit3, Plus, Save } from "lucide-react";

function AdminView({ grievances, setGrievances, attendance, setAttendance, questions, setQuestions, onLogout, onDelete }) {
  const [adminTab, setAdminTab] = useState("Grievances"); // "Grievances" | "Legislative"
  
  // Legislative Form States
  const [attForm, setAttForm] = useState({ totalSessions: attendance.totalSessions, daysAttended: attendance.daysAttended });
  const [qForm, setQForm] = useState({ date: "", topic: "", summary: "" });
  
  // Update attendance form when prop changes
  useEffect(() => {
    setAttForm({ totalSessions: attendance.totalSessions, daysAttended: attendance.daysAttended });
  }, [attendance]);
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  // Derive selected grievance always from latest global state (avoids stale closure)
  const selectedGrievance = grievances.find(g => g.id === selectedId) || null;

  const newCount = grievances.filter(g => g.isNew).length;

  const filteredGrievances = grievances
    .filter(g => {
      if (filter === "All") return true;
      return g.status === filter;
    })
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const markAsRead = (id) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, isNew: false } : g));
  };

  const markAllRead = () => {
    setGrievances(prev => prev.map(g => ({ ...g, isNew: false })));
  };

  const updateStatus = (id, newStatus) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: newStatus } : g));
  };

  const handleSelect = (g) => {
    setSelectedId(g.id);
    if (g.isNew) markAsRead(g.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":   return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "In Progress":return "bg-blue-50 text-blue-700 border-blue-100";
      default:           return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const total    = grievances.length;
  const pending  = grievances.filter(g => g.status === "Pending").length;
  const progress = grievances.filter(g => g.status === "In Progress").length;
  const resolved = grievances.filter(g => g.status === "Resolved").length;

  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-200">

      {/* Page Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">Admin Portal</h2>
            <p className="text-slate-500 mt-0.5 text-sm">Constituency Grievance Monitoring Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell Summary */}
          {newCount > 0 ? (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition cursor-pointer"
            >
              <Bell className="h-4 w-4 animate-[wiggle_0.8s_ease-in-out_infinite]" />
              <span>{newCount} Unread — Mark all Read</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
              <Bell className="h-4 w-4" />
              <span>No new notifications</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Master Toggle */}
      <div className="flex justify-center border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setAdminTab("Grievances")}
            className={`px-6 py-3 font-bold border-b-2 transition-all cursor-pointer ${
              adminTab === "Grievances" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Public Grievances
          </button>
          <button
            onClick={() => setAdminTab("Legislative")}
            className={`px-6 py-3 font-bold border-b-2 transition-all cursor-pointer ${
              adminTab === "Legislative" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Legislative Data
          </button>
        </div>
      </div>

      {adminTab === "Grievances" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
          {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Petitions",    val: total,    icon: Shield,       color: "border-slate-100 text-slate-800" },
          { label: "Pending Reviews",    val: pending,  icon: AlertCircle,  color: "border-amber-100 text-amber-700 bg-amber-50/30" },
          { label: "In Action",          val: progress, icon: Clock,        color: "border-blue-100 text-blue-700 bg-blue-50/30" },
          { label: "Resolved",           val: resolved, icon: CheckCircle,  color: "border-emerald-100 text-emerald-700 bg-emerald-50/30" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`border rounded-2xl p-5 flex items-center justify-between bg-white shadow-xs ${stat.color}`}>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                <span className="text-3xl font-extrabold mt-1 block">{stat.val}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 border border-current/10">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Grievance Cards (latest first via data.js push-to-front) */}
        <div className="lg:col-span-2 space-y-3">
          {filteredGrievances.length > 0 ? filteredGrievances.map(g => (
            <div
              key={g.id}
              onClick={() => handleSelect(g)}
              className={`group p-5 rounded-2xl bg-white border cursor-pointer hover:shadow-sm transition-all flex justify-between items-start gap-4 ${
                selectedId === g.id
                  ? "border-slate-900 ring-1 ring-slate-900/10 shadow-sm"
                  : g.isNew
                  ? "border-red-200 bg-red-50/20"
                  : "border-slate-100"
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{g.id}</span>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="text-xs text-slate-400">{g.date}</span>
                  {g.isNew && (
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

        {/* Right: Grievance Inspector */}
        <div className="lg:col-span-1">
          {selectedGrievance ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5 sticky top-24 animate-in slide-in-from-right duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedGrievance.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusColor(selectedGrievance.status)}`}>
                    {selectedGrievance.status}
                  </span>
                </div>
                <h3 className="font-black text-slate-800 text-base leading-snug">{selectedGrievance.subject}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedGrievance.date}</p>
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
                        onDelete(selectedGrievance.id);
                        setSelectedId(null);
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
      )}

      {adminTab === "Legislative" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Attendance Form */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-emerald-600" />
                  Update Attendance
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Total Sessions</label>
                    <input
                      type="number"
                      value={attForm.totalSessions}
                      onChange={(e) => setAttForm(p => ({ ...p, totalSessions: parseInt(e.target.value) || 0 }))}
                      className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Days Attended</label>
                    <input
                      type="number"
                      value={attForm.daysAttended}
                      onChange={(e) => setAttForm(p => ({ ...p, daysAttended: parseInt(e.target.value) || 0 }))}
                      className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setAttendance(attForm);
                      alert("Attendance updated successfully!");
                    }}
                    className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-bold rounded-lg p-2.5 hover:bg-emerald-700 transition cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    Save Attendance
                  </button>
                </div>
              </div>
            </div>

            {/* Questions Form & List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Question Form */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-emerald-600" />
                  Add Assembly Question
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
                    <input
                      type="text"
                      placeholder="e.g. Aug 12, 2026"
                      value={qForm.date}
                      onChange={(e) => setQForm(p => ({ ...p, date: e.target.value }))}
                      className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Topic</label>
                    <input
                      type="text"
                      value={qForm.topic}
                      onChange={(e) => setQForm(p => ({ ...p, topic: e.target.value }))}
                      className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Summary / Details</label>
                  <textarea
                    rows="2"
                    value={qForm.summary}
                    onChange={(e) => setQForm(p => ({ ...p, summary: e.target.value }))}
                    className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  onClick={() => {
                    if (qForm.date && qForm.topic && qForm.summary) {
                      const newQ = { id: `Q-${new Date().getFullYear()}-${Math.floor(100+Math.random()*900)}`, ...qForm };
                      setQuestions(prev => [newQ, ...prev]);
                      setQForm({ date: "", topic: "", summary: "" });
                    }
                  }}
                  className="flex justify-center items-center gap-2 bg-slate-900 text-white font-bold rounded-lg px-6 py-2.5 hover:bg-slate-800 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-700">Existing Questions</h3>
                {questions.map((q) => (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-start gap-4">
                    <div>
                      <div className="flex gap-2 items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{q.id}</span>
                        <span className="text-xs font-bold text-emerald-600">{q.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{q.topic}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{q.summary}</p>
                    </div>
                    <button
                      onClick={() => setQuestions(prev => prev.filter(item => item.id !== q.id))}
                      className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition cursor-pointer shrink-0"
                      title="Delete Question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      )}

    </div>
  );
}

export default AdminView;
