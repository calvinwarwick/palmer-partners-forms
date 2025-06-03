
import { Applicant } from "@/domain/types/Applicant";
import ApplicantEmploymentCard from "./employment/ApplicantEmploymentCard";

interface EmploymentStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const EmploymentStep = ({ applicants, onUpdateApplicant }: EmploymentStepProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Employment Information</h3>
        <p className="text-light-grey mb-4">Tell us about your employment situation</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>
      
      {applicants.map((applicant, index) => (
        <ApplicantEmploymentCard
          key={applicant.id}
          applicant={applicant}
          index={index}
          onUpdateApplicant={onUpdateApplicant}
        />
      ))}
    </div>
  );
};

export default EmploymentStep;
