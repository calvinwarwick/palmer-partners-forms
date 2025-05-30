
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import TenancyApplicationForm from "@/components/TenancyApplicationForm";

const Application = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <TenancyApplicationForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-orange-500 p-4 rounded-full shadow-lg">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your tenancy application journey with our streamlined process. 
            Get approved faster with our digital application system.
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
                Our process typically takes 10-15 minutes.
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
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Info</h3>
                <p className="text-sm text-gray-600">Provide your personal and employment details</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
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
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quick & Secure</h3>
            <p className="text-gray-600">Your data is encrypted and secure. Complete your application in minutes, not hours.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Updates</h3>
            <p className="text-gray-600">Get real-time updates on your application status directly to your email.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
