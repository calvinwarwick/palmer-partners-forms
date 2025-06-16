
import { Applicant } from "@/domain/types/Applicant";

export const createEmptyApplicant = (id: string): Partial<Applicant> => ({
  id,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  employmentStatus: "",
  currentAddress: "",
  currentPostcode: "",
  residencyStatus: "",
  moveInDate: "",
  vacateDate: ""
});

export const getStepFields = (step: number) => {
  switch (step) {
    case 1:
      return ["propertyPreferences"];
    case 2:
      return ["personalInfo"];
    case 3:
      return ["employment"];
    case 4:
      return ["currentAddress"];
    case 5:
      return ["additionalDetails"];
    case 6:
      return ["termsAndData"];
    default:
      return [];
  }
};
