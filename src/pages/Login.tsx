
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";

const Login = () => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const navigate = useNavigate();

  const handleLogin = (username: string, role: string) => {
    setUser({ username, role });
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <LoginForm onLogin={handleLogin} />;
};

export default Login;
