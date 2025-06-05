
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
      return applicants.every(applicant => 
        applicant.currentAddress &&
        applicant.currentPostcode &&
        applicant.residencyStatus &&
        applicant.moveInDate &&
        applicant.vacateDate
      );
    
    case 5:
      // Check if pets and children fields have been set (not undefined)
      const petsValid = typeof additionalDetails.pets === 'boolean';
      const childrenValid = typeof additionalDetails.children === 'boolean';
      
      // Convert to boolean for validation checks
      const hasPets = Boolean(additionalDetails.pets);
      const hasChildren = Boolean(additionalDetails.children);
      
      const petDetailsValid = !hasPets || additionalDetails.petDetails;
      const childrenDetailsValid = !hasChildren || additionalDetails.childrenDetails;
      
      return petsValid && childrenValid && petDetailsValid && childrenDetailsValid;
    
    case 6:
      return termsAccepted && signature.trim() !== '';
    
    default:
      return false;
  }
};
