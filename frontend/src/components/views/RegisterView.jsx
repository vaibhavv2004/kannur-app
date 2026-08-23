import { useState } from "react";
import { UserPlus, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { api } from "../../lib/api";

const ID_PROOF_TYPES = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "voter_id", label: "Voter ID" },
  { value: "pan", label: "PAN Card" },
  { value: "passport", label: "Passport" },
  { value: "driving_licence", label: "Driving Licence" },
];

function RegisterView({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    id_proof_type: "aadhaar",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your ID proof document.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("id_proof", file);

      await api.postForm("/api/users/register", formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
        <h4 className="text-lg font-bold text-emerald-800">Registration Submitted</h4>
        <p className="text-slate-600 text-sm">
          Your registration and ID proof have been submitted for admin verification. You'll be able to log in and
          submit grievances once your account is approved.
        </p>
        <button onClick={onSwitchToLogin} className="text-emerald-700 font-semibold text-sm hover:underline cursor-pointer">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-emerald-50 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md mx-auto">
          <UserPlus className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Citizen Registration</h3>
        <p className="text-sm text-slate-500">
          Register with a valid ID proof. Your account will be reviewed and approved by our office before you can
          submit grievances.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name *</label>
          <input
            type="text" name="full_name" required value={form.full_name} onChange={handleChange}
            className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Mobile Number *</label>
            <input
              type="tel" name="phone" required value={form.phone} onChange={handleChange}
              className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address *</label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Password *</label>
          <input
            type="password" name="password" required minLength={8} value={form.password} onChange={handleChange}
            className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">ID Proof Type *</label>
          <select
            name="id_proof_type" value={form.id_proof_type} onChange={handleChange}
            className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {ID_PROOF_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Upload ID Proof (JPEG, PNG, or PDF) *</label>
          <label className="flex items-center gap-2 justify-center border-2 border-dashed border-slate-200 rounded-lg p-4 text-sm text-slate-500 cursor-pointer hover:border-emerald-400 hover:text-emerald-700 transition">
            <Upload className="h-4 w-4" />
            <span>{file ? file.name : "Choose a file"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0] ?? null)}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer"
        >
          {isLoading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already registered?{" "}
        <button onClick={onSwitchToLogin} className="text-emerald-700 font-semibold hover:underline cursor-pointer">
          Log in
        </button>
      </p>
    </div>
  );
}

export default RegisterView;
