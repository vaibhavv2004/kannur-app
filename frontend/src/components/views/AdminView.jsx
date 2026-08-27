import { useState } from "react";
import { Shield, Bell, LogOut } from "lucide-react";
import GrievancesPanel from "../admin/GrievancesPanel";
import RegistrationsPanel from "../admin/RegistrationsPanel";
import GalleryPanel from "../admin/GalleryPanel";
import ContentPanel from "../admin/ContentPanel";
import { api } from "../../lib/api";

const TABS = ["Grievances", "Registrations", "Gallery", "Content"];

function AdminView({ adminToken, grievances, refreshGrievances, onLogout }) {
  const [adminTab, setAdminTab] = useState("Grievances");
  const [pendingUsersCount, setPendingUsersCount] = useState(0);

  const newCount = grievances.filter(g => g.is_new).length;

  const markAllRead = async () => {
    await Promise.all(grievances.filter(g => g.is_new).map(g => api.patch(`/api/grievances/${g.id}`, { status: g.status }, adminToken)));
    refreshGrievances();
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
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Admin Portal</h2>
            <p className="text-slate-500 mt-0.5 text-sm">Constituency Management Dashboard</p>
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
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setAdminTab(tab)}
              className={`px-6 py-3 font-bold border-b-2 transition-all cursor-pointer relative ${
                adminTab === tab ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab === "Grievances" ? "Public Grievances" : tab}
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
        <GrievancesPanel adminToken={adminToken} grievances={grievances} refreshGrievances={refreshGrievances} />
      )}

      {adminTab === "Registrations" && (
        <RegistrationsPanel adminToken={adminToken} onPendingCountChange={setPendingUsersCount} />
      )}

      {adminTab === "Gallery" && (
        <GalleryPanel adminToken={adminToken} />
      )}

      {adminTab === "Content" && (
        <ContentPanel adminToken={adminToken} />
      )}

    </div>
  );
}

export default AdminView;
