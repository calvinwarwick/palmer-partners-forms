
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

  // Helper function to add section header
  const addSectionHeader = (title: string, currentY: number) => {
    const y = checkPageBreak(currentY + 15);
    
    // Dark grey background for section header
    doc.setFillColor(32, 32, 32); // #202020
    doc.rect(20, y - 5, 170, 10, 'F');
    
    // White text on dark background
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, y + 1, { align: 'center' });
    
    // Reset text color to black
    doc.setTextColor(0, 0, 0);
    return y + 10;
  };

  // Helper function to add table row
  const addTableRow = (label: string, value: string, currentY: number, isSubsection: boolean = false) => {
    const y = checkPageBreak(currentY);
    
    if (isSubsection) {
      // Grey background for subsection
      doc.setFillColor(216, 216, 216);
      doc.rect(20, y - 2, 170, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(label, 105, y + 2, { align: 'center' });
      return y + 10;
    }
    
    // Light grey background for label column
    doc.setFillColor(242, 242, 242);
    doc.rect(20, y - 2, 42.5, 8, 'F');
    
    // White background for value column
    doc.setFillColor(255, 255, 255);
    doc.rect(62.5, y - 2, 127.5, 8, 'F');
    
    // Add borders
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, y - 2, 42.5, 8);
    doc.rect(62.5, y - 2, 127.5, 8);
    
    // Add text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(label, 22, y + 2);
    doc.text(value || '-', 64.5, y + 2);
    
    return y + 8;
  };

  // Logo and header section
  doc.setFillColor(242, 242, 242); // Light grey background
  doc.rect(0, 0, 210, 40, 'F');
  
  // Orange rectangle for logo (simulating the logo container)
  doc.setFillColor(255, 111, 0); // Orange color
  doc.rect(85, 10, 40, 20, 'F');
  
  // Logo text (since we can't embed images easily)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('P&P', 105, 22, { align: 'center' });
  
  // Orange line below header
  doc.setFillColor(255, 111, 0);
  doc.rect(0, 40, 210, 1, 'F');
  
  yPosition = 55;

  // Main title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Tenancy Application', 105, yPosition, { align: 'center' });
  yPosition += 20;

  // Property Details Section
  yPosition = addSectionHeader('Property Details', yPosition);
  yPosition = addTableRow('Street Address', data.propertyPreferences?.streetAddress, yPosition);
  yPosition = addTableRow('Postcode', data.propertyPreferences?.postcode, yPosition);
  yPosition = addTableRow('Rental Amount', data.propertyPreferences?.maxRent ? `£${data.propertyPreferences.maxRent}` : '', yPosition);
  yPosition = addTableRow('Preferred Move-in Date', data.propertyPreferences?.moveInDate, yPosition);
  yPosition = addTableRow('Latest Move-in Date', data.propertyPreferences?.latestMoveInDate, yPosition);
  yPosition = addTableRow('Initial Tenancy Term', data.propertyPreferences?.initialTenancyTerm, yPosition);
  yPosition = addTableRow('Has Pets', data.additionalDetails?.pets ? 'Yes' : 'No', yPosition);
  yPosition = addTableRow('Under 18s', data.additionalDetails?.children ? (data.additionalDetails?.childrenDetails ? 'Yes' : 'Yes') : 'No', yPosition);
  if (data.additionalDetails?.children && data.additionalDetails?.childrenDetails) {
    yPosition = addTableRow('Under 18s Details', data.additionalDetails.childrenDetails, yPosition);
  }
  yPosition = addTableRow('Additional Requests', data.additionalDetails?.additionalRequests, yPosition);

  // Applicants Section
  data.applicants.forEach((applicant, index) => {
    yPosition = addSectionHeader(`Applicant - #${index + 1}`, yPosition);
    
    // Personal Details
    yPosition = addTableRow('First Name', applicant.firstName, yPosition);
    yPosition = addTableRow('Last Name', applicant.lastName, yPosition);
    yPosition = addTableRow('Date of Birth', applicant.dateOfBirth, yPosition);
    yPosition = addTableRow('Email Address', applicant.email, yPosition);
    yPosition = addTableRow('Mobile Number', applicant.phone, yPosition);

    // Employment Details
    yPosition = addTableRow('Employment Details', '', yPosition, true);
    yPosition = addTableRow('Contract Type', applicant.employment, yPosition);
    yPosition = addTableRow('Company Name', applicant.companyName, yPosition);
    yPosition = addTableRow('Job Title', applicant.jobTitle, yPosition);
    yPosition = addTableRow('Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '', yPosition);
    yPosition = addTableRow('Length of Service', applicant.lengthOfService, yPosition);

    // Current Property Details
    yPosition = addTableRow('Current Property Details', '', yPosition, true);
    yPosition = addTableRow('Postcode', applicant.previousPostcode || applicant.currentPostcode, yPosition);
    yPosition = addTableRow('Street Address', applicant.previousAddress || applicant.currentAddress, yPosition);
    yPosition = addTableRow('Move In Date', applicant.moveInDate, yPosition);
    yPosition = addTableRow('Vacate Date', applicant.vacateDate, yPosition);
    yPosition = addTableRow('Current Property Status', applicant.currentPropertyStatus, yPosition);
    yPosition = addTableRow('Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '', yPosition);

    // Additional Information
    yPosition = addTableRow('Additional Information', '', yPosition, true);
    yPosition = addTableRow('UK/ROI Passport', applicant.ukPassport === 'yes' ? 'Yes' : 'No', yPosition);
    yPosition = addTableRow('Adverse Credit', applicant.adverseCredit === 'yes' ? 'Yes' : 'No', yPosition);
    if (applicant.adverseCredit === 'yes' && applicant.adverseCreditDetails) {
      yPosition = addTableRow('Adverse Credit Details', applicant.adverseCreditDetails, yPosition);
    }
    yPosition = addTableRow('Requires Guarantor', applicant.guarantorRequired === 'yes' ? 'Yes' : 'No', yPosition);
    if (data.additionalDetails?.pets && data.additionalDetails?.petDetails) {
      yPosition = addTableRow('Pet Details', data.additionalDetails.petDetails, yPosition);
    }
  });

  // Data Sharing Section
  yPosition = addSectionHeader('Data Sharing', yPosition);
  yPosition = addTableRow('Accept Utilities', data.dataSharing?.utilities ? 'Yes' : 'No', yPosition);
  yPosition = addTableRow('Accept Insurance', data.dataSharing?.insurance ? 'Yes' : 'No', yPosition);

  // Signature Section
  yPosition = addSectionHeader('Signature', yPosition);
  
  if (data.signature && data.signature.startsWith('data:image/')) {
    yPosition = addTableRow('Full Name', `${data.applicants[0]?.firstName || ''} ${data.applicants[0]?.lastName || ''}`, yPosition);
    
    // Add signature image placeholder (jsPDF has limitations with images)
    yPosition = checkPageBreak(yPosition + 20);
    doc.setFillColor(242, 242, 242);
    doc.rect(20, yPosition - 2, 170, 25, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, yPosition - 2, 170, 25);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Digital Signature Applied', 105, yPosition + 10, { align: 'center' });
    yPosition += 30;
  } else {
    yPosition = addTableRow('Full Name', data.signature, yPosition);
    yPosition = addTableRow('Signature', data.signature, yPosition);
  }
  
  yPosition = addTableRow('Submitted At', data.submittedAt ? new Date(data.submittedAt).toLocaleString() : new Date().toLocaleString(), yPosition);

  return new Uint8Array(doc.output('arraybuffer'));
};
