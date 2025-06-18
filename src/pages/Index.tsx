
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Clock, Shield } from "lucide-react";
import ApplicationHeader from "@/components/shared/ApplicationHeader";
import PdfTestLink from "@/components/pdf-test/PdfTestLink";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-dark-grey mb-6">
            Property & <span className="text-orange-500">Paige</span>
          </h1>
          <p className="text-xl text-light-grey mb-8 max-w-2xl mx-auto">
            Streamline your tenancy application process with our modern, secure platform
          </p>
          <Button 
            onClick={() => navigate("/application")}
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg"
          >
            Start Your Application
          </Button>
        </div>

        {/* PDF Test Section */}
        <div className="mb-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">PDF Test</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <PdfTestLink />
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-dark-grey">Digital Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete your tenancy application entirely online with our intuitive forms
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-dark-grey">Multiple Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easily add multiple applicants and guarantors to your application
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-dark-grey">Quick Process</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Save time with our streamlined application process and instant submission
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-dark-grey">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your personal information is protected with bank-level security
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-dark-grey mb-4">Ready to get started?</h2>
          <p className="text-light-grey mb-8">
            Begin your tenancy application today and secure your new home
          </p>
          <Button 
            onClick={() => navigate("/application")}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-lg px-8 py-6 rounded-xl"
          >
            Begin Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
