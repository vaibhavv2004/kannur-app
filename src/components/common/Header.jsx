import { useState } from "react";
import { Menu, X, Landmark, PhoneCall, Bell, LogOut } from "lucide-react";
import navigation from "../../constants/navigation";
import siteConfig from "../../config/siteConfig";

function Header({ currentTab, setCurrentTab, newGrievancesCount = 0, isAdmin, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (route) => {
    setCurrentTab(route);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick("/")}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-200">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
                {siteConfig.mlaName}
              </h1>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                MLA • {siteConfig.constituency} Constituency
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentTab === item.path
                    ? "bg-emerald-50 text-emerald-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-900 transition cursor-pointer shadow-md shadow-slate-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            )}

            {/* Notification Bell (Only visible on Admin Page) */}
            {currentTab === "/admin" && (
              <button
                onClick={() => handleNavClick("/admin")}
                className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 cursor-pointer"
                title="Admin Grievance Notifications"
              >
                <Bell className={`h-5 w-5 ${newGrievancesCount > 0 ? "animate-[wiggle_0.8s_ease-in-out_infinite]" : ""}`} />
                {newGrievancesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-extrabold shadow-md shadow-red-300 animate-in zoom-in duration-200">
                    {newGrievancesCount > 99 ? "99+" : newGrievancesCount}
                  </span>
                )}
              </button>
            )}

            {/* Contact Button */}
            <button
              onClick={() => handleNavClick("/contact")}
              className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Contact Office</span>
            </button>
          </div>

          {/* Mobile Right Side: Bell + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {isAdmin && (
              <button
                onClick={onLogout}
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-800 text-white transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}

            {/* Mobile Notification Bell (Only visible on Admin Page) */}
            {currentTab === "/admin" && (
              <button
                onClick={() => handleNavClick("/admin")}
                className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                title="Admin Notifications"
              >
                <Bell className="h-5 w-5" />
                {newGrievancesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-extrabold shadow-md shadow-red-300">
                    {newGrievancesCount > 99 ? "99+" : newGrievancesCount}
                  </span>
                )}
              </button>
            )}

            {/* Hamburger */}
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
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-100 mt-2">
              <button
                onClick={() => handleNavClick("/contact")}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-emerald-600 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 cursor-pointer"
              >
                <PhoneCall className="h-5 w-5" />
                <span>Contact Office</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
