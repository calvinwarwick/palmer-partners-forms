
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";
import EmploymentFields from "./EmploymentFields";

interface ApplicantEmploymentCardProps {
  applicant: Applicant;
  index: number;
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const ApplicantEmploymentCard = ({ applicant, index, onUpdateApplicant }: ApplicantEmploymentCardProps) => {
  return (
    <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
      <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg">
            <User className="h-5 w-5" />
          </div>
          Applicant {index + 1}
          {applicant.firstName && applicant.lastName && (
            <span className="text-white font-normal">
              - {applicant.firstName} {applicant.lastName}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <EmploymentFields 
          applicant={applicant}
          onUpdateApplicant={onUpdateApplicant}
        />
      </CardContent>
    </Card>
  );
};

export default ApplicantEmploymentCard;
