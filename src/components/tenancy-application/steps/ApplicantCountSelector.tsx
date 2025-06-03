
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ApplicantCountSelectorProps {
  applicantCount: number;
  onApplicantCountChange: (count: number) => void;
}

const ApplicantCountSelector = ({ applicantCount, onApplicantCountChange }: ApplicantCountSelectorProps) => {
  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-500 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="applicantCount" className="text-lg font-semibold text-dark-grey mb-2">
                How many adults will be living in the property? <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-gray-600 mt-1">Please ensure you provide details for each applicant below.</p>
            </div>
            <Select
              value={applicantCount <= 0 ? "" : applicantCount.toString()}
              onValueChange={(value) => onApplicantCountChange(parseInt(value))}
            >
              <SelectTrigger 
                id="applicantCount" 
                className="focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <SelectValue placeholder="Select an option" />
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
      </CardContent>
    </Card>
  );
};

export default ApplicantCountSelector;
