import { useState, useEffect } from "react";
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

const INITIAL_GRIEVANCES = [
  {
    id: "PET-2026-001",
    name: "Suresh Kumar",
    phone: "+91 94471 23456",
    email: "suresh.k@gmail.com",
    category: "Infrastructure",
    subject: "Potholes on Payyambalam Road",
    message: "The main approach road to Payyambalam Beach has developed dangerous potholes. Requesting urgent repair before the next heavy spell of rains.",
    status: "In Progress",
    date: "July 22, 2026, 09:15 AM",
    timestamp: new Date("2026-07-22T09:15:00").getTime(),
    isNew: false
  },
  {
    id: "PET-2026-002",
    name: "Anjali Devi",
    phone: "+91 98952 98765",
    email: "anjali.devi@yahoo.com",
    category: "Water/Power Issue",
    subject: "Water Supply Disruption in Ward 4",
    message: "Drinking water supply has been disrupted in Ward 4 for the last 3 days. The water tanker is not arriving regularly.",
    status: "Pending",
    date: "July 24, 2026, 08:30 AM",
    timestamp: new Date("2026-07-24T08:30:00").getTime(),
    isNew: true
  }
];

function getInitialGrievances() {
  try {
    const saved = sessionStorage.getItem("mla_grievances");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return INITIAL_GRIEVANCES;
}

function getInitialAttendance() {
  try {
    const saved = sessionStorage.getItem("mla_attendance");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return initialAssemblyAttendance;
}

function getInitialQuestions() {
  try {
    const saved = sessionStorage.getItem("mla_questions");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return initialAssemblyQuestions;
}

function App() {
  const [currentTab, setCurrentTab] = useState(
    () => sessionStorage.getItem("mla_tab") || "/"
  );

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => sessionStorage.getItem("mla_admin_auth") === "true"
  );

  const [grievances, setGrievances] = useState(getInitialGrievances);
  const [attendance, setAttendance] = useState(getInitialAttendance);
  const [questions, setQuestions] = useState(getInitialQuestions);

  // --- Sync side effects OUTSIDE state updaters (React Strict Mode safe) ---
  useEffect(() => {
    sessionStorage.setItem("mla_tab", currentTab);
  }, [currentTab]);

  useEffect(() => {
    sessionStorage.setItem("mla_grievances", JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    sessionStorage.setItem("mla_attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    sessionStorage.setItem("mla_questions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    if (isAdminLoggedIn) {
      sessionStorage.setItem("mla_admin_auth", "true");
    } else {
      sessionStorage.removeItem("mla_admin_auth");
    }
  }, [isAdminLoggedIn]);

  // --- Handlers ---
  const addGrievance = (formData) => {
    const petitionId = `PET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const newEntry = {
      id: petitionId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      subject: formData.subject,
      message: formData.message,
      date: dateStr,
      timestamp: now.getTime(),
      status: "Pending",
      isNew: true
    };
    setGrievances((prev) => [newEntry, ...prev]);
  };

  const deleteGrievance = (id) => {
    setGrievances(prev => prev.filter(g => g.id !== id));
  };

  const handleAdminNavigation = (path) => {
    // If trying to access admin explicitly but not logged in
    if (path === "/admin" && !isAdminLoggedIn) {
      setCurrentTab("/admin-login");
    } else {
      setCurrentTab(path);
    }
  };

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentTab("/admin");
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentTab("/");
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
      case "/gallery":      return <GalleryView isAdmin={isAdminLoggedIn} />;
      case "/schemes":      return <SchemesView isAdmin={isAdminLoggedIn} />;
      case "/contact":
        return <ContactView addGrievance={addGrievance} />;
      case "/admin":
        return isAdminLoggedIn
          ? <AdminView 
              grievances={grievances} setGrievances={setGrievances} 
              attendance={attendance} setAttendance={setAttendance}
              questions={questions} setQuestions={setQuestions}
              onLogout={handleLogout} onDelete={deleteGrievance} 
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
          newGrievancesCount={grievances.filter(g => g.isNew).length}
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