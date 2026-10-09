import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogIn, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { api } from "../../lib/api";

function CitizenLoginView({ onLoginSuccess, onSwitchToRegister }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { access_token } = await api.post("/api/auth/login", form);
      onLoginSuccess(access_token);
    } catch (err) {
      setError(err.message || t("auth.invalidEmailPassword"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-emerald-50 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md mx-auto">
          <LogIn className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{t("auth.citizenLogin")}</h3>
        <p className="text-sm text-slate-500">{t("auth.logInToSubmit")}</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{t("auth.emailAddress")}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full text-sm rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{t("auth.password")}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full text-sm rounded-lg border border-slate-200 pl-9 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer"
        >
          {isLoading ? t("auth.loggingIn") : t("auth.logIn")}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        {t("auth.noAccount")}{" "}
        <button onClick={onSwitchToRegister} className="text-emerald-700 font-semibold hover:underline cursor-pointer">
          {t("auth.registerHere")}
        </button>
      </p>
    </div>
  );
}

export default CitizenLoginView;
