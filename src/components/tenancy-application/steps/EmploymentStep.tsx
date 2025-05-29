import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TestTube, Briefcase, Building2 } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface EmploymentStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  onFillAllTestData?: () => void;
}

const EmploymentStep = ({ applicants, onUpdateApplicant, onFillAllTestData }: EmploymentStepProps) => {
  const fillTestData = () => {
    console.log('Fill test data button clicked - Employment');
    console.log('Current applicants for employment:', applicants);
    
    const testData = [
      {
        employment: "Full Time",
        companyName: "Tech Solutions Ltd",
        jobTitle: "Software Engineer",
        annualIncome: "45000",
        lengthOfService: "3 years",
        reference1Name: "Mike Johnson",
        reference1Contact: "mike.johnson@techsolutions.com"
      },
      {
        employment: "Full Time",
        companyName: "Design Studio",
        jobTitle: "Graphic Designer",
        annualIncome: "38000",
        lengthOfService: "2 years",
        reference1Name: "Lisa Brown",
        reference1Contact: "lisa.brown@designstudio.com"
      }
    ];

    console.log('Filling employment test data for', applicants.length, 'applicants');
    applicants.forEach((applicant, index) => {
      if (testData[index]) {
        console.log(`Filling employment data for applicant ${index + 1}:`, testData[index]);
        Object.entries(testData[index]).forEach(([field, value]) => {
          console.log(`Setting employment ${field} to ${value} for applicant ${applicant.id}`);
          onUpdateApplicant(applicant.id, field as keyof Applicant, value);
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Briefcase className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Employment Details</h3>
            <p className="text-gray-600 mt-1">Provide employment information for income verification</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
            <TestTube className="h-4 w-4" />
            Fill Step Data
          </Button>
          {onFillAllTestData && (
            <Button variant="default" size="sm" onClick={onFillAllTestData} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
              <TestTube className="h-4 w-4" />
              Fill All Form Data
            </Button>
          )}
        </div>
      </div>
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Briefcase className="h-5 w-5" />
              </div>
              {applicant.firstName} {applicant.lastName} - Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`employment-${applicant.id}`} className="form-label text-gray-700 font-medium">Contract type *</Label>
                <select
                  id={`employment-${applicant.id}`}
                  value={applicant.employment}
                  onChange={(e) => onUpdateApplicant(applicant.id, "employment", e.target.value)}
                  className="form-select border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                >
                  <option value="">Select employment status</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Contract">Contract</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`company-${applicant.id}`} className="form-label text-gray-700 font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-orange-500" />
                  Company name
                </Label>
                <Input
                  id={`company-${applicant.id}`}
                  value={applicant.companyName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "companyName", e.target.value)}
                  placeholder="Enter company name"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`jobTitle-${applicant.id}`} className="form-label text-gray-700 font-medium">Job title</Label>
                <Input
                  id={`jobTitle-${applicant.id}`}
                  value={applicant.jobTitle}
                  onChange={(e) => onUpdateApplicant(applicant.id, "jobTitle", e.target.value)}
                  placeholder="Enter job title"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`income-${applicant.id}`} className="form-label text-gray-700 font-medium">Annual salary (£) *</Label>
                <Input
                  id={`income-${applicant.id}`}
                  type="number"
                  value={applicant.annualIncome}
                  onChange={(e) => onUpdateApplicant(applicant.id, "annualIncome", e.target.value)}
                  placeholder="e.g., 35000"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`lengthOfService-${applicant.id}`} className="form-label text-gray-700 font-medium">Length of service</Label>
              <Input
                id={`lengthOfService-${applicant.id}`}
                value={applicant.lengthOfService}
                onChange={(e) => onUpdateApplicant(applicant.id, "lengthOfService", e.target.value)}
                placeholder="e.g., 2 years"
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`ref1Name-${applicant.id}`} className="form-label text-gray-700 font-medium">Reference 1 Name</Label>
                <Input
                  id={`ref1Name-${applicant.id}`}
                  value={applicant.reference1Name}
                  onChange={(e) => onUpdateApplicant(applicant.id, "reference1Name", e.target.value)}
                  placeholder="Reference name"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`ref1Contact-${applicant.id}`} className="form-label text-gray-700 font-medium">Reference 1 Contact</Label>
                <Input
                  id={`ref1Contact-${applicant.id}`}
                  value={applicant.reference1Contact}
                  onChange={(e) => onUpdateApplicant(applicant.id, "reference1Contact", e.target.value)}
                  placeholder="Email or phone"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmploymentStep;
