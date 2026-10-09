import { useState, useEffect, useCallback } from "react";
import { Images, Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/api";

function extractYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}

function GalleryPanel({ adminToken }) {
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
    refreshGallery();
  }, [refreshGallery]);

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
  );
}

export default GalleryPanel;
