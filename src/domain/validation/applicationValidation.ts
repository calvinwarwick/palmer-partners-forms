

import { Applicant, PropertyPreferences, AdditionalDetails } from '../types/Applicant';

export const validatePropertyDetails = (preferences: PropertyPreferences): boolean => {
  console.log('Validating property details:', preferences);
  const isValid = !!(preferences.streetAddress && preferences.postcode && preferences.maxRent && preferences.moveInDate && preferences.initialTenancyTerm);
  console.log('Property details validation result:', isValid);
  return isValid;
};

export const validatePersonalInfo = (applicants: Applicant[]): boolean => {
  console.log('Validating personal info for', applicants.length, 'applicants');
  const isValid = applicants.every(applicant => {
    const valid = applicant.firstName && applicant.lastName && applicant.email && applicant.phone;
    console.log(`Applicant ${applicant.id} personal info valid:`, valid, {
      firstName: !!applicant.firstName,
      lastName: !!applicant.lastName,
      email: !!applicant.email,
      phone: !!applicant.phone
    });
    return valid;
  });
  console.log('Personal info validation result:', isValid);
  return isValid;
};

export const validateEmploymentInfo = (applicants: Applicant[]): boolean => {
  console.log('Validating employment info for', applicants.length, 'applicants');
  const isValid = applicants.every(applicant => {
    const valid = applicant.employmentStatus && applicant.annualIncome;
    console.log(`Applicant ${applicant.id} employment info valid:`, valid, {
      employmentStatus: !!applicant.employmentStatus,
      annualIncome: !!applicant.annualIncome
    });
    return valid;
  });
  console.log('Employment info validation result:', isValid);
  return isValid;
};

export const validateCurrentAddress = (applicants: Applicant[]): boolean => {
  console.log('Validating current address for', applicants.length, 'applicants');
  const isValid = applicants.every(applicant => {
    const valid = applicant.currentAddress && applicant.currentPostcode && applicant.residencyStatus;
    console.log(`Applicant ${applicant.id} current address valid:`, valid, {
      currentAddress: !!applicant.currentAddress,
      currentPostcode: !!applicant.currentPostcode,
      residencyStatus: !!applicant.residencyStatus
    });
    return valid;
  });
  console.log('Current address validation result:', isValid);
  return isValid;
};

export const validateAdditionalDetails = (additionalDetails: AdditionalDetails): boolean => {
  console.log('Validating additional details:', additionalDetails);
  
  // Check the actual fields that exist in the AdditionalDetails interface
  const isValid = !!(
    additionalDetails.moveInDate && 
    additionalDetails.tenancyLength && 
    additionalDetails.householdIncome &&
    (additionalDetails.pets !== undefined && additionalDetails.pets !== null) &&
    (additionalDetails.smoking !== undefined && additionalDetails.smoking !== null) &&
    (additionalDetails.parking !== undefined && additionalDetails.parking !== null) &&
    (additionalDetails.children !== undefined && additionalDetails.children !== null)
  );
  
  console.log('Additional details validation breakdown:', {
    moveInDate: !!additionalDetails.moveInDate,
    tenancyLength: !!additionalDetails.tenancyLength,
    householdIncome: !!additionalDetails.householdIncome,
    pets: additionalDetails.pets !== undefined && additionalDetails.pets !== null,
    smoking: additionalDetails.smoking !== undefined && additionalDetails.smoking !== null,
    parking: additionalDetails.parking !== undefined && additionalDetails.parking !== null,
    children: additionalDetails.children !== undefined && additionalDetails.children !== null
  });
  
  console.log('Additional details validation result:', isValid);
  return isValid;
};

export const validateTermsAndSignature = (signature: string, termsAccepted: boolean): boolean => {
  console.log('Validating terms and signature:', { signatureLength: signature.length, termsAccepted });
  const isValid = signature.length > 0 && termsAccepted;
  console.log('Terms and signature validation result:', isValid);
  return isValid;
};

export const validateStep = (
  step: number, 
  applicants: Applicant[], 
  preferences: PropertyPreferences, 
  additionalDetails: AdditionalDetails,
  signature: string,
  termsAccepted: boolean
): boolean => {
  console.log(`Validating step ${step}`);
  
  let result = false;
  switch (step) {
    case 1:
      result = validatePropertyDetails(preferences);
      break;
    case 2:
      result = validatePersonalInfo(applicants);
      break;
    case 3:
      result = validateEmploymentInfo(applicants);
      break;
    case 4:
      result = validateCurrentAddress(applicants);
      break;
    case 5:
      result = validateAdditionalDetails(additionalDetails);
      break;
    case 6:
      result = termsAccepted && signature.trim() !== '';
      break;
    default:
      result = false;
  }
  
  console.log(`Step ${step} validation final result:`, result);
  return result;
};

