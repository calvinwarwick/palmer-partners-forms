import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import TenancyApplicationForm from "@/components/TenancyApplicationForm";

const Application = () => {
  const [showForm, setShowForm] = useState(false);
  const [stepAnimations, setStepAnimations] = useState({
    step1: { showTick: false, fadeText: false },
    step2: { showTick: false, fadeText: false },
    step3: { showTick: false, fadeText: false }
  });

  useEffect(() => {
    const runAnimation = () => {
      // Reset all animations
      setStepAnimations({
        step1: { showTick: false, fadeText: false },
        step2: { showTick: false, fadeText: false },
        step3: { showTick: false, fadeText: false }
      });

      // Step 1 animation after 3 seconds
      setTimeout(() => {
        setStepAnimations(prev => ({
          ...prev,
          step1: { showTick: true, fadeText: true }
        }));
      }, 3000);

      // Step 2 animation after 4.5 seconds (3 + 1.5)
      setTimeout(() => {
        setStepAnimations(prev => ({
          ...prev,
          step2: { showTick: true, fadeText: true }
        }));
      }, 4500);

      // Step 3 animation after 6 seconds (3 + 1.5 + 1.5)
      setTimeout(() => {
        setStepAnimations(prev => ({
          ...prev,
          step3: { showTick: true, fadeText: true }
        }));
      }, 6000);

      // Restart animation after 11 seconds (6 + 5)
      setTimeout(() => {
        runAnimation();
      }, 11000);
    };

    if (!showForm) {
      runAnimation();
    }
  }, [showForm]);

  if (showForm) {
    return <TenancyApplicationForm />;
  }

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Palmer & Partners style header - full width, far left corner */}
      <div className="bg-dark-grey w-full overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 w-full"></div>
        <div className="w-full px-6 py-4 relative">
          <div className="flex items-center space-x-6">
            <div className="transform rotate-12 -my-2">
              <img 
                src="/lovable-uploads/fb64eebc-b467-4dd1-b635-6d1817b04c67.png" 
                alt="Palmer & Partners P Logo" 
                className="h-24 w-24"
              />
            </div>
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/8958574e-86f0-4482-9a99-322142a0f734.png" 
                alt="Palmer & Partners Text Logo" 
                className="h-12"
              />
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 w-full"></div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Main content section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tenancy Application
          </h2>
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
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <span 
                    className={`text-white font-bold text-lg transition-opacity duration-500 ${
                      stepAnimations.step1.fadeText ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    1
                  </span>
                  <Check 
                    className={`h-6 w-6 text-white absolute transition-opacity duration-500 ${
                      stepAnimations.step1.showTick ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                <p className="text-sm text-gray-600">Enter your preferred property information</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <span 
                    className={`text-white font-bold text-lg transition-opacity duration-500 ${
                      stepAnimations.step2.fadeText ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    2
                  </span>
                  <Check 
                    className={`h-6 w-6 text-white absolute transition-opacity duration-500 ${
                      stepAnimations.step2.showTick ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-sm text-gray-600">Provide your personal and employment details</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <span 
                    className={`text-white font-bold text-lg transition-opacity duration-500 ${
                      stepAnimations.step3.fadeText ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    3
                  </span>
                  <Check 
                    className={`h-6 w-6 text-white absolute transition-opacity duration-500 ${
                      stepAnimations.step3.showTick ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
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
