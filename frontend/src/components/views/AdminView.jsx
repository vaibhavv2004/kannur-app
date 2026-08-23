import { useState, useEffect, useCallback } from "react";
import { Shield, Bell, CheckCircle, Clock, AlertCircle, LogOut, Inbox, Trash2, Edit3, Plus, Save, UserCheck, UserX, Eye, Images, X } from "lucide-react";
import { api } from "../../lib/api";

const ID_PROOF_LABELS = {
  aadhaar: "Aadhaar Card",
  voter_id: "Voter ID",
  pan: "PAN Card",
  passport: "Passport",
  driving_licence: "Driving Licence",
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function AdminView({ adminToken, grievances, refreshGrievances, attendance, setAttendance, questions, setQuestions, onLogout }) {
  const [adminTab, setAdminTab] = useState("Grievances"); // "Grievances" | "Legislative" | "Registrations" | "Gallery"

  // Legislative Form States
  const [attForm, setAttForm] = useState({ totalSessions: attendance.totalSessions, daysAttended: attendance.daysAttended });
  const [qForm, setQForm] = useState({ date: "", topic: "", summary: "" });

  // Keeps the edit form in sync whenever the attendance prop changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttForm({ totalSessions: attendance.totalSessions, daysAttended: attendance.daysAttended });
  }, [attendance]);

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

  const markAllRead = async () => {
    await Promise.all(grievances.filter(g => g.is_new).map(g => api.patch(`/api/grievances/${g.id}`, { status: g.status }, adminToken)));
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

  // --- Registrations tab state ---
  const [users, setUsers] = useState([]);
  const [proofModal, setProofModal] = useState(null); // { user, url } | null
  const pendingUsersCount = users.filter(u => u.status === "pending").length;

  const refreshUsers = useCallback(async () => {
    try {
      const data = await api.get("/api/users", adminToken);
      setUsers(data);
    } catch {
      setUsers([]);
    }
  }, [adminToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (adminTab === "Registrations") refreshUsers();
  }, [adminTab, refreshUsers]);

  const viewIdProof = async (user) => {
    const url = await api.getBlobUrl(`/api/users/${user.id}/id-proof`, adminToken);
    setProofModal({ user, url });
  };

  const closeProofModal = () => {
    if (proofModal) URL.revokeObjectURL(proofModal.url);
    setProofModal(null);
  };

  const approveUser = async (id) => {
    await api.post(`/api/users/${id}/approve`, {}, adminToken);
    refreshUsers();
  };

  const rejectUser = async (id) => {
    await api.post(`/api/users/${id}/reject`, {}, adminToken);
    refreshUsers();
  };

  // --- Gallery tab state ---
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryForm, setGalleryForm] = useState({ title: "", category: "Community", media_type: "image", url: "" });

  const refreshGallery = useCallback(async () => {
    try {
      const data = await api.get("/api/gallery");
      setGalleryItems(data);
    } catch {
      setGalleryItems([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (adminTab === "Gallery") refreshGallery();
  }, [adminTab, refreshGallery]);

  const addGalleryItem = async (e) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.url) return;
    await api.post("/api/gallery", galleryForm, adminToken);
    setGalleryForm({ title: "", category: "Community", media_type: "image", url: "" });
    refreshGallery();
  };

  const deleteGalleryItem = async (id) => {
    await api.del(`/api/gallery/${id}`, adminToken);
    refreshGallery();
  };

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
        <div className="flex gap-4 flex-wrap">
          {["Grievances", "Registrations", "Gallery", "Legislative"].map(tab => (
            <button
              key={tab}
              onClick={() => setAdminTab(tab)}
              className={`px-6 py-3 font-bold border-b-2 transition-all cursor-pointer relative ${
                adminTab === tab ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab === "Grievances" ? "Public Grievances" : tab === "Legislative" ? "Legislative Data" : tab}
              {tab === "Registrations" && pendingUsersCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold align-middle">
                  {pendingUsersCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {adminTab === "Grievances" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
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
      )}

      {adminTab === "Registrations" && (
        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
              <UserCheck className="h-10 w-10 opacity-40" />
              <p className="text-sm font-medium">No citizen registrations yet.</p>
            </div>
          ) : (
            users.map(u => (
              <div key={u.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-800 text-sm">{u.full_name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      u.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : u.status === "rejected" ? "bg-red-50 text-red-700 border-red-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {u.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{u.phone} · {u.email}</p>
                  <p className="text-[10px] text-slate-400">{ID_PROOF_LABELS[u.id_proof_type] || u.id_proof_type} · Registered {formatDate(u.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => viewIdProof(u)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> View ID Proof
                  </button>
                  {u.status === "pending" && (
                    <>
                      <button
                        onClick={() => approveUser(u.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition cursor-pointer"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => rejectUser(u.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition cursor-pointer"
                      >
                        <UserX className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}

          {proofModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={closeProofModal}>
              <div className="bg-white rounded-2xl p-4 max-w-lg w-full space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm">{proofModal.user.full_name}'s ID Proof</h4>
                  <button onClick={closeProofModal} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {proofModal.user.id_proof_type && proofModal.url && (
                  <object data={proofModal.url} type="application/pdf" className="w-full h-96 rounded-lg border border-slate-100">
                    <img src={proofModal.url} alt="ID proof" className="w-full rounded-lg border border-slate-100" />
                  </object>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {adminTab === "Gallery" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          <form onSubmit={addGalleryItem} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Images className="h-5 w-5 text-emerald-600" />
              Add Gallery Item
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                <input
                  type="text" required value={galleryForm.title}
                  onChange={(e) => setGalleryForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <input
                  type="text" required value={galleryForm.category}
                  onChange={(e) => setGalleryForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                  {["image", "video"].map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setGalleryForm(p => ({ ...p, media_type: t }))}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition cursor-pointer capitalize ${
                        galleryForm.media_type === t ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  {galleryForm.media_type === "video" ? "YouTube URL" : "Image URL"}
                </label>
                <input
                  type="url" required placeholder={galleryForm.media_type === "video" ? "https://www.youtube.com/watch?v=..." : "https://..."}
                  value={galleryForm.url}
                  onChange={(e) => setGalleryForm(p => ({ ...p, url: e.target.value }))}
                  className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <button type="submit" className="flex items-center gap-2 bg-emerald-600 text-white font-bold rounded-lg px-6 py-2.5 hover:bg-emerald-700 transition cursor-pointer">
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map(item => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.media_type === "video"
                      ? `https://img.youtube.com/vi/${extractYouTubeId(item.url)}/hqdefault.jpg`
                      : item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase">{item.category} · {item.media_type}</span>
                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                  </div>
                  <button
                    onClick={() => deleteGalleryItem(item.id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === "Legislative" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

            <div className="lg:col-span-2 space-y-6">
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

function extractYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}

export default AdminView;
