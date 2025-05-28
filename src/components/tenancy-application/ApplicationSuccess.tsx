
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, Home } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface ApplicationSuccessProps {
  applicants: Applicant[];
}

const ApplicationSuccess = ({ applicants }: ApplicationSuccessProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <Card className="max-w-lg w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 px-8 text-center">
          {/* Success Icon with Animation */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-green-500 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Application Submitted!
          </h2>
          
          {/* Email Confirmation Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl mb-8 border border-orange-200">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-orange-500 rounded-full p-2">
                <Mail className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-orange-800 mb-2">
              Confirmation email sent to:
            </p>
            <p className="text-base font-medium text-orange-700 break-all">
              {applicants[0].email}
            </p>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <p className="text-gray-600 text-lg leading-relaxed">
              Your tenancy application has been successfully submitted. We'll review it and get back to you within{" "}
              <span className="font-semibold text-orange-600">2-3 business days</span>.
            </p>
          </div>
          
          {/* Action Button */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <Home className="h-5 w-5 mr-3" />
                Back to Palmer & Partners
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationSuccess;
