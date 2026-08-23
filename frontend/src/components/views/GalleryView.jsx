import { useState, useEffect } from "react";
import { X, ZoomIn, PlayCircle } from "lucide-react";
import { api } from "../../lib/api";

function extractYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}

function GalleryView() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    api.get("/api/gallery").then(setItems).catch(() => setItems([]));
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = filter === "All"
    ? items
    : items.filter(item => item.category === filter);

  return (
    <div className="space-y-8 py-8">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-4 text-center sm:text-left">
        <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">Media Gallery</h2>
        <p className="text-slate-500 mt-1">Glimpses of development projects, citizen interactions, and events in Kannur.</p>
      </div>

      {/* Category Tabs */}
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs hover:shadow-md transition duration-300"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={item.media_type === "video" ? `https://img.youtube.com/vi/${extractYouTubeId(item.url)}/hqdefault.jpg` : item.url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                  {item.media_type === "video" ? <PlayCircle className="h-6 w-6" /> : <ZoomIn className="h-6 w-6" />}
                </div>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{item.category}</span>
              <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/90 p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white rounded-full bg-white/10 p-2 cursor-pointer transition"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center space-y-4">
            {selectedItem.media_type === "video" ? (
              <div className="w-full aspect-video rounded-lg shadow-2xl border border-white/10 overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(selectedItem.url)}`}
                  title={selectedItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
              />
            )}
            <div className="text-center text-white space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{selectedItem.category}</span>
              <h3 className="text-lg font-bold">{selectedItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryView;
