
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Home } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface ApplicationSuccessProps {
  applicants: Applicant[];
}

const ApplicationSuccess = ({ applicants }: ApplicationSuccessProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <Card className="max-w-2xl w-full shadow-lg border border-gray-200 bg-white">
        <CardContent className="pt-12 pb-10 px-10 text-center">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Application Submitted Successfully
          </h1>
          
          {/* Email Confirmation Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-orange-500 rounded-full p-3">
                <Mail className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Confirmation email sent to:
            </p>
            <p className="text-lg font-semibold text-gray-900 break-all">
              {applicants[0].email}
            </p>
          </div>
          
          {/* Description */}
          <div className="mb-10">
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
              Your tenancy application has been successfully submitted. We'll review it and get back to you within{" "}
              <span className="font-semibold text-orange-600">2-3 business days</span>.
            </p>
          </div>
          
          {/* Action Button */}
          <div>
            <Link to="/" className="block">
              <Button className="w-full max-w-sm mx-auto h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200">
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
