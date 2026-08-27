import { useState, useEffect, useCallback } from "react";
import { UserCheck, UserX, Eye, X } from "lucide-react";
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

function RegistrationsPanel({ adminToken, onPendingCountChange }) {
  const [users, setUsers] = useState([]);
  const [proofModal, setProofModal] = useState(null); // { user, url } | null

  const refreshUsers = useCallback(async () => {
    try {
      const data = await api.get("/api/users", adminToken);
      setUsers(data);
      onPendingCountChange?.(data.filter(u => u.status === "pending").length);
    } catch {
      setUsers([]);
    }
  }, [adminToken, onPendingCountChange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUsers();
  }, [refreshUsers]);

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

  return (
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
  );
}

export default RegistrationsPanel;
