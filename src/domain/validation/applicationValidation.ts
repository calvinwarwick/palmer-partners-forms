
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
      const petsValid = additionalDetails.pets !== undefined && additionalDetails.pets !== null;
      const childrenValid = additionalDetails.children !== undefined && additionalDetails.children !== null;
      const petDetailsValid = !additionalDetails.pets || additionalDetails.petDetails;
      const childrenDetailsValid = !additionalDetails.children || additionalDetails.childrenDetails;
      
      return petsValid && childrenValid && petDetailsValid && childrenDetailsValid;
    
    case 6:
      return termsAccepted && signature.trim() !== '';
    
    default:
      return false;
  }
};
