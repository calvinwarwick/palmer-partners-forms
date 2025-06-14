
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthForm } from "@/hooks/useAuthForm";
import AuthFormFields from "@/components/auth/AuthFormFields";
import DemoCredentials from "@/components/auth/DemoCredentials";
import ApplicationHeader from "@/components/shared/ApplicationHeader";

const Login = () => {
  const authForm = useAuthForm({});

  const handleToggleMode = () => {
    authForm.setIsLogin(!authForm.isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader title="Login" />
      
      <div className="flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md border-0 bg-white/90 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-dark-grey">
              {authForm.isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center text-light-grey">
              {authForm.isLogin 
                ? "Enter your credentials to access your account" 
                : "Create a new account to get started"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AuthFormFields 
              {...authForm} 
              onSubmit={authForm.handleSubmit}
            />
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                {authForm.isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
            {authForm.isLogin && (
              <DemoCredentials onFillCredentials={authForm.fillDemoCredentials} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
