
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

  console.log(`Validating step ${step}`, { applicants, propertyPreferences, additionalDetails });

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
        if (!applicant.dateOfBirth) invalidFields.push(`dob-${applicant.id}`);
      });
      break;
    
    case 3:
      applicants.forEach((applicant, index) => {
        if (!applicant.employmentStatus) invalidFields.push(`employmentStatus-${applicant.id}`);
        if (!applicant.annualIncome) invalidFields.push(`annualIncome-${applicant.id}`);
        
        // Only require employment details for employed statuses that need them
        const requiresEmploymentDetails = applicant.employmentStatus && 
            applicant.employmentStatus !== "unemployed" && 
            applicant.employmentStatus !== "student" && 
            applicant.employmentStatus !== "retired" && 
            applicant.employmentStatus !== "other";
            
        if (requiresEmploymentDetails) {
          if (!applicant.companyName) invalidFields.push(`companyName-${applicant.id}`);
          if (!applicant.jobTitle) invalidFields.push(`jobTitle-${applicant.id}`);
          if (!applicant.lengthOfService) invalidFields.push(`lengthOfService-${applicant.id}`);
        }
      });
      break;
    
    case 4:
      applicants.forEach((applicant, index) => {
        if (!applicant.currentAddress) invalidFields.push(`currentAddress-${applicant.id}`);
        if (!applicant.currentPostcode) invalidFields.push(`currentPostcode-${applicant.id}`);
        if (!applicant.residencyStatus) invalidFields.push(`residencyStatus-${applicant.id}`);
        if (!applicant.moveInDate) invalidFields.push(`moveInDate-${applicant.id}`);
        if (!applicant.vacateDate) invalidFields.push(`vacateDate-${applicant.id}`);
      });
      break;
    
    case 5:
      if (additionalDetails.pets === undefined || additionalDetails.pets === null) invalidFields.push('pets');
      if (additionalDetails.children === undefined || additionalDetails.children === null) invalidFields.push('children');
      if (additionalDetails.children && !additionalDetails.childrenDetails) invalidFields.push('childrenDetails');
      if (additionalDetails.pets && !additionalDetails.petDetails) invalidFields.push('petDetails');
      break;
    
    case 6:
      if (!termsAccepted) invalidFields.push('terms');
      if (!signature.trim()) invalidFields.push('signature');
      if (!fullName?.trim()) invalidFields.push('fullName');
      break;
  }

  console.log(`Step ${step} validation result:`, invalidFields);
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
