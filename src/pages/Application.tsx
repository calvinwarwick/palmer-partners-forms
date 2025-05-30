
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import TenancyApplicationForm from "@/components/TenancyApplicationForm";

const Application = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <TenancyApplicationForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/fc497427-18c1-4156-888c-56392e2a21cf.png" 
              alt="Company Logo" 
              className="h-auto w-full max-w-md"
              style={{ 
                filter: 'brightness(0) saturate(100%)'
              }}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tenancy Application
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your tenancy application journey with our streamlined process.
          </p>
        </div>

        {/* Application Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Apply?
              </h2>
              <p className="text-gray-600 mb-8">
                Complete your tenancy application in just a few simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                <p className="text-sm text-gray-600">Enter your preferred property information</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-sm text-gray-600">Provide your personal and employment details</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Submit</h3>
                <p className="text-sm text-gray-600">Review and submit your application</p>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Application
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Application;
