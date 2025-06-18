
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
            <Label htmlFor="additionalRequests" className="text-sm font-medium text-dark-grey">
              Special Requirements or Requests
            </Label>
            <Textarea
              id="additionalRequests"
              placeholder="Please describe any special requirements, accessibility needs, or requests you may have..."
              value={additionalDetails.additionalRequests || ''}
              onChange={(e) => onUpdateDetails({ additionalRequests: e.target.value })}
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

          {/* Moving Date */}
          <div className="space-y-2">
            <Label htmlFor="moveInDate" className="text-sm font-medium text-dark-grey">
              Preferred Moving Date
            </Label>
            <Input
              id="moveInDate"
              type="date"
              value={additionalDetails.moveInDate || ''}
              onChange={(e) => onUpdateDetails({ moveInDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pet Details Card */}
      <PetDetails
        pets={additionalDetails.pets ? 'yes' : 'no'}
        petDetails={additionalDetails.petDetails}
        onPetsChange={(value) => onUpdateDetails({ pets: value === 'yes' })}
        onPetDetailsChange={(value) => onUpdateDetails({ petDetails: value })}
      />
    </div>
  );
};

export default AdditionalDetailsStep;
