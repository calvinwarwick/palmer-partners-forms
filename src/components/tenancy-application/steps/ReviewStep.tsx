
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";

interface ReviewStepProps {
  applicants: Applicant[];
  propertyPreferences: PropertyPreferences;
  signature: string;
  onSignatureChange: (signature: string) => void;
}

const ReviewStep = ({ applicants, propertyPreferences, signature, onSignatureChange }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review & Digital Signature</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Applicants: {applicants.length}</p>
            <ul className="text-sm text-gray-600 mt-1">
              {applicants.map((applicant, index) => (
                <li key={applicant.id}>
                  {index + 1}. {applicant.firstName} {applicant.lastName} - {applicant.email}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Property Preferences:</p>
            <p className="text-sm text-gray-600">
              Type: {propertyPreferences.propertyType} | 
              Max Rent: £{propertyPreferences.maxRent}/month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Digital Signature *</CardTitle>
          <CardDescription>
            Please type your full name as your digital signature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={signature}
            onChange={(e) => onSignatureChange(e.target.value)}
            placeholder="Type your full name here"
            className="text-lg"
            required
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
