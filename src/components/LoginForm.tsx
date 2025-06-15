
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import AuthFormFields from "@/components/auth/AuthFormFields";
import DemoCredentials from "@/components/auth/DemoCredentials";

interface LoginFormProps {
  onLogin?: (username: string, role: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    handleSubmit,
    fillDemoCredentials,
  } = useAuthForm({ onLogin });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="mb-4">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the estate agent portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthFormFields
              isLogin={true}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              firstName=""
              setFirstName={() => {}}
              lastName=""
              setLastName={() => {}}
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />

            <DemoCredentials onFillCredentials={fillDemoCredentials} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
