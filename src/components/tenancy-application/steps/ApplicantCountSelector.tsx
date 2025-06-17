
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ApplicantCountSelectorProps {
  applicantCount: number;
  onApplicantCountChange: (count: number) => void;
}

const ApplicantCountSelector = ({ applicantCount, onApplicantCountChange }: ApplicantCountSelectorProps) => {
  return (
    <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-4 md:p-6">
        <div className="w-full space-y-3 md:space-y-4">
          <div className="text-left">
            <Label htmlFor="applicantCount" className="text-base md:text-lg font-semibold text-dark-grey mb-2 block text-left">
              How many adults will be living in the property? <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs md:text-sm text-gray-600 mt-1 text-left">Please ensure you provide details for each applicant below.</p>
          </div>
          <div className="w-full">
            <Select
              value={applicantCount <= 0 ? "" : applicantCount.toString()}
              onValueChange={(value) => onApplicantCountChange(parseInt(value))}
            >
              <SelectTrigger 
                id="applicantCount" 
                className="form-control focus:ring-orange-500 focus:border-orange-500 bg-white w-full h-11 md:h-12"
              >
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg rounded-lg">
                <SelectItem value="1" className="hover:bg-orange-50">1 Applicant</SelectItem>
                <SelectItem value="2" className="hover:bg-orange-50">2 Applicants</SelectItem>
                <SelectItem value="3" className="hover:bg-orange-50">3 Applicants</SelectItem>
                <SelectItem value="4" className="hover:bg-orange-50">4 Applicants</SelectItem>
                <SelectItem value="5" className="hover:bg-orange-50">5 Applicants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicantCountSelector;
