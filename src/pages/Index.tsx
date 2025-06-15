
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationHeader from "@/components/shared/ApplicationHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Find a Property */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardContent className="p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-grey mb-4">Find a Property</h3>
              <p className="text-light-grey mb-6">
                Browse our available properties and find your perfect home.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                View Properties
              </Button>
            </CardContent>
          </Card>

          {/* Apply for Tenancy */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardContent className="p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-grey mb-4">Apply for Tenancy</h3>
              <p className="text-light-grey mb-6">
                Complete your tenancy application quickly and securely online.
              </p>
              <Link to="/tenancy-application">
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                >
                  Start Application
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Agent Portal */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardContent className="p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-grey mb-4">Agent Portal</h3>
              <p className="text-light-grey mb-6">
                Access the admin portal to manage applications and properties.
              </p>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
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
