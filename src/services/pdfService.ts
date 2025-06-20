import jsPDF from 'jspdf';
import { Applicant, PropertyPreferences, AdditionalDetails } from '@/domain/types/Applicant';

export const generateApplicationPDF = async (data: {
  applicants: Applicant[];
  propertyPreferences: PropertyPreferences;
  additionalDetails: AdditionalDetails;
  dataSharing: { utilities: boolean; insurance: boolean };
  signature: string;
  submittedAt?: string;
  applicationId?: string;
}): Promise<Uint8Array> => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Helper function to check if we need a new page
  const checkPageBreak = (currentY: number, lineHeight: number = 10) => {
    if (currentY > 270) {
      doc.addPage();
      return 20;
    }
    return currentY;
  };

  // Header with logo placeholder - maintaining aspect ratio
  const headerHeight = 25;
  doc.setFillColor(33, 33, 33); // #212121 dark grey
  doc.rect(0, 0, 210, headerHeight, 'F');

  // Logo placeholder (white rectangle with text) - centered with proper aspect ratio
  const logoWidth = 50;
  const logoHeight = 12;
  doc.setFillColor(255, 255, 255);
  doc.rect((210 - logoWidth) / 2, 6.5, logoWidth, logoHeight, 'F');
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Palmer & Partners', 105, 14, { align: 'center' });

  // Orange bottom border
  doc.setFillColor(255, 111, 0); // #FF6F00 orange
  doc.rect(0, headerHeight, 210, 2, 'F');

  yPosition = headerHeight + 15;

  // Main title - matching the demo
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Tenancy Application', 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Helper function to add section header - matching the demo exactly
  const addSectionHeader = (title: string, currentY: number) => {
    const y = checkPageBreak(currentY + 10);
    
    doc.setFillColor(33, 33, 33);
    doc.rect(20, y - 5, 170, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, y + 4, { align: 'center' });
    
    return y + 10;
  };

  // Helper function for subsection headers
  const addSubsectionHeader = (title: string, currentY: number) => {
    const y = checkPageBreak(currentY);
    
    doc.setFillColor(200, 200, 200);
    doc.rect(20, y, 170, 12, 'F');
    doc.setDrawColor(150, 150, 150);
    doc.rect(20, y, 170, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 105, y + 7, { align: 'center' });
    
    return y + 12;
  };

  // Helper function for data rows - matching the demo exactly
  const addDataRow = (label: string, value: string, currentY: number) => {
    const y = checkPageBreak(currentY);
    
    const labelWidth = 170 * 0.35;
    const valueWidth = 170 * 0.65;
    const rowHeight = 12;
    
    // Label column - matching the demo
    doc.setFillColor(243, 244, 246);
    doc.rect(20, y, labelWidth, rowHeight, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.5);
    doc.rect(20, y, labelWidth, rowHeight);
    
    // Value column - matching the demo
    doc.setFillColor(255, 255, 255);
    doc.rect(20 + labelWidth, y, valueWidth, rowHeight, 'F');
    doc.rect(20 + labelWidth, y, valueWidth, rowHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(label, 25, y + 7);
    
    doc.setFont('helvetica', 'normal');
    doc.text(value || '-', 25 + labelWidth, y + 7);
    
    return y + rowHeight;
  };

  // Helper function to format dates - matching the demo exactly
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'long' });
      const year = date.getFullYear();
      
      const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    } catch {
      return dateString;
    }
  };

  // Property Details Section - matching the demo exactly
  yPosition = addSectionHeader('Property Details', yPosition);
  yPosition = addDataRow('Street Address', data.propertyPreferences?.streetAddress || '', yPosition);
  yPosition = addDataRow('Postcode', data.propertyPreferences?.postcode || '', yPosition);
  yPosition = addDataRow('Rental Amount', data.propertyPreferences?.maxRent ? `£${data.propertyPreferences.maxRent}` : '', yPosition);
  yPosition = addDataRow('Preferred Move-in Date', formatDate(data.propertyPreferences?.moveInDate || ''), yPosition);
  yPosition = addDataRow('Latest Move-in Date', formatDate(data.propertyPreferences?.latestMoveInDate || ''), yPosition);
  yPosition = addDataRow('Initial Tenancy Term', data.propertyPreferences?.initialTenancyTerm || '', yPosition);
  yPosition = addDataRow('Has Pets', data.additionalDetails?.pets ? 'Yes' : 'No', yPosition);
  yPosition = addDataRow('Under 18s', data.additionalDetails?.under18Count || '0', yPosition);
  if (data.additionalDetails?.under18Count && parseInt(data.additionalDetails.under18Count) > 0 && data.additionalDetails?.childrenAges) {
    yPosition = addDataRow('Under 18s Details', data.additionalDetails.childrenAges, yPosition);
  }
  yPosition = addDataRow('Additional Requests', data.additionalDetails?.additionalRequests || '', yPosition);
  yPosition = addDataRow('Deposit Type', data.additionalDetails?.depositType || '', yPosition);

  // Applicants Section - matching the demo exactly
  data.applicants.forEach((applicant, index) => {
    yPosition = addSectionHeader(`Applicant - #${index + 1}`, yPosition);
    
    // Personal Details
    yPosition = addDataRow('First Name', applicant.firstName || '', yPosition);
    yPosition = addDataRow('Last Name', applicant.lastName || '', yPosition);
    yPosition = addDataRow('Date of Birth', formatDate(applicant.dateOfBirth || ''), yPosition);
    yPosition = addDataRow('Email Address', applicant.email || '', yPosition);
    yPosition = addDataRow('Mobile Number', applicant.phone || '', yPosition);

    // Employment Details
    yPosition = addSubsectionHeader('Employment Details', yPosition);
    yPosition = addDataRow('Contract Type', applicant.employment || '', yPosition);
    yPosition = addDataRow('Company Name', applicant.companyName || '', yPosition);
    yPosition = addDataRow('Job Title', applicant.jobTitle || '', yPosition);
    yPosition = addDataRow('Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '', yPosition);
    yPosition = addDataRow('Length of Service', applicant.lengthOfService || '', yPosition);

    // Current Property Details
    yPosition = addSubsectionHeader('Current Property Details', yPosition);
    yPosition = addDataRow('Postcode', applicant.currentPostcode || applicant.previousPostcode || '', yPosition);
    yPosition = addDataRow('Street Address', applicant.currentAddress || applicant.previousAddress || '', yPosition);
    yPosition = addDataRow('Time at Address', applicant.timeAtAddress || 'N/A', yPosition);
    yPosition = addDataRow('Landlord Name', applicant.landlordName || 'N/A', yPosition);
    yPosition = addDataRow('Landlord Phone', applicant.landlordPhone || 'N/A', yPosition);
    yPosition = addDataRow('Rent Up to Date', applicant.rentUpToDate === 'yes' ? 'Yes' : 'No', yPosition);
    yPosition = addDataRow('Notice Period', applicant.noticePeriod || 'N/A', yPosition);
    yPosition = addDataRow('Current Property Status', applicant.currentPropertyStatus || '', yPosition);
    yPosition = addDataRow('Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '', yPosition);

    // Previous Property Details
    yPosition = addSubsectionHeader('Previous Property Details', yPosition);
    yPosition = addDataRow('Previous Address', applicant.previousAddress || '', yPosition);
    yPosition = addDataRow('Previous Postcode', applicant.previousPostcode || '', yPosition);
    yPosition = addDataRow('Move In Date', formatDate(applicant.moveInDate || ''), yPosition);
    yPosition = addDataRow('Vacate Date', formatDate(applicant.vacateDate || ''), yPosition);
    yPosition = addDataRow('Previous Landlord Name', applicant.previousLandlordName || 'N/A', yPosition);
    yPosition = addDataRow('Previous Landlord Phone', applicant.previousLandlordPhone || 'N/A', yPosition);

    // Additional Information
    yPosition = addSubsectionHeader('Additional Information', yPosition);
    yPosition = addDataRow('UK/ROI Passport', data.additionalDetails?.ukPassport === 'yes' ? 'Yes' : 'No', yPosition);
    yPosition = addDataRow('Adverse Credit', data.additionalDetails?.adverseCredit === 'yes' ? 'Yes' : 'No', yPosition);
    if (data.additionalDetails?.adverseCredit === 'yes' && data.additionalDetails?.adverseCreditDetails) {
      yPosition = addDataRow('Adverse Credit Details', data.additionalDetails.adverseCreditDetails, yPosition);
    }
    yPosition = addDataRow('Requires Guarantor', data.additionalDetails?.guarantorRequired === 'yes' ? 'Yes' : 'No', yPosition);
    if (data.additionalDetails?.pets && data.additionalDetails?.petDetails) {
      yPosition = addDataRow('Pet Details', data.additionalDetails.petDetails, yPosition);
    }

    // Guarantor Details - NEW SECTION
    if (applicant.guarantorAdded && applicant.guarantorName) {
      yPosition = addSubsectionHeader('Guarantor Details', yPosition);
      yPosition = addDataRow('Guarantor Name', applicant.guarantorName || '', yPosition);
      yPosition = addDataRow('Relationship', applicant.guarantorRelationship || '', yPosition);
    }
  });

  // Data Sharing Section - matching the demo exactly
  yPosition = addSectionHeader('Data Sharing', yPosition);
  yPosition = addDataRow('Accept Utilities', data.dataSharing?.utilities ? 'Yes' : 'No', yPosition);
  yPosition = addDataRow('Accept Insurance', data.dataSharing?.insurance ? 'Yes' : 'No', yPosition);

  // Signature Section - matching the demo exactly
  yPosition = addSectionHeader('Signature', yPosition);
  yPosition = addDataRow('Full Name', `${data.applicants[0]?.firstName || ''} ${data.applicants[0]?.lastName || ''}`, yPosition);
  
  // Signature row
  yPosition = checkPageBreak(yPosition);
  const labelWidth = 170 * 0.35;
  const valueWidth = 170 * 0.65;
  const signatureRowHeight = 25;
  
  // Signature label
  doc.setFillColor(243, 244, 246);
  doc.rect(20, yPosition, labelWidth, signatureRowHeight, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.rect(20, yPosition, labelWidth, signatureRowHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('Signature', 25, yPosition + 7);
  
  // Signature value
  doc.setFillColor(255, 255, 255);
  doc.rect(20 + labelWidth, yPosition, valueWidth, signatureRowHeight, 'F');
  doc.rect(20 + labelWidth, yPosition, valueWidth, signatureRowHeight);
  
  // Add signature if it exists
  if (data.signature && data.signature.startsWith('data:image/')) {
    try {
      const maxSignatureWidth = valueWidth - 10;
      const maxSignatureHeight = 15;
      doc.addImage(data.signature, 'PNG', 25 + labelWidth, yPosition + 5, maxSignatureWidth, maxSignatureHeight);
    } catch (error) {
      console.warn('Could not add signature image, using placeholder');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Digital Signature Applied', 25 + labelWidth + 5, yPosition + 14);
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(data.signature || 'Digital Signature Applied', 25 + labelWidth + 5, yPosition + 14);
  }
  
  yPosition += signatureRowHeight;
  
  // Submitted at
  const submittedDate = data.submittedAt ? new Date(data.submittedAt).toLocaleString() : new Date().toLocaleString();
  yPosition = addDataRow('Submitted At', submittedDate, yPosition);

  // Terms and Conditions Section - properly styled in table format
  yPosition = checkPageBreak(yPosition + 20);
  yPosition = addSectionHeader('Terms and Conditions', yPosition);
  
  // Create a table cell for terms and conditions
  const termsY = checkPageBreak(yPosition);
  const termsHeight = 180; // Increased height for better spacing
  
  // Terms cell background
  doc.setFillColor(255, 255, 255);
  doc.rect(20, termsY, 170, termsHeight, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.5);
  doc.rect(20, termsY, 170, termsHeight);
  
  const termsText = `By submitting this application, you agree to the following terms and conditions:

If your offer is accepted by the landlord of your chosen property, the "Holding Deposit" will become payable. Upon receipt of this payment Palmer & Partners will commence the referencing process. This is usually done via an online form sent to your email address. This form must be completed within 72 hours to avoid the failure of your tenancy application.

Important: all rent, and deposit must be paid in full and received by Palmer & Partners in cleared funds prior to the start of your tenancy.

Holding Deposit:
Upon acceptance of your application by the landlord of your chosen property, a holding deposit equal to 1 weeks' rent will be taken; this amount will be offset against the total deposit owed.

Referencing Information:
Before being able to advise our landlord to grant a tenancy by signing a tenancy agreement, Palmer & Partners will need to complete a full reference check on any proposed tenant named overleaf. We use an independent reference provider to carry out this service. A successful reference check is dependent on, but not limited to, the following criteria:

• Named tenants must a combined minimum UK based annual salary greater than 30 x monthly rent (excluding bonus/commission). Alternatively, if a tenant has UK based savings in excess of this sum and they have been in place for over 3 months, there are circumstances where this can be considered in lieu of income.
• If you are self-employed, you must have at least 2 completed tax years of accounts confirming average annual income greater than 30 x monthly rent.
• Any guarantor must earn in excess of 36 x monthly rent per year or have UK based savings in excess of this sum (these savings must have been in place for over 3 months).
• Named tenants must have no County Court Judgements (CCJ) or Bankruptcy and not be in an Individual Voluntary Arrangement (IVA) or similar agreement.
• A successful "previous landlord reference" where your previous landlord/agent must confirm that you have always paid your rent on time, kept the property in good order and that you are free to leave the tenancy.

Should a tenant or guarantor fail a credit check due to inaccurate or misleading information, fail to fill in the referencing forms within the stipulated time frame or withdraw from the application process for any reason, the above "Holding Deposit" is non-refundable. Should the landlord withdraw from the application process prior to the start date of the tenancy, any deposit or rent paid will be refunded to the tenant in full.

Change of Occupancy:
If the tenant wishes to change the identity of any tenant named on the current tenancy agreement, upon receipt of consent from the landlord, Palmer & Partners will draw up a new tenancy agreement to be signed by all parties. An administration charge of £50.00 + VAT (£60.00 Inc. VAT) will be charged for this service. Any new reference required will be charged at £50.00 + VAT (£60.00 Inc. VAT). Additionally, there will be a charge of £50.00 + VAT (£60.00 Inc. VAT) to re-register any Deposit in the new tenant's name(s).

Missed Appointments:
In the event that an appointment is missed by the tenant (e.g., where it has been arranged that a tenant will be present to allow a contractor to access the property), any charges levied to the landlord or agent by a third party for this missed appointment will be passed directly on to the tenant.

Consequences of Early Termination:
If the tenant wishes to terminate the tenancy prior to the end of a fixed term, upon receiving written permission from the landlord (such permission does not have to be granted), the tenant will remain liable for all rent, bills, charges and costs payable under the terms of the contract until the term expires of the property is re-let, whichever is earlier. Should the property be re-let during the fixed term, the tenant will also be responsible for any remarketing fees that have been or will be incurred by the landlord for finding a new tenant (usually a sum equal to one month's rent per year or part year of the tenancy remaining) as well as any costs incurred by the landlord in having to pay for additional referencing or obtaining a new Inventory/Schedule of Condition report. Furthermore, the tenant is responsible for any other reasonable costs (e.g., telephone lines, satellite television contracts, TV licensing, cleaning, administration fees, etc.) incurred until the end of the term or until when the property is re-let. For the avoidance of doubt, this clause shall not take effect if the tenant is operating a pre-agreed "break clause" contained in the contract.`;

  // Style the terms text with small font and proper line height
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7); // Smaller font size
  doc.setTextColor(0, 0, 0);
  
  const lines = doc.splitTextToSize(termsText, 160); // Narrower width for padding
  let currentTermsY = termsY + 8; // Start with padding from top
  
  for (let i = 0; i < lines.length; i++) {
    if (currentTermsY > termsY + termsHeight - 8) {
      // Need new page for terms continuation
      doc.addPage();
      currentTermsY = 20;
      
      // Continue terms cell on new page
      doc.setFillColor(255, 255, 255);
      doc.rect(20, currentTermsY - 8, 170, 200, 'F');
      doc.setDrawColor(209, 213, 219);
      doc.rect(20, currentTermsY - 8, 170, 200);
    }
    
    doc.text(lines[i], 25, currentTermsY); // Left padding of 5 units
    currentTermsY += 3; // Reduced line height for compact appearance
  }

  return new Uint8Array(doc.output('arraybuffer'));
};
