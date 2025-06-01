
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
  
  // Add red box shadow instead of border - using !important to override existing styles
  element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.3), 0 0 8px rgba(239, 68, 68, 0.2) !important';
  element.style.transition = 'all 0.3s ease';
  
  // Only scroll to the first element
  if (shouldScroll) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // Remove the red box shadow after 2 seconds with fade effect
  setTimeout(() => {
    element.style.boxShadow = '';
    // Remove transition after animation completes
    setTimeout(() => {
      element.style.transition = '';
    }, 300);
  }, 300);
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
        if (!applicant.employmentStatus) invalidFields.push(`employmentStatus-${applicant.id}`);
        if (!applicant.annualIncome) invalidFields.push(`annualIncome-${applicant.id}`);
      });
      break;
    
    case 4:
      applicants.forEach((applicant, index) => {
        if (!applicant.currentAddress) invalidFields.push(`currentAddress-${applicant.id}`);
        if (!applicant.currentPostcode) invalidFields.push(`currentPostcode-${applicant.id}`);
        if (!applicant.residencyStatus) invalidFields.push(`residencyStatus-${applicant.id}`);
      });
      break;
    
    case 5:
      if (!additionalDetails.moveInDate) invalidFields.push('moveInDate');
      if (!additionalDetails.tenancyLength) invalidFields.push('tenancyLength');
      if (!additionalDetails.householdIncome) invalidFields.push('householdIncome');
      if (additionalDetails.pets === undefined) invalidFields.push('pets');
      if (additionalDetails.smoking === undefined) invalidFields.push('smoking');
      if (additionalDetails.parking === undefined) invalidFields.push('parking');
      if (additionalDetails.children === undefined) invalidFields.push('children');
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
