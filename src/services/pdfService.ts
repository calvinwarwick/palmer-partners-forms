
import jsPDF from 'jspdf';

interface TenancyApplicationData {
  applicants: any[];
  propertyPreferences: any;
  signature: string;
  submittedAt: string;
}

export const generateApplicationPDF = (data: TenancyApplicationData): Uint8Array => {
  const { applicants, propertyPreferences, signature, submittedAt } = data;
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text('Palmer & Partners', 20, 30);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Premium Estate Agents', 20, 40);
  
  doc.setFontSize(16);
  doc.text('Tenancy Application', 20, 60);
  
  doc.setFontSize(10);
  doc.text(`Submitted: ${new Date(submittedAt).toLocaleString()}`, 20, 70);
  
  let yPosition = 90;
  
  // Applicant Information
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Applicant Information', 20, yPosition);
  yPosition += 15;
  
  applicants.forEach((applicant, index) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Applicant ${index + 1}: ${applicant.firstName} ${applicant.lastName}`, 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Email: ${applicant.email}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Phone: ${applicant.phone}`, 25, yPosition);
    yPosition += 8;
    
    if (applicant.dateOfBirth) {
      doc.text(`Date of Birth: ${applicant.dateOfBirth}`, 25, yPosition);
      yPosition += 8;
    }
    
    if (applicant.employment) {
      doc.text(`Employment: ${applicant.employment}`, 25, yPosition);
      yPosition += 8;
    }
    
    if (applicant.annualIncome) {
      doc.text(`Annual Income: £${applicant.annualIncome}`, 25, yPosition);
      yPosition += 8;
    }
    
    if (applicant.previousAddress) {
      const addressLines = doc.splitTextToSize(`Previous Address: ${applicant.previousAddress}`, 160);
      doc.text(addressLines, 25, yPosition);
      yPosition += addressLines.length * 8;
    }
    
    if (applicant.reference1Name) {
      doc.text(`Reference: ${applicant.reference1Name} (${applicant.reference1Contact})`, 25, yPosition);
      yPosition += 8;
    }
    
    yPosition += 10;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
  });
  
  // Property Preferences
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Property Preferences', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Property Type: ${propertyPreferences.propertyType}`, 25, yPosition);
  yPosition += 8;
  doc.text(`Maximum Rent: £${propertyPreferences.maxRent}/month`, 25, yPosition);
  yPosition += 8;
  
  if (propertyPreferences.preferredLocation) {
    doc.text(`Preferred Location: ${propertyPreferences.preferredLocation}`, 25, yPosition);
    yPosition += 8;
  }
  
  if (propertyPreferences.moveInDate) {
    doc.text(`Move-in Date: ${propertyPreferences.moveInDate}`, 25, yPosition);
    yPosition += 8;
  }
  
  if (propertyPreferences.additionalRequests) {
    yPosition += 5;
    doc.text('Additional Requests:', 25, yPosition);
    yPosition += 8;
    const requestLines = doc.splitTextToSize(propertyPreferences.additionalRequests, 150);
    doc.text(requestLines, 25, yPosition);
    yPosition += requestLines.length * 8;
  }
  
  // Digital Signature
  yPosition += 15;
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Digital Signature', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Signed by: ${signature}`, 25, yPosition);
  yPosition += 8;
  doc.text(`Date: ${new Date(submittedAt).toLocaleDateString()}`, 25, yPosition);
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Palmer & Partners - Tenancy Application', 20, 285);
    doc.text(`Page ${i} of ${pageCount}`, 180, 285);
  }
  
  return doc.output('arraybuffer') as Uint8Array;
};
