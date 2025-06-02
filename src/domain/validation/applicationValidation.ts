
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
    case 1: // Property Details
      return !!(
        preferences.streetAddress &&
        preferences.postcode &&
        preferences.maxRent &&
        preferences.moveInDate &&
        preferences.latestMoveInDate &&
        preferences.initialTenancyTerm
      );
    
    case 2: // Personal Info
      return applicants.length > 0 && applicants.every(applicant => 
        applicant.firstName &&
        applicant.lastName &&
        applicant.dateOfBirth &&
        applicant.email &&
        applicant.phone
      );
    
    case 3: // Employment
      return applicants.every(applicant => 
        applicant.employment &&
        applicant.companyName &&
        applicant.jobTitle &&
        applicant.annualIncome &&
        applicant.lengthOfService
      );
    
    case 4: // Current Address
      return applicants.every(applicant => 
        applicant.currentAddress &&
        applicant.currentPostcode &&
        applicant.moveInDate &&
        applicant.vacateDate &&
        applicant.currentPropertyStatus &&
        applicant.currentRentalAmount
      );
    
    case 5: // Additional Details
      // Check if pets field is defined (should be boolean)
      const petsValid = typeof additionalDetails.pets === 'boolean';
      
      // Check if children details are valid
      const childrenValid = !additionalDetails.children || 
        (additionalDetails.children && additionalDetails.childrenDetails);
      
      // Convert pets to boolean for validation - handle both string and boolean types
      const hasPets = additionalDetails.pets === true || additionalDetails.pets === 'true';
      
      // Check if pet details are provided when pets are selected
      const petDetailsValid = !hasPets || 
        (hasPets && additionalDetails.petDetails);
      
      return petsValid && childrenValid && petDetailsValid;
    
    case 6: // Terms and Data
      return !!(termsAccepted && signature);
    
    default:
      return false;
  }
};

export const getStepErrors = (
  step: number,
  applicants: Applicant[],
  preferences: PropertyPreferences,
  additionalDetails: AdditionalDetails,
  signature: string,
  termsAccepted: boolean
): string[] => {
  const errors: string[] = [];
  
  switch (step) {
    case 1:
      if (!preferences.streetAddress) errors.push('Street address is required');
      if (!preferences.postcode) errors.push('Postcode is required');
      if (!preferences.maxRent) errors.push('Maximum rent is required');
      if (!preferences.moveInDate) errors.push('Move-in date is required');
      if (!preferences.latestMoveInDate) errors.push('Latest move-in date is required');
      if (!preferences.initialTenancyTerm) errors.push('Initial tenancy term is required');
      break;
      
    case 2:
      if (applicants.length === 0) {
        errors.push('At least one applicant is required');
      } else {
        applicants.forEach((applicant, index) => {
          if (!applicant.firstName) errors.push(`Applicant ${index + 1}: First name is required`);
          if (!applicant.lastName) errors.push(`Applicant ${index + 1}: Last name is required`);
          if (!applicant.dateOfBirth) errors.push(`Applicant ${index + 1}: Date of birth is required`);
          if (!applicant.email) errors.push(`Applicant ${index + 1}: Email is required`);
          if (!applicant.phone) errors.push(`Applicant ${index + 1}: Phone is required`);
        });
      }
      break;
      
    case 3:
      applicants.forEach((applicant, index) => {
        if (!applicant.employment) errors.push(`Applicant ${index + 1}: Employment status is required`);
        if (!applicant.companyName) errors.push(`Applicant ${index + 1}: Company name is required`);
        if (!applicant.jobTitle) errors.push(`Applicant ${index + 1}: Job title is required`);
        if (!applicant.annualIncome) errors.push(`Applicant ${index + 1}: Annual income is required`);
        if (!applicant.lengthOfService) errors.push(`Applicant ${index + 1}: Length of service is required`);
      });
      break;
      
    case 4:
      applicants.forEach((applicant, index) => {
        if (!applicant.currentAddress) errors.push(`Applicant ${index + 1}: Current address is required`);
        if (!applicant.currentPostcode) errors.push(`Applicant ${index + 1}: Current postcode is required`);
        if (!applicant.moveInDate) errors.push(`Applicant ${index + 1}: Move-in date is required`);
        if (!applicant.vacateDate) errors.push(`Applicant ${index + 1}: Vacate date is required`);
        if (!applicant.currentPropertyStatus) errors.push(`Applicant ${index + 1}: Property status is required`);
        if (!applicant.currentRentalAmount) errors.push(`Applicant ${index + 1}: Current rental amount is required`);
      });
      break;
      
    case 5:
      if (typeof additionalDetails.pets !== 'boolean') errors.push('Please specify if you have pets');
      if (additionalDetails.children && !additionalDetails.childrenDetails) {
        errors.push('Please provide details about children');
      }
      // Convert to boolean for validation - handle both string and boolean types
      const hasPets = additionalDetails.pets === true || additionalDetails.pets === 'true';
      if (hasPets && !additionalDetails.petDetails) {
        errors.push('Please provide pet details');
      }
      break;
      
    case 6:
      if (!termsAccepted) errors.push('You must accept the terms and conditions');
      if (!signature) errors.push('Signature is required');
      break;
  }
  
  return errors;
};
