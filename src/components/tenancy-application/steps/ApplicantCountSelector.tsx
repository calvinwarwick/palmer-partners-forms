
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantCountSelectorProps {
  applicantCount: number;
  onApplicantCountChange: (count: number) => void;
}

const ApplicantCountSelector = ({ applicantCount, onApplicantCountChange }: ApplicantCountSelectorProps) => {
  return (
    <div className="space-y-4 mb-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Applicant Details</h3>
        <p className="text-gray-600 mb-4">
          Please select the number of adults who will be staying at the property and provide details for each applicant.
        </p>
      </div>
      
      <div>
        <Label htmlFor="applicantCount" className="form-label">
          How many adults will be living in the property? Please ensure you provide details for each applicant below. *
        </Label>
        <Select
          value={applicantCount.toString()}
          onValueChange={(value) => onApplicantCountChange(parseInt(value))}
        >
          <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
            <SelectValue placeholder="Select number of applicants" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Applicant</SelectItem>
            <SelectItem value="2">2 Applicants</SelectItem>
            <SelectItem value="3">3 Applicants</SelectItem>
            <SelectItem value="4">4 Applicants</SelectItem>
            <SelectItem value="5">5 Applicants</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ApplicantCountSelector;
