
export const highlightInvalidField = (elementId: string, shouldScroll: boolean = true) => {
  // Try multiple selectors to find the element
  let element = document.getElementById(elementId) || 
                document.querySelector(`[name="${elementId}"]`) ||
                document.querySelector(`input[id="${elementId}"]`) ||
                document.querySelector(`select[id="${elementId}"]`) ||
                document.querySelector(`textarea[id="${elementId}"]`);
  
  if (!element) {
    console.log(`Element not found for ID: ${elementId}`);
    return;
  }

  console.log(`Highlighting field: ${elementId}`);
  
  // Add red border classes with transition - using !important to override existing styles
  element.style.border = '2px solid #ef4444 !important';
  element.style.transition = 'all 0.3s ease';
  element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
  
  // Only scroll to the first element
  if (shouldScroll) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // Remove the red border after 2 seconds with fade effect
  setTimeout(() => {
    element.style.border = '';
    element.style.boxShadow = '';
    // Remove transition after animation completes
    setTimeout(() => {
      element.style.transition = '';
    }, 300);
  }, 2000);
};

export const validateAndHighlightFields = (
  step: number,
  applicants: any[],
  propertyPreferences: any,
  additionalDetails: any,
  signature: string,
  termsAccepted: boolean,
  fullName?: string
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
        if (!applicant.firstName) invalidFields.push(`firstName-${applicant.id}`);
        if (!applicant.lastName) invalidFields.push(`lastName-${applicant.id}`);
        if (!applicant.email) invalidFields.push(`email-${applicant.id}`);
        if (!applicant.phone) invalidFields.push(`phone-${applicant.id}`);
      });
      break;
    
    case 3:
      applicants.forEach((applicant, index) => {
        if (!applicant.employment) invalidFields.push(`employment-${applicant.id}`);
        if (!applicant.annualIncome) invalidFields.push(`annualIncome-${applicant.id}`);
      });
      break;
    
    case 4:
      applicants.forEach((applicant, index) => {
        if (!applicant.previousAddress) invalidFields.push(`previousAddress-${applicant.id}`);
        if (!applicant.previousPostcode) invalidFields.push(`previousPostcode-${applicant.id}`);
        if (!applicant.currentPropertyStatus) invalidFields.push(`currentPropertyStatus-${applicant.id}`);
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
      if (!fullName?.trim()) invalidFields.push('fullName');
      break;
  }

  return invalidFields;
};

export const handleValidationErrors = (invalidFields: string[]) => {
  if (invalidFields.length === 0) return;

  console.log('Invalid fields:', invalidFields);

  // Immediately scroll to and highlight the first invalid field
  highlightInvalidField(invalidFields[0], true);

  // After 0.5 seconds, highlight all other invalid fields (without scrolling)
  if (invalidFields.length > 1) {
    setTimeout(() => {
      invalidFields.slice(1).forEach(fieldId => {
        highlightInvalidField(fieldId, false);
      });
    }, 500);
  }
};
