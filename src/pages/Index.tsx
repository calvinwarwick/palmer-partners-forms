
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, FileText, Users } from "lucide-react";

const Index = () => {
  useEffect(() => {
    // Any initialization logic can go here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Palmer & Partners
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional property management and tenancy services
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Home className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Find a Property</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Browse our available properties and find your perfect home.
              </p>
              <Button variant="outline" className="w-full">
                View Properties
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Apply for Tenancy</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Complete your tenancy application quickly and securely online.
              </p>
              <Link to="/tenancy-application">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Start Application
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Agent Portal</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Access the admin portal to manage applications and properties.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Agent Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
