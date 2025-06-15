
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
    return email === "admin@palmerandpartners.com" && password === "admin123456";
  };

  const createDemoAccount = async () => {
    const { error } = await signUp("admin@palmerandpartners.com", "admin123456", {
      first_name: "Admin",
      last_name: "User",
    });
    return error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isLogin && (!firstName || !lastName)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        console.log("Attempting to sign in with:", email);
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error("Sign in error:", error);
          // If it's demo credentials and login fails, try to create the demo account
          if (isDemoCredentials(email, password) && error.message.includes('Invalid login credentials')) {
            toast.info("Creating admin account...");
            const createError = await createDemoAccount();
            
            if (createError) {
              if (createError.message.includes('User already registered')) {
                toast.error("Admin account exists but password is incorrect. Please try again.");
              } else {
                toast.error(`Failed to create admin account: ${createError.message}`);
              }
            } else {
              toast.success("Admin account created! Please check your email to confirm, or try signing in again.");
            }
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password. Please check your credentials.");
          } else {
            toast.error(error.message);
          }
        } else {
          console.log("Sign in successful, navigating to admin");
          toast.success("Signed in successfully!");
          if (onLogin) {
            onLogin(email, "Admin");
          }
          navigate("/admin");
        }
      } else {
        console.log("Attempting to sign up with:", email);
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
        });
        if (error) {
          console.error("Sign up error:", error);
          if (error.message.includes('User already registered')) {
            toast.error("This email is already registered. Please try signing in instead.");
            setIsLogin(true);
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully! Please check your email to confirm your account.");
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    console.log("Filling demo credentials");
    setEmail("admin@palmerandpartners.com");
    setPassword("admin123456");
    setIsLogin(true);
    toast.info("Admin credentials filled. Click 'Sign In' to login.");
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
