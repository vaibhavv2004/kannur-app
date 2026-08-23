import { useState } from "react";
import { offices } from "../../constants/data";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, LogOut, UserCircle2 } from "lucide-react";
import { api } from "../../lib/api";
import CitizenLoginView from "./CitizenLoginView";
import RegisterView from "./RegisterView";

function ContactView({ isCitizenLoggedIn, citizenToken, citizenName, onCitizenLogin, onCitizenLogout }) {
  const [authView, setAuthView] = useState("login"); // "login" or "register"
  const [submissionType, setSubmissionType] = useState("grievance"); // "grievance" or "question"
  const [formData, setFormData] = useState({ category: "Infrastructure", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Infrastructure", "Welfare Schemes", "Water/Power Issue", "Education", "Healthcare", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/api/grievances", formData, citizenToken);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ category: submissionType === "question" ? "Assembly Question Suggestion" : "Infrastructure", subject: "", message: "" });
      }, 4000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (type) => {
    setSubmissionType(type);
    setFormData({ category: type === "question" ? "Assembly Question Suggestion" : "Infrastructure", subject: "", message: "" });
  };

  return (
    <div className="space-y-12 py-8">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-4 text-center sm:text-left">
        <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">Contact & Public Grievances</h2>
        <p className="text-slate-500 mt-1">Submit your petitions, query requests, or schedule a meeting at the camp offices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submission Form */}
        <section className="bg-white border border-emerald-50 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {!isCitizenLoggedIn ? (
            authView === "login" ? (
              <CitizenLoginView onLoginSuccess={onCitizenLogin} onSwitchToRegister={() => setAuthView("register")} />
            ) : (
              <RegisterView onSwitchToLogin={() => setAuthView("login")} />
            )
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-xl font-bold text-slate-850">
                  {submissionType === "grievance" ? "Public Grievance Portal" : "Suggest Assembly Question"}
                </h3>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("grievance")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                      submissionType === "grievance" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Grievance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("question")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                      submissionType === "question" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Assembly Question
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <UserCircle2 className="h-4 w-4 text-emerald-600" />
                  Logged in as <strong>{citizenName}</strong>
                </span>
                <button onClick={onCitizenLogout} className="flex items-center gap-1 text-slate-500 hover:text-red-600 cursor-pointer">
                  <LogOut className="h-3.5 w-3.5" /> Log out
                </button>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3 animate-in zoom-in duration-200">
                  <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-800">Petition Filed Successfully!</h4>
                  <p className="text-slate-600 text-xs max-w-xs mx-auto">
                    Thank you for reaching out. Our office will review and update you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <p className="text-xs text-red-600">{error}</p>}
                  {submissionType === "grievance" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Issue Category *</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      {submissionType === "grievance" ? "Subject *" : "Suggested Topic *"}
                    </label>
                    <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      {submissionType === "grievance" ? "Message Detail *" : "Detailed Question/Reasoning *"}
                    </label>
                    <textarea name="message" required rows="4" value={formData.message} onChange={handleChange} className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 cursor-pointer transition shadow-md shadow-emerald-100">
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Submitting..." : submissionType === "grievance" ? "Submit Grievance" : "Submit Question Suggestion"}</span>
                  </button>
                </form>
              )}
            </>
          )}
        </section>

        {/* Office Details Column */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-850">Office Locations</h3>
          <div className="space-y-4">
            {offices.map((office, idx) => (
              <div key={idx} className="bg-slate-55 border border-slate-100 rounded-2xl p-6 space-y-4">
                <h4 className="font-extrabold text-slate-800 text-base">{office.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-655">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>{office.timings}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-655">
                      <Phone className="h-4 w-4 text-emerald-600" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-655">
                      <Mail className="h-4 w-4 text-emerald-600 truncate" />
                      <span className="truncate">{office.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactView;
