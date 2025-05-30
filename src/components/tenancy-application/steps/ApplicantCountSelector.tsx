
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantCountSelectorProps {
  applicantCount: number;
  onApplicantCountChange: (count: number) => void;
}

const ApplicantCountSelector = ({ applicantCount, onApplicantCountChange }: ApplicantCountSelectorProps) => {
  return (
    <div className="applicant-details-section mb-8">
      <div>
        <h3>Applicant Details</h3>
      </div>
      
      <div>
        <Label htmlFor="applicantCount" className="form-label">
          How many adults will be living in the property? Please ensure you provide details for each applicant below. <span className="text-red-500">*</span>
        </Label>
        <Select
          value={applicantCount.toString()}
          onValueChange={(value) => onApplicantCountChange(parseInt(value))}
        >
          <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
            <SelectValue placeholder="Please select an option" />
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
