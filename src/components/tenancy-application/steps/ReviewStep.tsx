
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";
import SignaturePad from "@/components/ui/signature-pad";

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
        <CardHeader variant="gradient">
          <CardTitle className="text-base text-orange-800">Application Summary</CardTitle>
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
        <CardHeader variant="gradient">
          <CardTitle className="text-base text-orange-800">Digital Signature *</CardTitle>
          <CardDescription>
            You can either draw your signature or type your full name
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignaturePad
            value={signature}
            onChange={onSignatureChange}
            width={400}
            height={150}
          />
          
          <div className="text-center text-sm text-gray-500">
            Or type your full name as your digital signature:
          </div>
          
          <Input
            value={signature.startsWith('data:image/') ? '' : signature}
            onChange={(e) => onSignatureChange(e.target.value)}
            placeholder="Type your full name here"
            className="text-lg"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
