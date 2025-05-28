
import { Applicant, PropertyPreferences, AdditionalDetails } from '../types/Applicant';

export const validatePropertyDetails = (preferences: PropertyPreferences): boolean => {
  return !!(preferences.streetAddress && preferences.postcode && preferences.maxRent && preferences.moveInDate && preferences.initialTenancyTerm);
};

export const validatePersonalInfo = (applicants: Applicant[]): boolean => {
  return applicants.every(applicant => 
    applicant.firstName && 
    applicant.lastName && 
    applicant.email && 
    applicant.phone
  );
};

export const validateEmploymentInfo = (applicants: Applicant[]): boolean => {
  return applicants.every(applicant => 
    applicant.employment && 
    applicant.annualIncome
  );
};

export const validateCurrentAddress = (applicants: Applicant[]): boolean => {
  return applicants.every(applicant => 
    applicant.previousAddress && 
    applicant.previousPostcode && 
    applicant.currentPropertyStatus
  );
};

export const validateAdditionalDetails = (additionalDetails: AdditionalDetails): boolean => {
  return !!(
    additionalDetails.ukPassport && 
    additionalDetails.adverseCredit && 
    additionalDetails.guarantorRequired && 
    additionalDetails.pets && 
    additionalDetails.under18Count !== "" &&
    additionalDetails.depositType
  );
};

export const validateTermsAndSignature = (signature: string, termsAccepted: boolean): boolean => {
  return signature.length > 0 && termsAccepted;
};

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
      return validatePropertyDetails(preferences);
    case 2:
      return validatePersonalInfo(applicants);
    case 3:
      return validateEmploymentInfo(applicants);
    case 4:
      return validateCurrentAddress(applicants);
    case 5:
      return validateAdditionalDetails(additionalDetails);
    case 6:
      return validateTermsAndSignature(signature, termsAccepted);
    default:
      return false;
  }
};
