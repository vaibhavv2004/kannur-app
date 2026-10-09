import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, PhoneCall, ChevronDown, User, LogOut, LayoutDashboard, FileText, Languages } from "lucide-react";
import navigation from "../../constants/navigation";

const PRIMARY_COUNT = 4;

function Header({ currentTab, setCurrentTab, newGrievancesCount = 0, isAdmin, onLogout, isCitizenLoggedIn, citizenName, onCitizenLogout, siteSettings }) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const moreRef = useRef(null);
  const accountRef = useRef(null);

  const primaryNav = navigation.slice(0, PRIMARY_COUNT);
  const moreNav = navigation.slice(PRIMARY_COUNT);
  const isMoreActive = moreNav.some((item) => item.path === currentTab);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setIsMoreOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setIsAccountOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (route) => {
    setCurrentTab(route);
    setIsOpen(false);
    setIsMoreOpen(false);
    setIsAccountOpen(false);
  };

  const handleAccountLogout = () => {
    if (isAdmin) onLogout();
    else onCitizenLogout?.();
    setIsAccountOpen(false);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "ml" ? "en" : "ml");
  };

  const languageButtonLabel = i18n.language === "ml" ? "EN" : "മല";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleNavClick("/")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-200 overflow-hidden">
              <img src="/profile.jpg" alt={siteSettings?.mlaName} className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight leading-tight">
                {siteSettings?.mlaName}
              </h1>
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                {t("header.mlaSuffix", { constituency: siteSettings?.constituency })}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {primaryNav.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentTab === item.path
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {t(`nav.${item.key}`)}
              </button>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen((v) => !v)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isMoreActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{t("nav.more")}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isMoreOpen ? "rotate-180" : ""}`} />
              </button>
              {isMoreOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white shadow-lg py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {moreNav.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.path)}
                      className={`block w-full text-left px-4 py-2 text-sm cursor-pointer transition ${
                        currentTab === item.path ? "text-emerald-700 font-semibold bg-emerald-50" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t(`nav.${item.key}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Switch language"
            >
              <Languages className="h-4 w-4" />
              <span>{languageButtonLabel}</span>
            </button>

            {/* Account menu */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setIsAccountOpen((v) => !v)}
                className="relative flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <User className="h-3.5 w-3.5" />
                </span>
                <span className="max-w-[8rem] truncate">
                  {isAdmin ? t("header.admin") : isCitizenLoggedIn ? citizenName : t("header.account")}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isAccountOpen ? "rotate-180" : ""}`} />
                {isAdmin && newGrievancesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-extrabold">
                    {newGrievancesCount > 9 ? "9+" : newGrievancesCount}
                  </span>
                )}
              </button>
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-100 bg-white shadow-lg py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => handleNavClick("/admin")}
                        className="flex w-full items-center justify-between px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> {t("header.dashboard")}</span>
                        {newGrievancesCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-extrabold px-1">
                            {newGrievancesCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={handleAccountLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" /> {t("header.logOut")}
                      </button>
                    </>
                  ) : isCitizenLoggedIn ? (
                    <>
                      <button
                        onClick={() => handleNavClick("/contact")}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        <FileText className="h-4 w-4" /> {t("header.myGrievances")}
                      </button>
                      <button
                        onClick={handleAccountLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" /> {t("header.logOut")}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavClick("/contact")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      <User className="h-4 w-4" /> {t("header.citizenAdminLogin")}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Contact Button */}
            <button
              onClick={() => handleNavClick("/contact")}
              className="flex items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{t("header.contactOffice")}</span>
            </button>
          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center h-9 px-2.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {languageButtonLabel}
            </button>
            {isAdmin && newGrievancesCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-extrabold px-1">
                {newGrievancesCount}
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden animate-in fade-in slide-in-from-top duration-200 border-b border-emerald-100 bg-white">
          <div className="space-y-1 px-4 py-4 sm:px-6">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all cursor-pointer ${
                  currentTab === item.path
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {t(`nav.${item.key}`)}
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-slate-100 space-y-1">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => handleNavClick("/admin")}
                    className="flex w-full items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{t("header.adminDashboard")}</span>
                    {newGrievancesCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-extrabold px-1">
                        {newGrievancesCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleAccountLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> {t("header.logOut")}
                  </button>
                </>
              ) : isCitizenLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavClick("/contact")}
                    className="flex w-full items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" /> {t("header.myGrievances")} ({citizenName})
                  </button>
                  <button
                    onClick={handleAccountLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> {t("header.logOut")}
                  </button>
                </>
              ) : null}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-2">
              <button
                onClick={() => handleNavClick("/contact")}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-emerald-600 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 cursor-pointer"
              >
                <PhoneCall className="h-5 w-5" />
                <span>{t("header.contactOffice")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
