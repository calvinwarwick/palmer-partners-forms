
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthForm } from "@/hooks/useAuthForm";
import AuthFormFields from "@/components/auth/AuthFormFields";
import DemoCredentials from "@/components/auth/DemoCredentials";
import ApplicationHeader from "@/components/shared/ApplicationHeader";

const Login = () => {
  const authForm = useAuthForm({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader title="Login" />
      
      <div className="flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md border-0 bg-white/95 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-dark-grey">
              Agent Portal
            </CardTitle>
            <CardDescription className="text-light-grey">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AuthFormFields 
              isLogin={true}
              email={authForm.email}
              setEmail={authForm.setEmail}
              password={authForm.password}
              setPassword={authForm.setPassword}
              showPassword={authForm.showPassword}
              setShowPassword={authForm.setShowPassword}
              firstName=""
              setFirstName={() => {}}
              lastName=""
              setLastName={() => {}}
              isLoading={authForm.isLoading}
              onSubmit={authForm.handleSubmit}
            />
            
            <DemoCredentials onFillCredentials={authForm.fillDemoCredentials} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
