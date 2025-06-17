
import { Applicant, PropertyPreferences, AdditionalDetails } from '../types/Applicant';

export const validateStep = (
  step: number,
  applicants: Applicant[], 
  preferences: PropertyPreferences, 
  additionalDetails: AdditionalDetails,
  signature: string,
  termsAccepted: boolean
): boolean => {
  switch (step) {
    case 1:
      return Boolean(
        preferences.streetAddress &&
        preferences.postcode &&
        preferences.maxRent &&
        preferences.moveInDate &&
        preferences.initialTenancyTerm
      );
    
    case 2:
      return applicants.every(applicant => 
        applicant.firstName &&
        applicant.lastName &&
        applicant.email &&
        applicant.phone &&
        applicant.dateOfBirth
      );
    
    case 3:
      return applicants.every(applicant => 
        applicant.employmentStatus
      );
    
    case 4:
      return applicants.every(applicant => {
        const basicFieldsValid = Boolean(
          applicant.currentAddress &&
          applicant.currentPostcode &&
          applicant.currentPropertyStatus &&
          applicant.moveInDate &&
          applicant.vacateDate
        );

        // Check if rental amount is required based on property status
        const shouldShowRentalAmount = applicant.currentPropertyStatus === "rented-privately" || 
                                     applicant.currentPropertyStatus === "rented-through-agent";
        
        const rentalAmountValid = !shouldShowRentalAmount || Boolean(applicant.currentRentalAmount);

        return basicFieldsValid && rentalAmountValid;
      });
    
    case 5:
      // Helper function to normalize "yes"/"no" string and boolean values
      const isYes = (value: unknown): boolean =>
        value === true || value === "yes";

      const hasPets = isYes(additionalDetails.pets);
      const hasChildren = isYes(additionalDetails.children);

      const petsValid = additionalDetails.pets !== undefined && additionalDetails.pets !== null;
      const childrenValid = additionalDetails.children !== undefined && additionalDetails.children !== null;

      const petDetailsValid = !hasPets || Boolean(additionalDetails.petDetails?.trim());
      const childrenDetailsValid = !hasChildren || Boolean(additionalDetails.childrenDetails?.trim());

      return petsValid && childrenValid && petDetailsValid && childrenDetailsValid;
    
    case 6:
      return termsAccepted && signature.trim() !== '';
    
    default:
      return false;
  }
};
