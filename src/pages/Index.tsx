
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Home, FileText, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationHeader from "@/components/shared/ApplicationHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-dark-grey mb-6">
            Find Your Perfect
            <span className="text-orange-500 block">Rental Home</span>
          </h1>
          <p className="text-xl text-light-grey mb-8 max-w-2xl mx-auto">
            Professional property management services with streamlined tenancy applications
            and comprehensive admin tools for landlords and property managers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tenancy-application">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
              >
                Apply for Tenancy
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold"
              >
                Admin Portal
                <Shield className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardContent className="p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-grey mb-4">Property Listings</h3>
              <p className="text-light-grey">
                Browse our extensive portfolio of quality rental properties across prime locations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardContent className="p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-grey mb-4">Easy Applications</h3>
              <p className="text-light-grey">
                Streamlined digital application process with instant submission and tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardContent className="p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-grey mb-4">Professional Service</h3>
              <p className="text-light-grey">
                Dedicated property management team providing exceptional service and support.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-orange-100 mb-8 text-lg max-w-2xl mx-auto">
                Join thousands of satisfied tenants who have found their perfect home through Palmer & Partners.
              </p>
              <Link to="/tenancy-application">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
                >
                  Start Your Application
                  <ArrowRight className="h-5 w-5 ml-2" />
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
