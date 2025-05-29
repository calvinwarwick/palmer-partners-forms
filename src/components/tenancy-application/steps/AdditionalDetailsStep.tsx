
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AdditionalDetails } from "@/domain/types/Applicant";
import { PetDetails } from "./PetDetails";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (field: keyof AdditionalDetails, value: string) => void;
  onFillAllTestData: () => void;
  maxRent: string;
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

const AdditionalDetailsStep = ({ additionalDetails, onUpdateDetails, onFillAllTestData, maxRent }: AdditionalDetailsStepProps) => {
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
    <div className="space-y-6">
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
        {/* UK/ROI Passport */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              UK/ROI Passport
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={additionalDetails.ukPassport}
              onValueChange={(value) => onUpdateDetails('ukPassport', value)}
              className="flex flex-row space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ukPassport-yes" />
                <Label htmlFor="ukPassport-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ukPassport-no" />
                <Label htmlFor="ukPassport-no">No</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Adverse Credit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Adverse Credit
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
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={additionalDetails.adverseCredit}
              onValueChange={(value) => onUpdateDetails('adverseCredit', value)}
              className="flex flex-row space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="adverseCredit-yes" />
                <Label htmlFor="adverseCredit-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="adverseCredit-no" />
                <Label htmlFor="adverseCredit-no">No</Label>
              </div>
            </RadioGroup>

            {additionalDetails.adverseCredit === 'yes' && (
              <div>
                <Label htmlFor="adverseCreditDetails">Please provide details of your adverse credit history</Label>
                <Textarea
                  id="adverseCreditDetails"
                  value={additionalDetails.adverseCreditDetails}
                  onChange={(e) => onUpdateDetails('adverseCreditDetails', e.target.value)}
                  placeholder="Describe your adverse credit history..."
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guarantor Required */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Guarantor Required
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
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={additionalDetails.guarantorRequired}
              onValueChange={(value) => onUpdateDetails('guarantorRequired', value)}
              className="flex flex-row space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="guarantorRequired-yes" />
                <Label htmlFor="guarantorRequired-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="guarantorRequired-no" />
                <Label htmlFor="guarantorRequired-no">No</Label>
              </div>
            </RadioGroup>

            {/* Guarantor Details Section */}
            {additionalDetails.guarantorRequired === 'yes' && (
              <Card className="mt-4 bg-gray-50 dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg">Guarantor Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="guarantor-firstName">
                          First name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="guarantor-firstName"
                          value={guarantorData.firstName}
                          onChange={(e) => handleGuarantorChange('firstName', e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guarantor-lastName">
                          Last name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="guarantor-lastName"
                          value={guarantorData.lastName}
                          onChange={(e) => handleGuarantorChange('lastName', e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guarantor-dateOfBirth">
                          Date of birth <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="guarantor-dateOfBirth"
                          type="date"
                          value={guarantorData.dateOfBirth}
                          onChange={(e) => handleGuarantorChange('dateOfBirth', e.target.value)}
                          placeholder="dd/mm/yyyy"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guarantor-email">
                          Email address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="guarantor-email"
                          type="email"
                          value={guarantorData.email}
                          onChange={(e) => handleGuarantorChange('email', e.target.value)}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guarantor-phone">Mobile number</Label>
                        <div className="flex">
                          <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                            <Badge variant="outline" className="text-xs">🇬🇧</Badge>
                          </div>
                          <Input
                            id="guarantor-phone"
                            value={guarantorData.phone}
                            onChange={(e) => handleGuarantorChange('phone', e.target.value)}
                            placeholder="07400 123456"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base">Guarantor Employment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="guarantor-contractType">
                          Contract Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={guarantorData.contractType}
                          onValueChange={(value) => handleGuarantorChange('contractType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="self-employed">Self Employed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="guarantor-companyName">Company name</Label>
                        <Input
                          id="guarantor-companyName"
                          value={guarantorData.companyName}
                          onChange={(e) => handleGuarantorChange('companyName', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guarantor-jobTitle">Job title</Label>
                        <Input
                          id="guarantor-jobTitle"
                          value={guarantorData.jobTitle}
                          onChange={(e) => handleGuarantorChange('jobTitle', e.target.value)}
                          placeholder="Enter job title"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guarantor-annualSalary">Annual salary</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                          <Input
                            id="guarantor-annualSalary"
                            value={guarantorData.annualSalary}
                            onChange={(e) => handleGuarantorChange('annualSalary', e.target.value)}
                            placeholder="Enter annual salary"
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="guarantor-lengthOfService">Length of service</Label>
                        <Select
                          value={guarantorData.lengthOfService}
                          onValueChange={(value) => handleGuarantorChange('lengthOfService', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                            <SelectItem value="6-months-to-1-year">6 months to 1 year</SelectItem>
                            <SelectItem value="1-2-years">1-2 years</SelectItem>
                            <SelectItem value="2-5-years">2-5 years</SelectItem>
                            <SelectItem value="5-plus-years">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base">Guarantor Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guarantor-streetAddress">
                          Street address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="guarantor-streetAddress"
                          value={guarantorData.streetAddress}
                          onChange={(e) => handleGuarantorChange('streetAddress', e.target.value)}
                          placeholder="Enter street address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guarantor-postcode">
                          Postcode <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="guarantor-postcode"
                          value={guarantorData.postcode}
                          onChange={(e) => handleGuarantorChange('postcode', e.target.value)}
                          placeholder="Enter postcode"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Pets */}
        <PetDetails 
          pets={additionalDetails.pets}
          petDetails={additionalDetails.petDetails}
          onPetsChange={(value) => onUpdateDetails('pets', value)}
          onPetDetailsChange={(value) => onUpdateDetails('petDetails', value)}
        />

        {/* Under 18s */}
        <Card>
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
                <SelectTrigger>
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
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conditions of Offer */}
        <Card>
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
            />
          </CardContent>
        </Card>

        {/* Deposit Type */}
        <Card>
          <CardHeader>
            <CardTitle>Deposit Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={additionalDetails.depositType}
              onValueChange={(value) => onUpdateDetails('depositType', value)}
            >
              <SelectTrigger>
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
