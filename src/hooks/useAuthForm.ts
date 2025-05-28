
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
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          console.error("Login error:", error);
          
          // If it's demo credentials and login failed, try to create the account
          if (isDemoCredentials(email, password) && error.message === "Invalid login credentials") {
            console.log("Demo login failed, attempting to create demo account...");
            toast.info("Demo account doesn't exist. Creating it now...");
            
            const { error: signUpError } = await signUp(email, password, {
              first_name: "Demo",
              last_name: "User",
            });
            
            if (signUpError) {
              toast.error(`Failed to create demo account: ${signUpError.message}`);
            } else {
              toast.success("Demo account created! You can now sign in.");
              // Try to sign in again after successful signup
              const { error: retryError } = await signIn(email, password);
              if (retryError) {
                toast.error("Please try signing in again with the demo credentials.");
              } else {
                toast.success("Signed in successfully!");
                // Redirect demo users to admin page
                if (isDemoCredentials(email, password)) {
                  navigate("/admin");
                } else {
                  onLogin?.(email, "User");
                }
              }
            }
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Signed in successfully!");
          // Redirect demo users to admin page
          if (isDemoCredentials(email, password)) {
            navigate("/admin");
          } else {
            onLogin?.(email, "User");
          }
        }
      } else {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created successfully! Please check your email to verify your account.");
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
    setEmail("demo.user@test.com");
    setPassword("demo123456");
    toast.info("Demo credentials filled. Click 'Sign In' to login or create the account automatically.");
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
