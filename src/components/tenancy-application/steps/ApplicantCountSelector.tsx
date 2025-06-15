
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { Card, CardContent } from "@/components/ui/card";

interface ApplicantCountSelectorProps {
  applicantCount: number;
  onApplicantCountChange: (count: number) => void;
}

const ApplicantCountSelector = ({ applicantCount, onApplicantCountChange }: ApplicantCountSelectorProps) => {
  const options = [
    { value: "1", label: "1 Applicant" },
    { value: "2", label: "2 Applicants" },
    { value: "3", label: "3 Applicants" },
    { value: "4", label: "4 Applicants" },
    { value: "5", label: "5 Applicants" }
  ];

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-4 md:p-6">
        <div className="w-full space-y-3 md:space-y-4">
          <div className="text-left">
            <Label htmlFor="applicantCount" className="text-base md:text-lg font-semibold text-gray-800 mb-2 block text-left">
              How many adults will be living in the property? <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs md:text-sm text-gray-600 mt-1 text-left">Please ensure you provide details for each applicant below.</p>
          </div>
          <div className="w-full">
            <CustomSelect
              id="applicantCount"
              value={applicantCount <= 0 ? "" : applicantCount.toString()}
              onValueChange={(value) => onApplicantCountChange(parseInt(value))}
              placeholder="Select an option"
              options={options}
              className="form-control focus:ring-orange-500 focus:border-orange-500 bg-white w-full h-11 md:h-12"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicantCountSelector;
