
import jsPDF from 'jspdf';

interface TenancyApplicationData {
  applicants: any[];
  propertyPreferences: any;
  additionalDetails: any;
  dataSharing: any;
  signature: string;
  submittedAt: string;
}

export const generateApplicationPDF = (data: TenancyApplicationData): Uint8Array => {
  const { applicants, propertyPreferences, additionalDetails, dataSharing, signature, submittedAt } = data;
  const doc = new jsPDF();
  
  // Header with orange bar
  doc.setFillColor(255, 102, 0); // Orange color
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('Palmer & Partners', 15, 18);
  
  // Main title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Tenancy Application', 15, 40);
  
  let yPosition = 60;
  
  // Property Details Section
  doc.setFillColor(64, 64, 64); // Dark grey
  doc.rect(15, yPosition - 5, 180, 12, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Property Details', 20, yPosition + 3);
  
  yPosition += 20;
  
  const propertyRows = [
    ['Street Address', propertyPreferences.streetAddress || 'Not specified'],
    ['Postcode', propertyPreferences.postcode || 'Not specified'],
    ['Rental Amount', propertyPreferences.rentalAmount ? `£${propertyPreferences.rentalAmount}` : 'Not specified'],
    ['Preferred Move-in Date', propertyPreferences.moveInDate || 'Not specified'],
    ['Latest Move-in Date', propertyPreferences.latestMoveInDate || 'Not specified'],
    ['Initial Tenancy Term', propertyPreferences.tenancyTerm || 'Not specified']
  ];
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  propertyRows.forEach((row, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 2, 180, 10, 'F');
    }
    
    doc.text(row[0], 20, yPosition + 4);
    doc.text(row[1], 105, yPosition + 4);
    yPosition += 10;
  });
  
  yPosition += 10;
  
  // Check if we need a new page
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Applicant Details Section
  applicants.forEach((applicant, index) => {
    doc.setFillColor(64, 64, 64);
    doc.rect(15, yPosition - 5, 180, 12, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Applicant ${index + 1} Details`, 20, yPosition + 3);
    
    yPosition += 20;
    
    const applicantRows = [
      ['First Name', applicant.firstName || 'Not specified'],
      ['Last Name', applicant.lastName || 'Not specified'],
      ['Date of Birth', applicant.dateOfBirth || 'Not specified'],
      ['Email Address', applicant.email || 'Not specified'],
      ['Mobile Number', applicant.phone || 'Not specified'],
    ];
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    applicantRows.forEach((row, rowIndex) => {
      const isEven = rowIndex % 2 === 0;
      if (isEven) {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPosition - 2, 180, 10, 'F');
      }
      
      doc.text(row[0], 20, yPosition + 4);
      doc.text(row[1], 105, yPosition + 4);
      yPosition += 10;
    });
    
    yPosition += 10;
    
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Employment Details
    doc.setFillColor(64, 64, 64);
    doc.rect(15, yPosition - 5, 180, 12, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Employment Details', 20, yPosition + 3);
    
    yPosition += 20;
    
    const employmentRows = [
      ['Contract Type', applicant.employment || 'Not specified'],
      ['Company Name', applicant.companyName || 'Not specified'],
      ['Job Title', applicant.jobTitle || 'Not specified'],
      ['Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : 'Not specified'],
      ['Length of Service', applicant.lengthOfService || 'Not specified'],
    ];
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    employmentRows.forEach((row, rowIndex) => {
      const isEven = rowIndex % 2 === 0;
      if (isEven) {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPosition - 2, 180, 10, 'F');
      }
      
      doc.text(row[0], 20, yPosition + 4);
      doc.text(row[1], 105, yPosition + 4);
      yPosition += 10;
    });
    
    yPosition += 10;
    
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Current Property Details
    doc.setFillColor(64, 64, 64);
    doc.rect(15, yPosition - 5, 180, 12, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Current Property Details', 20, yPosition + 3);
    
    yPosition += 20;
    
    const currentPropertyRows = [
      ['Street Address', applicant.previousAddress || 'Not specified'],
      ['Postcode', applicant.previousPostcode || 'Not specified'],
      ['Move In Date', applicant.moveInDate || 'Not specified'],
      ['Vacate Date', applicant.vacateDate || 'Not specified'],
      ['Current Property Status', applicant.currentPropertyStatus || 'Not specified'],
      ['Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : 'Not specified'],
    ];
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    currentPropertyRows.forEach((row, rowIndex) => {
      const isEven = rowIndex % 2 === 0;
      if (isEven) {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPosition - 2, 180, 10, 'F');
      }
      
      doc.text(row[0], 20, yPosition + 4);
      doc.text(row[1], 105, yPosition + 4);
      yPosition += 10;
    });
    
    yPosition += 10;
  });
  
  // Check if we need a new page
  if (yPosition > 180) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Additional Information
  doc.setFillColor(64, 64, 64);
  doc.rect(15, yPosition - 5, 180, 12, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Additional Information', 20, yPosition + 3);
  
  yPosition += 20;
  
  const additionalRows = [
    ['UK/ROI Passport', additionalDetails.ukPassport || 'Not specified'],
    ['Adverse Credit', additionalDetails.adverseCredit || 'Not specified'],
    ['Adverse Credit Details', additionalDetails.adverseCreditDetails || 'N/A'],
    ['Requires Guarantor', additionalDetails.guarantorRequired || 'Not specified'],
    ['Pets', additionalDetails.pets || 'Not specified'],
    ['Under 18s Count', additionalDetails.under18Count || 'Not specified'],
    ['Children Ages', additionalDetails.childrenAges || 'N/A'],
    ['Conditions of Offer', additionalDetails.conditionsOfOffer || 'None'],
    ['Deposit Type', additionalDetails.depositType || 'Not specified'],
  ];
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  additionalRows.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 2, 180, 10, 'F');
    }
    
    doc.text(row[0], 20, yPosition + 4);
    doc.text(row[1], 105, yPosition + 4);
    yPosition += 10;
  });
  
  yPosition += 15;
  
  // Check if we need a new page
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Data Sharing Section
  doc.setFillColor(64, 64, 64);
  doc.rect(15, yPosition - 5, 180, 12, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Data Sharing Preferences', 20, yPosition + 3);
  
  yPosition += 20;
  
  const dataSharingRows = [
    ['Utilities Data Sharing', dataSharing.utilities ? 'Yes' : 'No'],
    ['Insurance Data Sharing', dataSharing.insurance ? 'Yes' : 'No'],
  ];
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  dataSharingRows.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 2, 180, 10, 'F');
    }
    
    doc.text(row[0], 20, yPosition + 4);
    doc.text(row[1], 105, yPosition + 4);
    yPosition += 10;
  });
  
  yPosition += 15;
  
  // Signature Section
  doc.setFillColor(64, 64, 64);
  doc.rect(15, yPosition - 5, 180, 12, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Signature', 20, yPosition + 3);
  
  yPosition += 20;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Full name: ${signature}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Submitted At: ${new Date(submittedAt).toLocaleDateString('en-GB')} - ${new Date(submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`, 20, yPosition);
  
  // Footer on all pages
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Palmer & Partners - Tenancy Application', 20, 285);
    doc.text(`Page ${i} of ${pageCount}`, 180, 285);
  }
  
  // Generate PDF as Uint8Array properly
  const pdfArrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(pdfArrayBuffer);
};
