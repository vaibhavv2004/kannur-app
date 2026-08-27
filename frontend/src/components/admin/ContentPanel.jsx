import { useState, useEffect } from "react";
import { Save, CheckCircle, FileEdit } from "lucide-react";
import { api } from "../../lib/api";
import { CONTENT_SCHEMAS } from "./contentSchemas";
import GenericContentForm from "./GenericContentForm";

function ContentPanel({ adminToken }) {
  const [activeKey, setActiveKey] = useState(CONTENT_SCHEMAS[0].key);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const activeSchema = CONTENT_SCHEMAS.find((s) => s.key === activeKey);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setSaved(false);
    setError("");
    api.get(`/api/content/${activeKey}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load this page's content."))
      .finally(() => setLoading(false));
  }, [activeKey]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/api/content/${activeKey}`, { data }, adminToken);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-2 duration-300">
      {/* Page list */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-100 rounded-2xl p-2 space-y-1 lg:sticky lg:top-24">
          {CONTENT_SCHEMAS.map((schema) => (
            <button
              key={schema.key}
              onClick={() => setActiveKey(schema.key)}
              className={`flex w-full items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition cursor-pointer ${
                activeKey === schema.key ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileEdit className="h-4 w-4 shrink-0" />
              <span>{schema.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800">{activeSchema.label}</h3>
            <button
              onClick={handleSave}
              disabled={saving || loading || !data}
              className="flex items-center gap-2 bg-emerald-600 text-white font-bold rounded-lg px-5 py-2.5 hover:bg-emerald-700 disabled:opacity-60 transition cursor-pointer"
            >
              {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>{saving ? "Saving..." : saved ? "Saved" : "Save Changes"}</span>
            </button>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          {loading ? (
            <p className="text-sm text-slate-400 text-center py-12">Loading...</p>
          ) : data ? (
            <GenericContentForm schema={activeSchema} data={data} onChange={setData} />
          ) : (
            <p className="text-sm text-slate-400 text-center py-12">No content available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentPanel;
