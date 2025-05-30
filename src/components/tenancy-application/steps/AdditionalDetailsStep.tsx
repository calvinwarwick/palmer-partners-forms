
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AdditionalDetails, Applicant } from "@/domain/types/Applicant";
import { PetDetails } from "./PetDetails";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (field: keyof AdditionalDetails, value: string) => void;
  onFillAllTestData: () => void;
  maxRent: string;
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

interface GuarantorData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  contractType: string;
  companyName: string;
  jobTitle: string;
  annualSalary: string;
  lengthOfService: string;
  streetAddress: string;
  postcode: string;
}

const AdditionalDetailsStep = ({ 
  additionalDetails, 
  onUpdateDetails, 
  onFillAllTestData, 
  maxRent, 
  applicants, 
  onUpdateApplicant 
}: AdditionalDetailsStepProps) => {
  // Initialize guarantor data from additionalDetails or use empty defaults
  const guarantorData: GuarantorData = additionalDetails.guarantorDetails ? 
    JSON.parse(additionalDetails.guarantorDetails) : 
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      contractType: '',
      companyName: '',
      jobTitle: '',
      annualSalary: '',
      lengthOfService: '',
      streetAddress: '',
      postcode: ''
    };

  const handleGuarantorChange = (field: keyof GuarantorData, value: string) => {
    const updatedGuarantor = { ...guarantorData, [field]: value };
    onUpdateDetails('guarantorDetails', JSON.stringify(updatedGuarantor));
  };

  return (
    <div className="space-y-6 font-lexend">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Additional Details</h2>
          <p className="text-muted-foreground">Provide additional information for your application</p>
        </div>
        <Button 
          onClick={onFillAllTestData}
          variant="outline"
          size="sm"
          className="hidden md:flex"
        >
          Fill Test Data
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Applicant-specific details */}
        {applicants.map((applicant, index) => (
          <Card key={applicant.id} className="form-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-orange-500" />
                {applicant.firstName} {applicant.lastName} - Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* UK/ROI Passport */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Label className="font-medium">UK/ROI Passport</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 ml-2 help-tooltip" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">Do you have a UK or Republic of Ireland passport?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={applicant.ukPassport || ''}
                  onValueChange={(value) => onUpdateApplicant(applicant.id, 'ukPassport', value)}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`ukPassport-yes-${applicant.id}`} />
                    <Label htmlFor={`ukPassport-yes-${applicant.id}`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`ukPassport-no-${applicant.id}`} />
                    <Label htmlFor={`ukPassport-no-${applicant.id}`}>No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Adverse Credit */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Label className="font-medium">Adverse Credit</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 ml-2 help-tooltip" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">Do you have any adverse credit history such as CCJs, defaults, or bankruptcy?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={applicant.adverseCredit || ''}
                  onValueChange={(value) => onUpdateApplicant(applicant.id, 'adverseCredit', value)}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`adverseCredit-yes-${applicant.id}`} />
                    <Label htmlFor={`adverseCredit-yes-${applicant.id}`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`adverseCredit-no-${applicant.id}`} />
                    <Label htmlFor={`adverseCredit-no-${applicant.id}`}>No</Label>
                  </div>
                </RadioGroup>

                {applicant.adverseCredit === 'yes' && (
                  <div>
                    <Label htmlFor={`adverseCreditDetails-${applicant.id}`}>Please provide details of your adverse credit history</Label>
                    <Textarea
                      id={`adverseCreditDetails-${applicant.id}`}
                      value={applicant.adverseCreditDetails || ''}
                      onChange={(e) => onUpdateApplicant(applicant.id, 'adverseCreditDetails', e.target.value)}
                      placeholder="Describe your adverse credit history..."
                      rows={3}
                      className="form-control"
                    />
                  </div>
                )}
              </div>

              {/* Guarantor Required */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Label className="font-medium">Guarantor Required</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 ml-2 help-tooltip" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">If required, can you supply a guarantor for this proposed tenancy?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={applicant.guarantorRequired || ''}
                  onValueChange={(value) => onUpdateApplicant(applicant.id, 'guarantorRequired', value)}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`guarantorRequired-yes-${applicant.id}`} />
                    <Label htmlFor={`guarantorRequired-yes-${applicant.id}`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`guarantorRequired-no-${applicant.id}`} />
                    <Label htmlFor={`guarantorRequired-no-${applicant.id}`}>No</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Pets */}
        <PetDetails 
          pets={additionalDetails.pets}
          petDetails={additionalDetails.petDetails}
          onPetsChange={(value) => onUpdateDetails('pets', value)}
          onPetDetailsChange={(value) => onUpdateDetails('petDetails', value)}
        />

        {/* Under 18s */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Under 18s</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="under18Count">Number of occupants under 18</Label>
              <Select
                value={additionalDetails.under18Count}
                onValueChange={(value) => onUpdateDetails('under18Count', value)}
              >
                <SelectTrigger className="form-select">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {additionalDetails.under18Count && parseInt(additionalDetails.under18Count) > 0 && (
              <div>
                <Label htmlFor="childrenAges">Ages of children</Label>
                <Input
                  id="childrenAges"
                  value={additionalDetails.childrenAges}
                  onChange={(e) => onUpdateDetails('childrenAges', e.target.value)}
                  placeholder="e.g., 5, 8, 12"
                  className="form-control"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conditions of Offer */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Conditions of Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="conditionsOfOffer">Any special conditions or requests?</Label>
            <Textarea
              id="conditionsOfOffer"
              value={additionalDetails.conditionsOfOffer}
              onChange={(e) => onUpdateDetails('conditionsOfOffer', e.target.value)}
              placeholder="Enter any special conditions or requests..."
              rows={3}
              className="form-control"
            />
          </CardContent>
        </Card>

        {/* Deposit Type */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Deposit Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={additionalDetails.depositType}
              onValueChange={(value) => onUpdateDetails('depositType', value)}
            >
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Select deposit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional Deposit</SelectItem>
                <SelectItem value="deposit-replacement">Deposit Replacement Scheme</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdditionalDetailsStep;
