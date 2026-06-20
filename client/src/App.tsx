import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const handleLogin = (token: string, role: string) => {
    localStorage.setItem("role", role);

    setRole(role);
  };

  if (!role) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return role === "admin" ? <AdminDashboard /> : <BookingPage />;
}

export default App;
