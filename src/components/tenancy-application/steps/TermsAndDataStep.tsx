
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, FileText } from "lucide-react";
import SignaturePad from "@/components/ui/signature-pad";

interface TermsAndDataStepProps {
  dataSharing: {
    utilities: boolean;
    insurance: boolean;
  };
  onDataSharingChange: (field: string, value: boolean) => void;
  onUpdateDataSharing?: (field: "utilities" | "insurance", value: boolean) => void;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  signature?: string;
  onSignatureChange?: (signature: string) => void;
  fullName?: string;
  onFullNameChange?: (name: string) => void;
  onTermsAccepted?: any;
  onFillAllTestData?: () => void;
}

const TermsAndDataStep = ({ 
  dataSharing, 
  onDataSharingChange,
  onUpdateDataSharing,
  termsAccepted, 
  onTermsChange,
  signature,
  onSignatureChange,
  fullName,
  onFullNameChange
}: TermsAndDataStepProps) => {
  const handleDataSharingChange = (field: string, value: boolean) => {
    if (onUpdateDataSharing) {
      onUpdateDataSharing(field as "utilities" | "insurance", value);
    } else {
      onDataSharingChange(field, value);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Terms & Conditions</h3>
        <p className="text-light-grey mb-4">Review and accept our terms, data sharing preferences, and provide your signature</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {/* Terms & Conditions Section */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="max-h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50 text-sm custom-scrollbar" style={{ borderColor: 'rgb(228, 228, 231)' }}>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                <p className="text-gray-700 mb-2">
                  If your offer is accepted by the landlord of your chosen property, the "Holding Deposit" will become payable. Upon receipt of this payment Palmer & Partners will commence the referencing process. This is usually done via an online form sent to your email address. This form must be completed within 72 hours to avoid the failure of your tenancy application.
                </p>
                <p className="text-gray-700 font-semibold mb-2">
                  Important: all rent, and deposit must be paid in full and received by Palmer & Partners in cleared funds prior to the start of your tenancy.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Holding Deposit</h4>
                <p className="text-gray-700 mb-2">
                  Upon acceptance of your application by the landlord of your chosen property, a holding deposit equal to 1 weeks' rent will be taken; this amount will be offset against the total deposit owed.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Referencing Information</h4>
                <p className="text-gray-700 mb-2">
                  Before being able to advise our landlord to grant a tenancy by signing a tenancy agreement, Palmer & Partners will need to complete a full reference check on any proposed tenant named overleaf. We use an independent reference provider to carry out this service. A successful reference check is dependent on, but not limited to, the following criteria:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-2">
                  <li>Named tenants must a combined minimum UK based annual salary greater than 30 x monthly rent (excluding bonus/commission). Alternatively, if a tenant has UK based savings in excess of this sum and they have been in place for over 3 months, there are circumstances where this can be considered in lieu of income.</li>
                  <li>If you are self-employed, you must have at least 2 completed tax years of accounts confirming average annual income greater than 30 x monthly rent.</li>
                  <li>Any guarantor must earn in excess of 36 x monthly rent per year or have UK based savings in excess of this sum (these savings must have been in place for over 3 months).</li>
                  <li>Named tenants must have no County Court Judgements (CCJ) or Bankruptcy and not be in an Individual Voluntary Arrangement (IVA) or similar agreement.</li>
                  <li>A successful "previous landlord reference" where your previous landlord/agent must confirm that you have always paid your rent on time, kept the property in good order and that you are free to leave the tenancy.</li>
                </ul>
                <p className="text-gray-700">
                  Should a tenant or guarantor fail a credit check due to inaccurate or misleading information, fail to fill in the referencing forms within the stipulated time frame or withdraw from the application process for any reason, the above "Holding Deposit" is non-refundable. Should the landlord withdraw from the application process prior to the start date of the tenancy, any deposit or rent paid will be refunded to the tenant in full.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Change of Occupancy</h4>
                <p className="text-gray-700 mb-2">
                  If the tenant wishes to change the identity of any tenant named on the current tenancy agreement, upon receipt of consent from the landlord, Palmer & Partners will draw up a new tenancy agreement to be signed by all parties. An administration charge of £50.00 + VAT (£60.00 Inc. VAT) will be charged for this service. Any new reference required will be charged at £50.00 + VAT (£60.00 Inc. VAT). Additionally, there will be a charge of £50.00 + VAT (£60.00 Inc. VAT) to re-register any Deposit in the new tenant's name(s).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Missed Appointments</h4>
                <p className="text-gray-700 mb-2">
                  In the event that an appointment is missed by the tenant (e.g., where it has been arranged that a tenant will be present to allow a contractor to access the property), any charges levied to the landlord or agent by a third party for this missed appointment will be passed directly on to the tenant.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Consequences of Early Termination</h4>
                <p className="text-gray-700 mb-2">
                  If the tenant wishes to terminate the tenancy prior to the end of a fixed term, upon receiving written permission from the landlord (such permission does not have to be granted), the tenant will remain liable for all rent, bills, charges and costs payable under the terms of the contract until the term expires of the property is re-let, whichever is earlier. Should the property be re-let during the fixed term, the tenant will also be responsible for any remarketing fees that have been or will be incurred by the landlord for finding a new tenant (usually a sum equal to one month's rent per year or part year of the tenancy remaining) as well as any costs incurred by the landlord in having to pay for additional referencing or obtaining a new Inventory/Schedule of Condition report. Furthermore, the tenant is responsible for any other reasonable costs (e.g., telephone lines, satellite television contracts, TV licensing, cleaning, administration fees, etc.) incurred until the end of the term or until when the property is re-let. For the avoidance of doubt, this clause shall not take effect if the tenant is operating a pre-agreed "break clause" contained in the contract.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Right to Rent Check</h4>
                <p className="text-gray-700 mb-2">
                  Under the Immigration Act 2014, Palmer & Partners are required to check that all tenants have a legal "Right to Rent" in the UK. The tenant must provide us with original documents as proof of their "Right to Rent". If the tenant is a resident of the UK, a passport will be sufficient proof. However, if the tenant is not a resident in the UK, additional documentation or "share code" will be required; a list of admissible documents is available upon request.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Management of the Property</h4>
                <p className="text-gray-700 mb-2">
                  You will be advised at the start of your tenancy who is managing the property i.e., Palmer & Partners, the landlord or a 3rd party. Where the property is managed by Palmer & Partners, we will need to obtain the landlord's consent before authorising or arranging any repair.
                </p>
                <p className="text-gray-700 mb-2">
                  When we manage a property AND hold keys, we can provide access to our contractors (with your prior permission). However, where we do NOT hold keys or a contractor is unable to collect keys, it is the tenant's responsibility to provide access.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Insurance</h4>
                <p className="text-gray-700 mb-2">
                  It is the tenant's responsibility to insure their personal belongings with a reputable insurer for the duration of the tenancy. Palmer & Partners work alongside two financial services companies: Colchester Mortgages and Ipswich Mortgages. We will ask the appropriate company (based on the property location) to contact you to discuss your insurance options. Any data passed to the above company will be held in line with their GDPR procedures.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Utilities</h4>
                <p className="text-gray-700 mb-2">
                  If your new property is managed by Palmer & Partners, we may disclose your name and contact information to any incumbent utility providers, water company and local authority. This may be done directly or via One Utility Bill Ltd (OUB). OUB will contact you on or around your move-in day to inform you of who currently supplies the utilities to your new home. Additionally, in line with the tenancy start date, OUB will transfer the Council Tax and water account into your name. Furthermore, OUB, existing utility suppliers and the local authority may contact you directly to discuss their services, products and prices. OUB will only use any tenants' details for the purposes of utility switching and not in any other way. Any data passed to OUB, or incumbent utility provider will be held in line with their GDPR procedures.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Taxation</h4>
                <p className="text-gray-700 mb-2">
                  If rent is paid directly to the landlord's bank account and the landlord is resident overseas, the tenant will be responsible for applying the provisions of the HM Revenue and Customs Non-Residential Landlords scheme for taxing UK income and should ask for advice on this. This provision does NOT apply where rent is paid to Palmer & Partners.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
                <p className="text-gray-700 mb-2">
                  Palmer & Partners are fully compliant with all relevant Data Protection and G.D.P.R. legislation. Palmer & Partners reserve the right to pass on any relevant information held on you (current and future contact information, referencing results and tenancy performance details) to your landlord, local authority, utility companies, tenancy deposit schemes, debt collection agencies or the police.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Complaints Procedure</h4>
                <p className="text-gray-700">
                  Should a tenant/applicant have any problems with Palmer & Partners' services you should write to the branch manager. This complaint will be acknowledged within 3 working days of receipt and an investigation undertaken. A formal written outcome of the investigation will be sent to you. If you remain dissatisfied, you should write to the Managing Director – the same time limits apply. Following the Managing Director's investigation, a written statement expressing Palmer & Partners' final view will be sent to you, including any offer made. This letter will confirm that, should still remain dissatisfied, you are entitled to refer the matter to The Property Ombudsman (TPO) for review within six months. The TPO will only review complaints made by consumers and only once the in-house complaints procedure has been completed.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Switch
              id="terms"
              checked={termsAccepted}
              onCheckedChange={onTermsChange}
            />
            <Label 
              htmlFor="terms" 
              className="text-gray-700 font-medium cursor-pointer mb-0"
              onClick={() => onTermsChange(!termsAccepted)}
            >
              I confirm that I have read and understood the terms and conditions and I am bound by their contents <span className="text-red-500">*</span>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing Section */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
            Data Sharing Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Switch
              id="utilities"
              checked={dataSharing.utilities}
              onCheckedChange={(checked) => handleDataSharingChange('utilities', checked)}
            />
            <Label 
              htmlFor="utilities" 
              className="text-gray-700 font-medium cursor-pointer"
              onClick={() => handleDataSharingChange('utilities', !dataSharing.utilities)}
            >
              I would like to share my details with utility providers and One Utility Bill Ltd (OUB) for setting up utilities, Council Tax, and water accounts.
            </Label>
          </div>
          
          <div className="flex items-center gap-3">
            <Switch
              id="insurance"
              checked={dataSharing.insurance}
              onCheckedChange={(checked) => handleDataSharingChange('insurance', checked)}
            />
            <Label 
              htmlFor="insurance" 
              className="text-gray-700 font-medium cursor-pointer"
              onClick={() => handleDataSharingChange('insurance', !dataSharing.insurance)}
            >
              I would like to share my details with Colchester Mortgages or Ipswich Mortgages to discuss insurance options.
            </Label>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            We may share your details with relevant providers to set up utilities, Council Tax, and discuss insurance options in line with GDPR.
          </p>
        </CardContent>
      </Card>

      <div className="w-full">
        <SignaturePad
          value={signature}
          onChange={onSignatureChange}
          fullName={fullName}
          onFullNameChange={onFullNameChange}
          width={800}
          height={200}
        />
      </div>
    </div>
  );
};

export default TermsAndDataStep;
