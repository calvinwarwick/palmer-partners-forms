
import { Applicant } from "@/domain/types/Applicant";
import { FieldPath } from "react-hook-form";
import { ApplicationFormData } from "@/schemas/applicationSchemas";

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

export const getStepFields = (step: number): FieldPath<ApplicationFormData>[] => {
  switch (step) {
    case 1:
      return ["propertyPreferences"] as FieldPath<ApplicationFormData>[];
    case 2:
      return ["personalInfo"] as FieldPath<ApplicationFormData>[];
    case 3:
      return ["employment"] as FieldPath<ApplicationFormData>[];
    case 4:
      return ["currentAddress"] as FieldPath<ApplicationFormData>[];
    case 5:
      return ["additionalDetails"] as FieldPath<ApplicationFormData>[];
    case 6:
      return ["termsAndData"] as FieldPath<ApplicationFormData>[];
    default:
      return [];
  }
};
