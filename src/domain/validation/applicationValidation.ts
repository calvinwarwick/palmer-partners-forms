
import { Applicant, PropertyPreferences } from '../types/Applicant';

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

export const validatePropertyPreferences = (preferences: PropertyPreferences): boolean => {
  return !!(preferences.propertyType && preferences.maxRent);
};

export const validateSignature = (signature: string): boolean => {
  return signature.length > 0;
};

export const validateStep = (step: number, applicants: Applicant[], preferences: PropertyPreferences, signature: string): boolean => {
  switch (step) {
    case 1:
      return validatePersonalInfo(applicants);
    case 2:
      return validateEmploymentInfo(applicants);
    case 3:
      return validatePropertyPreferences(preferences);
    case 4:
      return validateSignature(signature);
    default:
      return false;
  }
};
