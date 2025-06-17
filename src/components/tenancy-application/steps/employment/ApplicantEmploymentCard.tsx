
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";
import EmploymentFields from "./EmploymentFields";

interface ApplicantEmploymentCardProps {
  applicant: Applicant;
  index: number;
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const ApplicantEmploymentCard = ({
  applicant,
  index,
  onUpdateApplicant
}: ApplicantEmploymentCardProps) => {
  return (
    <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30 rounded-xl" style={{
      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'
    }}>
      <CardHeader className="pb-4 bg-orange-500 text-white rounded-t-xl">
        <CardTitle className="font-semibold flex items-center gap-3 text-white text-lg">
          <div className="p-2 bg-white/20 rounded-xl">
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
        <EmploymentFields applicant={applicant} onUpdateApplicant={onUpdateApplicant} />
      </CardContent>
    </Card>
  );
};

export default ApplicantEmploymentCard;
