
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
  
  // Header with dark background
  doc.setFillColor(64, 64, 64); // Dark grey
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Palmer & Partners', 15, 16);
  
  // Main title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Tenancy Application', 105, 40, { align: 'center' });
  
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
    ['Rental Amount', propertyPreferences.maxRent ? `£${propertyPreferences.maxRent}` : 'Not specified'],
    ['Preferred Move-in Date', propertyPreferences.moveInDate || 'Not specified'],
    ['Latest Move-in Date', propertyPreferences.latestMoveInDate || 'Not specified'],
    ['Initial Tenancy Term', propertyPreferences.initialTenancyTerm || 'Not specified'],
    ['Has Pets', additionalDetails.pets || 'No'],
    ['Under 18s', additionalDetails.under18Count || '0'],
    ['Under 18s Details', additionalDetails.childrenAges || '-'],
    ['Conditions of Offer', additionalDetails.conditionsOfOffer || '-'],
    ['Deposit Type', additionalDetails.depositType || 'Not specified']
  ];
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  propertyRows.forEach((row, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 2, 180, 10, 'F');
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 20, yPosition + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 105, yPosition + 4);
    yPosition += 10;
  });
  
  yPosition += 15;
  
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
    doc.text(`Applicant - #${index + 1}`, 20, yPosition + 3);
    
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
      
      doc.setFont('helvetica', 'bold');
      doc.text(row[0], 20, yPosition + 4);
      doc.setFont('helvetica', 'normal');
      doc.text(row[1], 105, yPosition + 4);
      yPosition += 10;
    });
    
    yPosition += 15;
    
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Employment Details with grey header
    doc.setFillColor(200, 200, 200);
    doc.rect(15, yPosition - 5, 180, 8, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Employment Details', 20, yPosition + 1);
    
    yPosition += 15;
    
    const employmentRows = [
      ['Contract Type', applicant.employment || 'Not specified'],
      ['Company Name', applicant.companyName || '-'],
      ['Job Title', applicant.jobTitle || 'Not specified'],
      ['Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '-'],
      ['Length of Service', applicant.lengthOfService || '']
    ];
    
    doc.setFont('helvetica', 'normal');
    
    employmentRows.forEach((row, rowIndex) => {
      const isEven = rowIndex % 2 === 0;
      if (isEven) {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPosition - 2, 180, 10, 'F');
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(row[0], 20, yPosition + 4);
      doc.setFont('helvetica', 'normal');
      doc.text(row[1], 105, yPosition + 4);
      yPosition += 10;
    });
    
    yPosition += 15;
    
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Current Property Details with grey header
    doc.setFillColor(200, 200, 200);
    doc.rect(15, yPosition - 5, 180, 8, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Current Property Details', 20, yPosition + 1);
    
    yPosition += 15;
    
    const currentPropertyRows = [
      ['Postcode', applicant.previousPostcode || 'Not specified'],
      ['Street Address', applicant.previousAddress || 'Not specified'],
      ['Move In Date', applicant.moveInDate || 'Not specified'],
      ['Vacate Date', applicant.vacateDate || 'Not specified'],
      ['Current Property Status', applicant.currentPropertyStatus || 'Not specified'],
      ['Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : 'Not specified'],
    ];
    
    doc.setFont('helvetica', 'normal');
    
    currentPropertyRows.forEach((row, rowIndex) => {
      const isEven = rowIndex % 2 === 0;
      if (isEven) {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPosition - 2, 180, 10, 'F');
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(row[0], 20, yPosition + 4);
      doc.setFont('helvetica', 'normal');
      doc.text(row[1], 105, yPosition + 4);
      yPosition += 10;
    });
    
    yPosition += 15;
    
    // Additional Information with grey header
    doc.setFillColor(200, 200, 200);
    doc.rect(15, yPosition - 5, 180, 8, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Information', 20, yPosition + 1);
    
    yPosition += 15;
    
    const additionalRows = [
      ['UK/ROI Passport', additionalDetails.ukPassport || 'Not specified'],
      ['Adverse Credit', additionalDetails.adverseCredit || 'Not specified'],
      ['Adverse Credit Details', additionalDetails.adverseCreditDetails || 'n/z'],
      ['Requires Guarantor', additionalDetails.guarantorRequired || 'Not specified'],
    ];
    
    doc.setFont('helvetica', 'normal');
    
    additionalRows.forEach((row, rowIndex) => {
      const isEven = rowIndex % 2 === 0;
      if (isEven) {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPosition - 2, 180, 10, 'F');
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(row[0], 20, yPosition + 4);
      doc.setFont('helvetica', 'normal');
      doc.text(row[1], 105, yPosition + 4);
      yPosition += 10;
    });
    
    yPosition += 15;
  });
  
  // Check if we need a new page
  if (yPosition > 180) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Data Sharing Section
  doc.setFillColor(64, 64, 64);
  doc.rect(15, yPosition - 5, 180, 12, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Data Sharing', 20, yPosition + 3);
  
  yPosition += 20;
  
  const dataSharingRows = [
    ['Accept Utilities', dataSharing.utilities ? 'Yes' : 'No'],
    ['Accept Insurance', dataSharing.insurance ? 'Yes' : 'No'],
  ];
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  dataSharingRows.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 2, 180, 10, 'F');
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 20, yPosition + 4);
    doc.setFont('helvetica', 'normal');
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
  
  const signatureRows = [
    ['Full name', signature || 'Not provided'],
    ['Signature', signature || 'Not provided'],
    ['Submitted At', new Date(submittedAt).toLocaleDateString('en-GB') + ' - ' + new Date(submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' PM']
  ];
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  signatureRows.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 2, 180, 10, 'F');
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 20, yPosition + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 105, yPosition + 4);
    yPosition += 10;
  });
  
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
