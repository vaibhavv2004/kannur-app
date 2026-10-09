import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { api } from "../../lib/api";

const ID_PROOF_TYPE_VALUES = ["aadhaar", "voter_id", "pan", "passport", "driving_licence"];

function RegisterView({ onSwitchToLogin }) {
  const { t } = useTranslation();
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
      setError(t("auth.pleaseUploadIdProof"));
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
      setError(err.message || t("auth.registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
        <h4 className="text-lg font-bold text-emerald-800">{t("auth.registrationSubmitted")}</h4>
        <p className="text-slate-600 text-sm">
          {t("auth.registrationSubmittedDesc")}
        </p>
        <button onClick={onSwitchToLogin} className="text-emerald-700 font-semibold text-sm hover:underline cursor-pointer">
          {t("auth.backToLogin")}
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
        <h3 className="text-xl font-bold text-slate-800">{t("auth.citizenRegistration")}</h3>
        <p className="text-sm text-slate-500">
          {t("auth.registerWithValidId")}
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
          <label className="block text-xs font-semibold text-slate-500 mb-1">{t("auth.fullName")}</label>
          <input
            type="text" name="full_name" required value={form.full_name} onChange={handleChange}
            className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t("auth.mobileNumber")}</label>
            <input
              type="tel" name="phone" required value={form.phone} onChange={handleChange}
              className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t("auth.emailAddressRequired")}</label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{t("auth.passwordRequired")}</label>
          <input
            type="password" name="password" required minLength={8} value={form.password} onChange={handleChange}
            className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{t("auth.idProofType")}</label>
          <select
            name="id_proof_type" value={form.id_proof_type} onChange={handleChange}
            className="w-full text-sm rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {ID_PROOF_TYPE_VALUES.map((v) => <option key={v} value={v}>{t(`auth.idProofTypes.${v}`)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{t("auth.uploadIdProof")}</label>
          <label className="flex items-center gap-2 justify-center border-2 border-dashed border-slate-200 rounded-lg p-4 text-sm text-slate-500 cursor-pointer hover:border-emerald-400 hover:text-emerald-700 transition">
            <Upload className="h-4 w-4" />
            <span>{file ? file.name : t("auth.chooseFile")}</span>
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
          {isLoading ? t("auth.submitting") : t("auth.submitRegistration")}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        {t("auth.alreadyRegistered")}{" "}
        <button onClick={onSwitchToLogin} className="text-emerald-700 font-semibold hover:underline cursor-pointer">
          {t("auth.logInLink")}
        </button>
      </p>
    </div>
  );
}

export default RegisterView;
