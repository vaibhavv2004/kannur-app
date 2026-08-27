import { useState, useEffect } from "react";
import { Award, BookOpen, Heart, Calendar } from "lucide-react";
import PageHeader from "../common/PageHeader";
import { api } from "../../lib/api";

function AboutView() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/api/content/about").then((res) => setProfile(res.data)).catch(() => setProfile(null));
  }, []);

  if (!profile) return null;

  return (
    <div className="space-y-12 py-8">
      {/* Page Header */}
      <PageHeader title="Biography & Vision" description="Get to know your representative, their background, and vision for the future." />

      {/* Main Biography Block */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-emerald-50 rounded-2xl p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span>Political Profile & Background</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Party Affiliation</span>
                <p className="text-sm font-bold text-slate-800">{profile.party}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Education</span>
                <p className="text-sm font-bold text-slate-800">{profile.education}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-700 to-teal-850 text-white rounded-2xl p-8 shadow-md space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-emerald-300" />
              <span>Vision Statement</span>
            </h3>
            <p className="text-emerald-100 text-sm leading-relaxed">
              "{profile.vision}"
            </p>
          </div>
        </div>

        {/* Quick Facts Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xs border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Constituency Roles</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold">Legislative Role</h4>
                  <p className="text-xs text-slate-400">Raises local community concerns and drafts policies in the Kerala State Assembly.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold">Public Redressal</h4>
                  <p className="text-xs text-slate-400">Conducts regular camp office audiences to solve local issues directly.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Career Timeline Section */}
      <section className="space-y-8 bg-white border border-emerald-50 rounded-2xl p-8 shadow-xs">
        <h3 className="text-2xl font-bold text-slate-850 text-center">Milestones & Journey</h3>
        <div className="relative border-l border-emerald-200 ml-4 md:ml-32 space-y-8">
          {profile.milestones.map((milestone, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-8">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border border-emerald-600 bg-white"></div>

              {/* Milestone Content */}
              <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-8">
                {/* Year Label */}
                <div className="md:absolute md:-left-32 md:w-24 md:text-right font-black text-emerald-600 text-lg">
                  {milestone.year}
                </div>

                {/* Event details */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full text-sm text-slate-700 font-semibold shadow-xs">
                  {milestone.event}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutView;
