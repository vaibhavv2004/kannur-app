import { useState, useEffect, useCallback } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomeView from "./components/views/HomeView";
import AboutView from "./components/views/AboutView";
import ConstituencyView from "./components/views/ConstituencyView";
import DevelopmentView from "./components/views/DevelopmentView";
import NewsView from "./components/views/NewsView";
import GalleryView from "./components/views/GalleryView";
import SchemesView from "./components/views/SchemesView";
import ContactView from "./components/views/ContactView";
import AdminView from "./components/views/AdminView";
import AdminLoginView from "./components/views/AdminLoginView";
import LegislativeView from "./components/views/LegislativeView";
import { initialAssemblyAttendance, initialAssemblyQuestions } from "./constants/data";
import { api } from "./lib/api";

function getInitialAttendance() {
  try {
    const saved = sessionStorage.getItem("mla_attendance");
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore malformed sessionStorage value
  }
  return initialAssemblyAttendance;
}

function getInitialQuestions() {
  try {
    const saved = sessionStorage.getItem("mla_questions");
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore malformed sessionStorage value
  }
  return initialAssemblyQuestions;
}

function App() {
  const [currentTab, setCurrentTab] = useState(
    () => sessionStorage.getItem("mla_tab") || "/"
  );

  const [adminToken, setAdminToken] = useState(
    () => sessionStorage.getItem("mla_admin_token") || null
  );
  const [citizenToken, setCitizenToken] = useState(
    () => sessionStorage.getItem("mla_citizen_token") || null
  );
  const [citizenName, setCitizenName] = useState("");

  const isAdminLoggedIn = !!adminToken;
  const isCitizenLoggedIn = !!citizenToken;

  const [grievances, setGrievances] = useState([]);
  const [attendance, setAttendance] = useState(getInitialAttendance);
  const [questions, setQuestions] = useState(getInitialQuestions);

  // --- Sync side effects OUTSIDE state updaters (React Strict Mode safe) ---
  useEffect(() => {
    sessionStorage.setItem("mla_tab", currentTab);
  }, [currentTab]);

  useEffect(() => {
    sessionStorage.setItem("mla_attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    sessionStorage.setItem("mla_questions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    if (adminToken) sessionStorage.setItem("mla_admin_token", adminToken);
    else sessionStorage.removeItem("mla_admin_token");
  }, [adminToken]);

  useEffect(() => {
    if (citizenToken) sessionStorage.setItem("mla_citizen_token", citizenToken);
    else sessionStorage.removeItem("mla_citizen_token");
  }, [citizenToken]);

  const refreshGrievances = useCallback(async () => {
    if (!adminToken) return;
    try {
      const data = await api.get("/api/grievances", adminToken);
      setGrievances(data);
    } catch {
      setGrievances([]);
    }
  }, [adminToken]);

  // Fetches grievances from the backend whenever the admin token changes (login/logout).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshGrievances();
  }, [refreshGrievances]);

  // Fetches the citizen's profile from the backend whenever their token changes (login/logout).
  useEffect(() => {
    if (!citizenToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCitizenName("");
      return;
    }
    api.get("/api/users/me", citizenToken)
      .then((user) => setCitizenName(user.full_name))
      .catch(() => setCitizenName(""));
  }, [citizenToken]);

  // --- Handlers ---
  const handleAdminNavigation = (path) => {
    if (path === "/admin" && !isAdminLoggedIn) {
      setCurrentTab("/admin-login");
    } else {
      setCurrentTab(path);
    }
  };

  const handleLogin = (token) => {
    setAdminToken(token);
    setCurrentTab("/admin");
  };

  const handleLogout = () => {
    setAdminToken(null);
    setGrievances([]);
    setCurrentTab("/");
  };

  const handleCitizenLogin = (token) => {
    setCitizenToken(token);
  };

  const handleCitizenLogout = () => {
    setCitizenToken(null);
  };

  // Admin login full-screen (no header/footer)
  if (currentTab === "/admin-login") {
    return <AdminLoginView onLoginSuccess={handleLogin} />;
  }

  const renderView = () => {
    switch (currentTab) {
      case "/":             return <HomeView setCurrentTab={handleAdminNavigation} isAdmin={isAdminLoggedIn} />;
      case "/about":        return <AboutView isAdmin={isAdminLoggedIn} />;
      case "/constituency": return <ConstituencyView isAdmin={isAdminLoggedIn} />;
      case "/legislative":  return <LegislativeView attendance={attendance} questions={questions} isAdmin={isAdminLoggedIn} />;
      case "/development":  return <DevelopmentView isAdmin={isAdminLoggedIn} />;
      case "/news":         return <NewsView isAdmin={isAdminLoggedIn} />;
      case "/gallery":      return <GalleryView />;
      case "/schemes":      return <SchemesView isAdmin={isAdminLoggedIn} />;
      case "/contact":
        return (
          <ContactView
            isCitizenLoggedIn={isCitizenLoggedIn}
            citizenToken={citizenToken}
            citizenName={citizenName}
            onCitizenLogin={handleCitizenLogin}
            onCitizenLogout={handleCitizenLogout}
          />
        );
      case "/admin":
        return isAdminLoggedIn
          ? <AdminView
              adminToken={adminToken}
              grievances={grievances} refreshGrievances={refreshGrievances}
              attendance={attendance} setAttendance={setAttendance}
              questions={questions} setQuestions={setQuestions}
              onLogout={handleLogout}
            />
          : <AdminLoginView onLoginSuccess={handleLogin} />;
      default:              return <HomeView setCurrentTab={handleAdminNavigation} isAdmin={isAdminLoggedIn} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header
          currentTab={currentTab}
          setCurrentTab={handleAdminNavigation}
          newGrievancesCount={grievances.filter(g => g.is_new).length}
          isAdmin={isAdminLoggedIn}
          onLogout={handleLogout}
        />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {renderView()}
        </main>
      </div>
      <Footer setCurrentTab={handleAdminNavigation} currentTab={currentTab} />
    </div>
  );
}

export default App;
