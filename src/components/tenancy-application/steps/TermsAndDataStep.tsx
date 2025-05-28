
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SignaturePad from "@/components/ui/signature-pad";

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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Terms & Digital Signature</h3>
        <Button variant="outline" size="sm" onClick={onFillAllTestData}>
          Fill Test Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Sharing Consent</CardTitle>
          <CardDescription>
            Please indicate your preferences for sharing application data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="utilities" className="flex-1">
              Share data with utility providers for faster connection setup
            </Label>
            <Switch
              id="utilities"
              checked={dataSharing.utilities}
              onCheckedChange={(checked) => onUpdateDataSharing('utilities', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="insurance" className="flex-1">
              Share data with insurance providers for rental protection quotes
            </Label>
            <Switch
              id="insurance"
              checked={dataSharing.insurance}
              onCheckedChange={(checked) => onUpdateDataSharing('insurance', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <SignaturePad
          value={signature}
          onChange={onSignatureChange}
          width={400}
          height={200}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={onTermsAccepted}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I accept the terms and conditions *
              </Label>
              <p className="text-xs text-muted-foreground">
                By checking this box, you agree to our terms of service and privacy policy. You confirm that all information provided is accurate and complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndDataStep;
