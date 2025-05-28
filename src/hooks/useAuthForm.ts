
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UseAuthFormProps {
  onLogin?: (username: string, role: string) => void;
}

export const useAuthForm = ({ onLogin }: UseAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const isDemoCredentials = (email: string, password: string) => {
    return email === "demo.user@test.com" && password === "demo123456";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, just redirect any credentials to admin page
      if (isLogin) {
        toast.success("Signed in successfully!");
        navigate("/admin");
      } else {
        toast.success("Account created successfully!");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("demo.user@test.com");
    setPassword("demo123456");
    toast.info("Demo credentials filled. Click 'Sign In' to login.");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLogin,
    setIsLogin,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    isLoading,
    handleSubmit,
    fillDemoCredentials,
  };
};
