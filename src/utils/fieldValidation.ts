
export const highlightInvalidField = (elementId: string) => {
  const element = document.getElementById(elementId) || document.querySelector(`[name="${elementId}"]`);
  if (!element) return;

  // Add red border class
  element.classList.add('border-red-500', 'border-2');
  
  // Scroll to the element
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Remove the red border after 3 seconds
  setTimeout(() => {
    element.classList.remove('border-red-500', 'border-2');
  }, 3000);
};

export const validateAndHighlightFields = (
  step: number,
  applicants: any[],
  propertyPreferences: any,
  additionalDetails: any,
  signature: string,
  termsAccepted: boolean
): string[] => {
  const invalidFields: string[] = [];

  switch (step) {
    case 1:
      if (!propertyPreferences.streetAddress) invalidFields.push('streetAddress');
      if (!propertyPreferences.postcode) invalidFields.push('postcode');
      if (!propertyPreferences.maxRent) invalidFields.push('maxRent');
      if (!propertyPreferences.moveInDate) invalidFields.push('moveInDate');
      if (!propertyPreferences.initialTenancyTerm) invalidFields.push('initialTenancyTerm');
      break;
    
    case 2:
      applicants.forEach((applicant, index) => {
        if (!applicant.firstName) invalidFields.push(`firstName-${index}`);
        if (!applicant.lastName) invalidFields.push(`lastName-${index}`);
        if (!applicant.email) invalidFields.push(`email-${index}`);
        if (!applicant.phone) invalidFields.push(`phone-${index}`);
      });
      break;
    
    case 3:
      applicants.forEach((applicant, index) => {
        if (!applicant.employment) invalidFields.push(`employment-${index}`);
        if (!applicant.annualIncome) invalidFields.push(`annualIncome-${index}`);
      });
      break;
    
    case 4:
      applicants.forEach((applicant, index) => {
        if (!applicant.previousAddress) invalidFields.push(`previousAddress-${index}`);
        if (!applicant.previousPostcode) invalidFields.push(`previousPostcode-${index}`);
        if (!applicant.currentPropertyStatus) invalidFields.push(`currentPropertyStatus-${index}`);
      });
      break;
    
    case 5:
      if (!additionalDetails.ukPassport) invalidFields.push('ukPassport');
      if (!additionalDetails.adverseCredit) invalidFields.push('adverseCredit');
      if (!additionalDetails.guarantorRequired) invalidFields.push('guarantorRequired');
      if (!additionalDetails.pets) invalidFields.push('pets');
      if (additionalDetails.under18Count === "") invalidFields.push('under18Count');
      if (!additionalDetails.depositType) invalidFields.push('depositType');
      break;
    
    case 6:
      if (!termsAccepted) invalidFields.push('terms');
      if (!signature.trim()) invalidFields.push('signature');
      break;
  }

  return invalidFields;
};
