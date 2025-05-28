
import jsPDF from 'jspdf';

interface TenancyApplicationData {
  applicants: any[];
  propertyPreferences: any;
  signature: string;
  submittedAt: string;
  propertyDetails?: {
    streetAddress: string;
    postcode: string;
    rentalAmount: string;
    preferredMoveInDate: string;
    latestMoveInDate: string;
    initialTenancyTerm: string;
    hasPets: string;
    under18s: string;
    conditionsOfOffer: string;
    depositType: string;
  };
}

export const generateApplicationPDF = (data: TenancyApplicationData): Uint8Array => {
  const { applicants, propertyPreferences, signature, submittedAt, propertyDetails } = data;
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
  
  // Property details table
  const propertyData = propertyDetails || {
    streetAddress: propertyPreferences.preferredLocation || 'Not specified',
    postcode: 'Not specified',
    rentalAmount: `£${propertyPreferences.maxRent || '0'}.00`,
    preferredMoveInDate: propertyPreferences.moveInDate || 'Not specified',
    latestMoveInDate: 'Not specified',
    initialTenancyTerm: '1 year',
    hasPets: 'No',
    under18s: 'None',
    conditionsOfOffer: '-',
    depositType: 'Traditional deposit'
  };
  
  const propertyRows = [
    ['Street Address', propertyData.streetAddress],
    ['Postcode', propertyData.postcode],
    ['Rental Amount', propertyData.rentalAmount],
    ['Preferred Move-in Date', propertyData.preferredMoveInDate],
    ['Latest Move-in Date', propertyData.latestMoveInDate],
    ['Initial Tenancy Term', propertyData.initialTenancyTerm],
    ['Has Pets', propertyData.hasPets],
    ['Under 18s', propertyData.under18s],
    ['Conditions of Offer', propertyData.conditionsOfOffer],
    ['Deposit Type', propertyData.depositType]
  ];
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  propertyRows.forEach((row, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 2, 180, 10, 'F');
    }
    
    doc.setFont('helvetica', 'normal');
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
  doc.setFillColor(64, 64, 64);
  doc.rect(15, yPosition - 5, 180, 12, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Applicant Details', 20, yPosition + 3);
  
  yPosition += 20;
  
  applicants.forEach((applicant, index) => {
    const applicantRows = [
      ['First Name', applicant.firstName],
      ['Last Name', applicant.lastName],
      ['Date of Birth', applicant.dateOfBirth || 'Not specified'],
      ['Email Address', applicant.email],
      ['Mobile Number', applicant.phone],
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
      ['Contract Type', applicant.employment || 'N/A'],
      ['Company Name', '-'],
      ['Job Title', '-'],
      ['Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '-'],
      ['Length of Service', '-'],
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
      ['Postcode', propertyData.postcode],
      ['Street Address', applicant.previousAddress || propertyData.streetAddress],
      ['Move In Date', '10th February 2025'],
      ['Vacate Date', '10th February 2025'],
      ['Current Property Status', 'Rented Privately'],
      ['Current Rental Amount', propertyData.rentalAmount],
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
    ['UK/ROI Passport', 'No'],
    ['Adverse Credit', 'No'],
    ['Requires Guarantor', 'No'],
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
