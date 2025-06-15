
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

interface AuthFormFieldsProps {
  isLogin: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthFormFields = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading = false,
  onSubmit,
}: AuthFormFieldsProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-dark-grey font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey h-4 w-4 z-10" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-dark-grey font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey h-4 w-4 z-10" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-12 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-grey hover:text-dark-grey transition-colors z-10"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base" 
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default AuthFormFields;
