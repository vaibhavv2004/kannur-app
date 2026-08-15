import { useState } from "react";
import { welfareSchemes } from "../../constants/data";
import { Search, ChevronDown, ChevronUp, Award, UserCheck, HelpCircle } from "lucide-react";

function SchemesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const categories = ["All", "Healthcare", "Education", "Employment", "Agriculture"];

  const filteredSchemes = welfareSchemes.filter((scheme) => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.benefits.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || scheme.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 py-8">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-4 text-center sm:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">Welfare Schemes</h2>
          <p className="text-slate-500 mt-1">Search government support schemes, check eligibility, and learn how to apply.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-xs"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 text-xs rounded-full border font-semibold transition cursor-pointer ${
              activeCategory === cat
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length > 0 ? (
        <div className="space-y-4">
          {filteredSchemes.map((scheme) => {
            const isExpanded = expandedId === scheme.id;
            return (
              <div key={scheme.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition">
                <div
                  onClick={() => toggleExpand(scheme.id)}
                  className="p-6 flex justify-between items-center cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{scheme.category}</span>
                    <h4 className="font-extrabold text-slate-800 text-base sm:text-lg">{scheme.title}</h4>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-500">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-4 border-t border-slate-50 bg-slate-50/50 space-y-4 animate-in slide-in-from-top duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <UserCheck className="h-4 w-4 text-blue-500" />
                          <span>Eligibility Criteria</span>
                        </h5>
                        <p className="text-slate-655 text-xs font-medium leading-relaxed">{scheme.eligibility}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-emerald-500" />
                          <span>Welfare Benefits</span>
                        </h5>
                        <p className="text-slate-655 text-xs font-medium leading-relaxed">{scheme.benefits}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="h-4 w-4 text-purple-500" />
                          <span>How to Apply</span>
                        </h5>
                        <p className="text-slate-655 text-xs font-medium leading-relaxed">{scheme.procedure}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 space-y-2">
          <p className="text-slate-500 font-medium">No welfare schemes found matching your filters.</p>
          <button
            onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
            className="text-emerald-600 hover:text-emerald-750 text-xs font-bold underline"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

export default SchemesView;
