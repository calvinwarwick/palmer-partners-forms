
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";

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
}

const TermsAndDataStep = ({ 
  dataSharing, 
  onUpdateDataSharing, 
  signature, 
  onSignatureChange,
  termsAccepted,
  onTermsAccepted
}: TermsAndDataStepProps) => {
  const fillTestData = () => {
    onSignatureChange("John Smith");
    onTermsAccepted(true);
    onUpdateDataSharing('utilities', true);
    onUpdateDataSharing('insurance', false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Terms, Conditions & Data Sharing</h3>
        <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Fill Test Data
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-4 max-h-96 overflow-y-auto p-4 border rounded-lg bg-muted/30">
            <div>
              <h4 className="font-semibold mb-2">Terms & Conditions</h4>
              <p>If your offer is accepted by the landlord of your chosen property, the "Holding Deposit" will become payable. Upon receipt of this payment Palmer & Partners will commence the referencing process. This is usually done via an online form sent to your email address. This form must be completed within 72 hours to avoid the failure of your tenancy application.</p>
            </div>
            
            <div>
              <p><strong>Important:</strong> all rent, and deposit must be paid in full and received by Palmer & Partners in cleared funds prior to the start of your tenancy.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Holding Deposit</h4>
              <p>Upon acceptance of your application by the landlord of your chosen property, a holding deposit equal to 1 weeks' rent will be taken; this amount will be offset against the total deposit owed.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Referencing Information</h4>
              <p>Before being able to advise our landlord to grant a tenancy by signing a tenancy agreement, Palmer & Partners will need to complete a full reference check on any proposed tenant named overleaf. We use an independent reference provider to carry out this service. A successful reference check is dependent on, but not limited to, the following criteria:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Named tenants must a combined minimum UK based annual salary greater than 30 x monthly rent (excluding bonus/commission).</li>
                <li>If you are self-employed, you must have at least 2 completed tax years of accounts confirming average annual income greater than 30 x monthly rent.</li>
                <li>Any guarantor must earn in excess of 36 x monthly rent per year or have UK based savings in excess of this sum.</li>
                <li>Named tenants must have no County Court Judgements (CCJ) or Bankruptcy and not be in an Individual Voluntary Arrangement (IVA) or similar agreement.</li>
                <li>A successful "previous landlord reference" where your previous landlord/agent must confirm that you have always paid your rent on time.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Right to Rent Check</h4>
              <p>Under the Immigration Act 2014, Palmer & Partners are required to check that all tenants have a legal "Right to Rent" in the UK. The tenant must provide us with original documents as proof of their "Right to Rent".</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Data Protection</h4>
              <p>Palmer & Partners are fully compliant with all relevant Data Protection and G.D.P.R. legislation. Palmer & Partners reserve the right to pass on any relevant information held on you to your landlord, local authority, utility companies, tenancy deposit schemes, debt collection agencies or the police.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
            <Checkbox
              id="termsAccepted"
              checked={termsAccepted}
              onCheckedChange={onTermsAccepted}
              className="mt-1"
            />
            <Label htmlFor="termsAccepted" className="text-sm leading-relaxed cursor-pointer">
              I confirm that I have read and understood the terms and conditions and I am bound by their contents *
            </Label>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Data Sharing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">We may share your details with relevant providers to set up utilities, Council Tax, and discuss insurance options in line with GDPR.</p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
              <Checkbox
                id="utilitiesSharing"
                checked={dataSharing.utilities}
                onCheckedChange={(checked) => onUpdateDataSharing('utilities', checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="utilitiesSharing" className="text-sm leading-relaxed cursor-pointer">
                I would like to share my details with utility providers and One Utility Bill Ltd (OUB) for setting up utilities, Council Tax, and water accounts.
              </Label>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
              <Checkbox
                id="insuranceSharing"
                checked={dataSharing.insurance}
                onCheckedChange={(checked) => onUpdateDataSharing('insurance', checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="insuranceSharing" className="text-sm leading-relaxed cursor-pointer">
                I would like to share my details with Colchester Mortgages or Ipswich Mortgages to discuss insurance options.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Digital Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">I confirm that the information I have provided is accurate and complete</p>
          
          <div className="form-floating">
            <Input
              id="fullName"
              value={signature}
              onChange={(e) => onSignatureChange(e.target.value)}
              placeholder="Type your full name as your digital signature"
              className="form-control text-lg"
              required
            />
            <label htmlFor="fullName" className="text-muted-foreground">Full name *</label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndDataStep;
