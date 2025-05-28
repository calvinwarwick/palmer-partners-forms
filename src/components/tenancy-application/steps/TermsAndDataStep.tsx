
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface TermsAndDataStepProps {
  dataSharing: {
    utilities: boolean;
    insurance: boolean;
  };
  onUpdateDataSharing: (field: 'utilities' | 'insurance', value: boolean) => void;
  signature: string;
  onSignatureChange: (signature: string) => void;
  termsAccepted: boolean;
  onTermsAccepted: (accepted: boolean) => void;
  onFillAllTestData: () => void;
}

const TermsAndDataStep = ({
  dataSharing,
  onUpdateDataSharing,
  signature,
  onSignatureChange,
  termsAccepted,
  onTermsAccepted,
  onFillAllTestData
}: TermsAndDataStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Terms & Digital Signature</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onFillAllTestData}
          className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Fill Test Data
        </Button>
      </div>

      {/* Data Sharing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Sharing Preferences</CardTitle>
          <CardDescription>
            Help us provide you with additional services by sharing your application data with trusted partners.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="utilities"
              checked={dataSharing.utilities}
              onCheckedChange={(checked) => onUpdateDataSharing('utilities', checked as boolean)}
              className="mt-1 mobile-checkbox"
            />
            <div className="space-y-1">
              <Label htmlFor="utilities" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Share data with utility providers for connection quotes
              </Label>
              <p className="text-xs text-muted-foreground">
                Get competitive quotes for gas, electricity, and broadband services.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="insurance"
              checked={dataSharing.insurance}
              onCheckedChange={(checked) => onUpdateDataSharing('insurance', checked as boolean)}
              className="mt-1 mobile-checkbox"
            />
            <div className="space-y-1">
              <Label htmlFor="insurance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Share data with insurance providers for rental protection quotes
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive tailored insurance quotes to protect your tenancy and belongings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="terms-content">
            <h3>Application Terms</h3>
            <p>
              By submitting this application, you confirm that all information provided is true and accurate to the best of your knowledge. 
              Any false or misleading information may result in the rejection of your application.
            </p>
            
            <h3>Data Protection</h3>
            <p>
              Your personal data will be processed in accordance with our Privacy Policy and applicable data protection laws. 
              We will only use your information for the purposes of processing your tenancy application and related services.
            </p>
            
            <h3>Application Processing</h3>
            <p>
              We aim to process all applications within 2-3 business days. You will be contacted via the email address provided 
              with updates on your application status.
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => onTermsAccepted(checked as boolean)}
              required
              className="mt-1 mobile-checkbox"
            />
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I accept the terms and conditions and confirm that all information provided is accurate *
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature */}
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
            className="w-full text-lg signature-input"
            required
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndDataStep;
