
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, User, ArrowRight, ArrowLeft } from "lucide-react";

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  employment: string;
  employer: string;
  annualIncome: string;
  previousAddress: string;
  references: string;
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
      employer: "",
      annualIncome: "",
      previousAddress: "",
      references: ""
    }
  ]);

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
        employer: "",
        annualIncome: "",
        previousAddress: "",
        references: ""
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

  const renderApplicantForm = (applicant: Applicant, index: number) => (
    <Card key={applicant.id} className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Applicant {index + 1}
        </CardTitle>
        {applicants.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeApplicant(applicant.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`firstName-${applicant.id}`}>First Name</Label>
            <Input
              id={`firstName-${applicant.id}`}
              value={applicant.firstName}
              onChange={(e) => updateApplicant(applicant.id, 'firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <Label htmlFor={`lastName-${applicant.id}`}>Last Name</Label>
            <Input
              id={`lastName-${applicant.id}`}
              value={applicant.lastName}
              onChange={(e) => updateApplicant(applicant.id, 'lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`email-${applicant.id}`}>Email</Label>
            <Input
              id={`email-${applicant.id}`}
              type="email"
              value={applicant.email}
              onChange={(e) => updateApplicant(applicant.id, 'email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor={`phone-${applicant.id}`}>Phone Number</Label>
            <Input
              id={`phone-${applicant.id}`}
              type="tel"
              value={applicant.phone}
              onChange={(e) => updateApplicant(applicant.id, 'phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`dateOfBirth-${applicant.id}`}>Date of Birth</Label>
          <Input
            id={`dateOfBirth-${applicant.id}`}
            type="date"
            value={applicant.dateOfBirth}
            onChange={(e) => updateApplicant(applicant.id, 'dateOfBirth', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`employment-${applicant.id}`}>Employment Status</Label>
            <Input
              id={`employment-${applicant.id}`}
              value={applicant.employment}
              onChange={(e) => updateApplicant(applicant.id, 'employment', e.target.value)}
              placeholder="e.g., Full-time, Self-employed"
            />
          </div>
          <div>
            <Label htmlFor={`employer-${applicant.id}`}>Employer</Label>
            <Input
              id={`employer-${applicant.id}`}
              value={applicant.employer}
              onChange={(e) => updateApplicant(applicant.id, 'employer', e.target.value)}
              placeholder="Enter employer name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`annualIncome-${applicant.id}`}>Annual Income (£)</Label>
          <Input
            id={`annualIncome-${applicant.id}`}
            type="number"
            value={applicant.annualIncome}
            onChange={(e) => updateApplicant(applicant.id, 'annualIncome', e.target.value)}
            placeholder="Enter annual income"
          />
        </div>

        <div>
          <Label htmlFor={`previousAddress-${applicant.id}`}>Previous Address</Label>
          <Textarea
            id={`previousAddress-${applicant.id}`}
            value={applicant.previousAddress}
            onChange={(e) => updateApplicant(applicant.id, 'previousAddress', e.target.value)}
            placeholder="Enter previous address"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor={`references-${applicant.id}`}>References</Label>
          <Textarea
            id={`references-${applicant.id}`}
            value={applicant.references}
            onChange={(e) => updateApplicant(applicant.id, 'references', e.target.value)}
            placeholder="Enter reference details"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep1 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Applicant Information</h2>
        <p className="text-gray-600">Please provide details for all applicants (maximum 5).</p>
      </div>

      {applicants.map((applicant, index) => renderApplicantForm(applicant, index))}

      {applicants.length < 5 && (
        <Button onClick={addApplicant} variant="outline" className="w-full mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Applicant
        </Button>
      )}

      <div className="flex justify-between">
        <div></div>
        <Button onClick={() => setCurrentStep(2)}>
          Next Step
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review your application before submitting.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Number of Applicants</Label>
              <p className="text-lg">{applicants.length}</p>
            </div>
            
            {applicants.map((applicant, index) => (
              <div key={applicant.id} className="border-t pt-4">
                <Badge variant="secondary" className="mb-2">
                  Applicant {index + 1}
                </Badge>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p>{applicant.firstName} {applicant.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p>{applicant.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Employment</Label>
                    <p>{applicant.employment}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Annual Income</Label>
                    <p>£{applicant.annualIncome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Digital Signature Required</h3>
        <p className="text-sm text-gray-600 mb-4">
          By submitting this application, you confirm that all information provided is accurate and complete.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Digital signature field will be implemented here</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          Submit Application
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Tenancy Application Form</h1>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 hidden sm:inline">Applicant Info</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded">
              <div className={`h-1 rounded transition-all duration-300 ${currentStep >= 2 ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0'}`}></div>
            </div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 hidden sm:inline">Review & Submit</span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenancyApplicationForm;
