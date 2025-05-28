import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Plus, X, User, Home, FileText, CheckCircle, Mail } from "lucide-react";
import { sendApplicationConfirmation, sendAdminNotification } from "@/services/emailService";

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  employment: string;
  annualIncome: string;
  previousAddress: string;
  reference1Name: string;
  reference1Contact: string;
}

const TenancyApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      employment: "",
      annualIncome: "",
      previousAddress: "",
      reference1Name: "",
      reference1Contact: ""
    }
  ]);
  const [propertyPreferences, setPropertyPreferences] = useState({
    propertyType: "",
    maxRent: "",
    preferredLocation: "",
    moveInDate: "",
    additionalRequests: ""
  });
  const [signature, setSignature] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const addApplicant = () => {
    if (applicants.length < 5) {
      const newApplicant: Applicant = {
        id: Date.now().toString(),
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        employment: "",
        annualIncome: "",
        previousAddress: "",
        reference1Name: "",
        reference1Contact: ""
      };
      setApplicants([...applicants, newApplicant]);
    }
  };

  const removeApplicant = (id: string) => {
    if (applicants.length > 1) {
      setApplicants(applicants.filter(applicant => applicant.id !== id));
    }
  };

  const updateApplicant = (id: string, field: keyof Applicant, value: string) => {
    setApplicants(applicants.map(applicant => 
      applicant.id === id ? { ...applicant, [field]: value } : applicant
    ));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return applicants.every(applicant => 
          applicant.firstName && applicant.lastName && applicant.email && applicant.phone
        );
      case 2:
        return applicants.every(applicant => 
          applicant.employment && applicant.annualIncome
        );
      case 3:
        return propertyPreferences.propertyType && propertyPreferences.maxRent;
      case 4:
        return signature.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      console.log("Application submitted:", { applicants, propertyPreferences, signature });
      
      // Send email notifications
      toast({
        title: "Sending confirmation...",
        description: "Please wait while we process your application.",
      });

      const [confirmationSent, adminNotified] = await Promise.all([
        sendApplicationConfirmation(applicants, propertyPreferences, signature),
        sendAdminNotification(applicants, propertyPreferences, signature)
      ]);

      if (confirmationSent) {
        toast({
          title: "Application Submitted Successfully!",
          description: `A confirmation email has been sent to ${applicants[0].email}`,
        });
      } else {
        toast({
          title: "Application Submitted",
          description: "Your application was submitted, but we couldn't send the confirmation email. Please contact us if you don't receive it shortly.",
          variant: "destructive",
        });
      }

      if (!adminNotified) {
        console.warn("Admin notification failed to send");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-blue-700 font-medium">
                Confirmation email sent to:
              </p>
              <p className="text-sm text-blue-600">
                {applicants[0].email}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Your tenancy application has been successfully submitted. We'll review it and get back to you within 2-3 business days.
            </p>
            <div className="space-y-3">
              <Link to="/">
                <Button className="w-full">Back to Properties</Button>
              </Link>
              <Button variant="outline" className="w-full">
                Download Application Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <Badge variant="secondary">{applicants.length} of 5 applicants</Badge>
            </div>
            
            {applicants.map((applicant, index) => (
              <Card key={applicant.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Applicant {index + 1}</CardTitle>
                    {applicants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeApplicant(applicant.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`firstName-${applicant.id}`}>First Name *</Label>
                      <Input
                        id={`firstName-${applicant.id}`}
                        value={applicant.firstName}
                        onChange={(e) => updateApplicant(applicant.id, "firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`lastName-${applicant.id}`}>Last Name *</Label>
                      <Input
                        id={`lastName-${applicant.id}`}
                        value={applicant.lastName}
                        onChange={(e) => updateApplicant(applicant.id, "lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`email-${applicant.id}`}>Email *</Label>
                      <Input
                        id={`email-${applicant.id}`}
                        type="email"
                        value={applicant.email}
                        onChange={(e) => updateApplicant(applicant.id, "email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`phone-${applicant.id}`}>Phone *</Label>
                      <Input
                        id={`phone-${applicant.id}`}
                        type="tel"
                        value={applicant.phone}
                        onChange={(e) => updateApplicant(applicant.id, "phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`dob-${applicant.id}`}>Date of Birth</Label>
                    <Input
                      id={`dob-${applicant.id}`}
                      type="date"
                      value={applicant.dateOfBirth}
                      onChange={(e) => updateApplicant(applicant.id, "dateOfBirth", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {applicants.length < 5 && (
              <Button variant="outline" onClick={addApplicant} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Applicant
              </Button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Employment & Financial Information</h3>
            
            {applicants.map((applicant, index) => (
              <Card key={applicant.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {applicant.firstName} {applicant.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`employment-${applicant.id}`}>Employment Status *</Label>
                    <select
                      id={`employment-${applicant.id}`}
                      value={applicant.employment}
                      onChange={(e) => updateApplicant(applicant.id, "employment", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select employment status</option>
                      <option value="employed">Employed Full-time</option>
                      <option value="part-time">Employed Part-time</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor={`income-${applicant.id}`}>Annual Income (£) *</Label>
                    <Input
                      id={`income-${applicant.id}`}
                      type="number"
                      value={applicant.annualIncome}
                      onChange={(e) => updateApplicant(applicant.id, "annualIncome", e.target.value)}
                      placeholder="e.g., 35000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`prevAddress-${applicant.id}`}>Previous Address</Label>
                    <Input
                      id={`prevAddress-${applicant.id}`}
                      value={applicant.previousAddress}
                      onChange={(e) => updateApplicant(applicant.id, "previousAddress", e.target.value)}
                      placeholder="Full previous address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`ref1Name-${applicant.id}`}>Reference 1 Name</Label>
                      <Input
                        id={`ref1Name-${applicant.id}`}
                        value={applicant.reference1Name}
                        onChange={(e) => updateApplicant(applicant.id, "reference1Name", e.target.value)}
                        placeholder="Reference name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ref1Contact-${applicant.id}`}>Reference 1 Contact</Label>
                      <Input
                        id={`ref1Contact-${applicant.id}`}
                        value={applicant.reference1Contact}
                        onChange={(e) => updateApplicant(applicant.id, "reference1Contact", e.target.value)}
                        placeholder="Email or phone"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Property Preferences</h3>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="propertyType">Preferred Property Type *</Label>
                  <select
                    id="propertyType"
                    value={propertyPreferences.propertyType}
                    onChange={(e) => setPropertyPreferences({...propertyPreferences, propertyType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="maisonette">Maisonette</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="maxRent">Maximum Monthly Rent (£) *</Label>
                  <Input
                    id="maxRent"
                    type="number"
                    value={propertyPreferences.maxRent}
                    onChange={(e) => setPropertyPreferences({...propertyPreferences, maxRent: e.target.value})}
                    placeholder="e.g., 2500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Preferred Location</Label>
                  <Input
                    id="location"
                    value={propertyPreferences.preferredLocation}
                    onChange={(e) => setPropertyPreferences({...propertyPreferences, preferredLocation: e.target.value})}
                    placeholder="e.g., Central London, Zone 2"
                  />
                </div>
                <div>
                  <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                  <Input
                    id="moveInDate"
                    type="date"
                    value={propertyPreferences.moveInDate}
                    onChange={(e) => setPropertyPreferences({...propertyPreferences, moveInDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="requests">Additional Requests</Label>
                  <textarea
                    id="requests"
                    value={propertyPreferences.additionalRequests}
                    onChange={(e) => setPropertyPreferences({...propertyPreferences, additionalRequests: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Any special requirements or preferences..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
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
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your full name here"
                  className="text-lg"
                  required
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
          
          <div className="flex items-center space-x-4 mb-4">
            <Home className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tenancy Application</h1>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between mb-8">
            {[
              { step: 1, icon: User, label: "Personal Info" },
              { step: 2, icon: FileText, label: "Employment" },
              { step: 3, icon: Home, label: "Preferences" },
              { step: 4, icon: CheckCircle, label: "Review & Sign" }
            ].map(({ step, icon: Icon, label }) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= step 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-400"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-gray-600 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateCurrentStep() || isSubmitting}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateCurrentStep() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenancyApplicationForm;
