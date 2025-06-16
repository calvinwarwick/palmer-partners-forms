
import { UseFormReturn } from "react-hook-form";
import { ApplicationFormData } from "@/schemas/applicationSchemas";
import { createEmptyApplicant } from "@/utils/rhfFormHelpers";

export const useRHFApplicants = (form: UseFormReturn<ApplicationFormData>) => {
  const addApplicant = () => {
    const currentApplicants = form.getValues("personalInfo.applicants");
    if (currentApplicants.length < 5) {
      const newId = Date.now().toString();
      const newApplicant = createEmptyApplicant(newId);
      
      form.setValue("personalInfo.applicants", [...currentApplicants, newApplicant]);
      form.setValue("employment.applicants", [...form.getValues("employment.applicants"), createEmptyApplicant(newId)]);
      form.setValue("currentAddress.applicants", [...form.getValues("currentAddress.applicants"), createEmptyApplicant(newId)]);
    }
  };

  const removeApplicant = (index: number) => {
    const currentApplicants = form.getValues("personalInfo.applicants");
    if (currentApplicants.length > 1) {
      const updatedApplicants = currentApplicants.filter((_, i) => i !== index);
      
      form.setValue("personalInfo.applicants", updatedApplicants);
      form.setValue("employment.applicants", form.getValues("employment.applicants").filter((_, i) => i !== index));
      form.setValue("currentAddress.applicants", form.getValues("currentAddress.applicants").filter((_, i) => i !== index));
    }
  };

  const handleApplicantCountChange = (count: number) => {
    const currentCount = form.getValues("personalInfo.applicants").length;
    
    if (count > currentCount) {
      const newApplicants = [];
      const newEmploymentApplicants = [];
      const newAddressApplicants = [];
      
      for (let i = currentCount; i < count; i++) {
        const newId = (Date.now() + i).toString();
        newApplicants.push(createEmptyApplicant(newId));
        newEmploymentApplicants.push(createEmptyApplicant(newId));
        newAddressApplicants.push(createEmptyApplicant(newId));
      }
      
      form.setValue("personalInfo.applicants", [...form.getValues("personalInfo.applicants"), ...newApplicants]);
      form.setValue("employment.applicants", [...form.getValues("employment.applicants"), ...newEmploymentApplicants]);
      form.setValue("currentAddress.applicants", [...form.getValues("currentAddress.applicants"), ...newAddressApplicants]);
    } else if (count < currentCount) {
      form.setValue("personalInfo.applicants", form.getValues("personalInfo.applicants").slice(0, count));
      form.setValue("employment.applicants", form.getValues("employment.applicants").slice(0, count));
      form.setValue("currentAddress.applicants", form.getValues("currentAddress.applicants").slice(0, count));
    }
  };

  return {
    addApplicant,
    removeApplicant,
    handleApplicantCountChange
  };
};
