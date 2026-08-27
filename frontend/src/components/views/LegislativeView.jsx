import { useState, useEffect } from "react";
import { Award, BookOpen, Search, HelpCircle } from "lucide-react";
import PageHeader from "../common/PageHeader";
import { api } from "../../lib/api";

function LegislativeView() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get("/api/content/legislative").then((res) => setContent(res.data)).catch(() => setContent(null));
  }, []);

  if (!content) return null;

  const { attendance, questions } = content;
  const attendancePercentage = attendance.totalSessions > 0
    ? Math.round((attendance.daysAttended / attendance.totalSessions) * 100)
    : 0;

  return (
    <div className="space-y-12 py-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader title="Legislative Assembly Performance" description="Tracking the MLA's attendance, active participation, and key questions raised in the State Assembly." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Attendance Visualizer */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xs flex flex-col items-center text-center space-y-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Award className="w-32 h-32" />
            </div>

            <div className="space-y-1 z-10">
              <h3 className="text-lg font-bold text-slate-800">Assembly Attendance</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Current Session Performance</p>
            </div>

            {/* CSS Radial Progress */}
            <div className="relative flex items-center justify-center w-48 h-48 z-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  className="text-slate-100 stroke-current"
                  strokeWidth="8"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                {/* Progress Circle */}
                <circle
                  className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * attendancePercentage) / 100}
                ></circle>
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800">{attendancePercentage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full z-10 pt-4 border-t border-slate-100">
              <div>
                <span className="block text-2xl font-bold text-slate-800">{attendance.daysAttended}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Days Attended</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-slate-800">{attendance.totalSessions}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Sessions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Questions Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <span>Questions Raised in Assembly</span>
            </h3>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold rounded-full">
              {questions.length} Questions
            </span>
          </div>

          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((q, idx) => (
                <div key={q.id || idx} className="group relative bg-white border border-slate-100 p-6 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 group-hover:text-emerald-600 transition-all">
                    <HelpCircle className="h-12 w-12" />
                  </div>
                  
                  <div className="space-y-3 relative z-10 pr-12">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black tracking-widest uppercase rounded">
                        {q.date}
                      </span>
                      <span className="text-xs font-bold text-slate-400">Ref: {q.id}</span>
                    </div>
                    
                    <h4 className="text-lg font-black text-slate-800 leading-snug">{q.topic}</h4>
                    
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {q.summary}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <Search className="h-10 w-10 opacity-30 mb-3" />
                <p className="text-sm font-medium">No legislative questions recorded for this session yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default LegislativeView;
