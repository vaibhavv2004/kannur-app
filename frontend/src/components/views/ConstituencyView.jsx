import { landmarks } from "../../constants/data";
import { Info, Compass, Users, Map } from "lucide-react";
import PageHeader from "../common/PageHeader";

function ConstituencyView() {
  const quickFacts = [
    { label: "Population", value: "approx. 2.8 Lakhs", icon: Users },
    { label: "Grama Panchayats", value: "6 Panchayats + Kannur Corp.", icon: Map },
    { label: "Key Industries", value: "Handlooms, Tourism, Fisheries", icon: Compass }
  ];

  return (
    <div className="space-y-12 py-8">
      {/* Page Header */}
      <PageHeader title="Our Constituency: Kannur" description="Explore the heritage, culture, and key facts of our historical assembly seat." />

      {/* History and Demographics */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-emerald-50 rounded-2xl p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2">
              <Info className="h-5 w-5 text-emerald-600" />
              <span>Cultural & Historical Heritage</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Kannur (historically Cannanore) is a beautiful coastal district in Kerala, celebrated as the "Land of Theyyam". The constituency is famous for its rich handloom weaving tradition, colonial-era architecture, and beautiful beaches. It has played a pivotal role in the spice trade, attracting Portuguese, Dutch, and British explorers centuries ago.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Today, the constituency is a dynamic urban-rural mix, focused on modernizing infrastructure while preserving its traditional art forms, coir production, and ecological heritage.
            </p>
          </div>
        </div>

        {/* Quick Facts Panel */}
        <div className="space-y-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-2">Constituency Quick Facts</h3>
          <div className="space-y-4">
            {quickFacts.map((fact, index) => {
              const Icon = fact.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{fact.label}</span>
                    <span className="text-sm font-bold text-slate-200">{fact.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Landmarks Grid */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-850 text-center sm:text-left">Key Landmarks & Tourism</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {landmarks.map((landmark, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition">
              <img
                src={landmark.image}
                alt={landmark.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 space-y-2">
                <h4 className="font-bold text-slate-850 text-lg">{landmark.name}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{landmark.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ConstituencyView;
