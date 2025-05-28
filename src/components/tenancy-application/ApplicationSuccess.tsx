
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface ApplicationSuccessProps {
  applicants: Applicant[];
}

const ApplicationSuccess = ({ applicants }: ApplicationSuccessProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-blue-700 font-medium">
              Confirmation email sent to:
            </p>
            <p className="text-sm text-blue-600">
              {applicants[0].email}
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            Your tenancy application has been successfully submitted. We'll review it and get back to you within 2-3 business days.
          </p>
          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full">Back to Properties</Button>
            </Link>
            <Button variant="outline" className="w-full">
              Download Application Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationSuccess;
