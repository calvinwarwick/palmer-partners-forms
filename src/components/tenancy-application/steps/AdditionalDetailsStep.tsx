
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";
import { Applicant, AdditionalDetails } from "@/domain/types/Applicant";
import PetDetails from "./PetDetails";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (details: Partial<AdditionalDetails>) => void;
  maxRent: number;
  applicants: Applicant[];
  onUpdateApplicant: (index: number, field: string, value: any) => void;
}

const AdditionalDetailsStep = ({ 
  additionalDetails, 
  onUpdateDetails, 
  maxRent,
  applicants,
  onUpdateApplicant 
}: AdditionalDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/95 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-dark-grey">Additional Details</CardTitle>
          <CardDescription>
            Please provide any additional information about your tenancy requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="specialRequirements" className="text-sm font-medium text-dark-grey">
              Special Requirements or Requests
            </Label>
            <Textarea
              id="specialRequirements"
              placeholder="Please describe any special requirements, accessibility needs, or requests you may have..."
              value={additionalDetails.specialRequirements || ''}
              onChange={(e) => onUpdateDetails({ specialRequirements: e.target.value })}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Deposit Information */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="space-y-2">
                <h4 className="font-semibold text-dark-grey">Security Deposit Information</h4>
                <p className="text-sm text-gray-600">
                  Your security deposit will be protected under the Tenancy Deposit Scheme. 
                  For detailed information about how your deposit is protected, please review our deposit information guide.
                </p>
                <a 
                  href="https://akgmvwevnljjhcjgnzly.supabase.co/storage/v1/object/public/admin-files/1750247127695-Reposit_Tenant_deposit_information.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                >
                  View Deposit Information Guide
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Deposit Ready Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-1">
              <Label htmlFor="depositReady" className="text-sm font-medium text-dark-grey">
                Deposit Ready
              </Label>
              <p className="text-xs text-gray-600">
                I confirm that I have the required deposit amount (typically equivalent to {maxRent > 0 ? `£${maxRent}` : 'one month\'s rent'}) ready to pay upon successful application
              </p>
            </div>
            <Switch
              id="depositReady"
              checked={additionalDetails.depositReady || false}
              onCheckedChange={(checked) => onUpdateDetails({ depositReady: checked })}
            />
          </div>

          {/* References Available */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-1">
              <Label htmlFor="referencesAvailable" className="text-sm font-medium text-dark-grey">
                References Available
              </Label>
              <p className="text-xs text-gray-600">
                I can provide landlord/employer references upon request
              </p>
            </div>
            <Switch
              id="referencesAvailable"
              checked={additionalDetails.referencesAvailable || false}
              onCheckedChange={(checked) => onUpdateDetails({ referencesAvailable: checked })}
            />
          </div>

          {/* Moving Date */}
          <div className="space-y-2">
            <Label htmlFor="movingDate" className="text-sm font-medium text-dark-grey">
              Preferred Moving Date
            </Label>
            <Input
              id="movingDate"
              type="date"
              value={additionalDetails.movingDate || ''}
              onChange={(e) => onUpdateDetails({ movingDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pet Details Card */}
      <PetDetails
        applicants={applicants}
        onUpdateApplicant={onUpdateApplicant}
      />
    </div>
  );
};

export default AdditionalDetailsStep;
