
import jsPDF from 'jspdf';
import { Applicant, PropertyPreferences, AdditionalDetails } from '@/domain/types/Applicant';

export const generateApplicationPDF = async (data: {
  applicants: Applicant[];
  propertyPreferences: PropertyPreferences;
  additionalDetails: AdditionalDetails;
  dataSharing: { utilities: boolean; insurance: boolean };
  signature: string;
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

  // Title
  doc.setFontSize(20);
  doc.text('Tenancy Application', 20, yPosition);
  yPosition += 20;

  // Property Preferences Section
  doc.setFontSize(16);
  doc.text('Property Preferences', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  const preferences = data.propertyPreferences;
  doc.text(`Property Type: ${preferences.propertyType}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Street Address: ${preferences.streetAddress}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Postcode: ${preferences.postcode}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Max Rent: £${preferences.maxRent}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Preferred Location: ${preferences.preferredLocation}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Move In Date: ${preferences.moveInDate}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Latest Move In Date: ${preferences.latestMoveInDate}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Initial Tenancy Term: ${preferences.initialTenancyTerm}`, 20, yPosition);
  yPosition += 15;

  // Applicants Section
  data.applicants.forEach((applicant, index) => {
    yPosition = checkPageBreak(yPosition + 20);
    
    doc.setFontSize(16);
    doc.text(`Applicant ${index + 1}`, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(`Name: ${applicant.firstName} ${applicant.lastName}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Email: ${applicant.email}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Phone: ${applicant.phone}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Date of Birth: ${applicant.dateOfBirth}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Employment: ${applicant.employment}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Company: ${applicant.companyName}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Job Title: ${applicant.jobTitle}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Annual Income: £${applicant.annualIncome}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Length of Service: ${applicant.lengthOfService}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Previous Address: ${applicant.previousAddress}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Previous Postcode: ${applicant.previousPostcode}`, 20, yPosition);
    yPosition += 15;
  });

  // Additional Details Section
  yPosition = checkPageBreak(yPosition + 20);
  
  doc.setFontSize(16);
  doc.text('Additional Details', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  const details = data.additionalDetails;
  
  doc.text(`Children: ${details.children ? 'Yes' : 'No'}`, 20, yPosition);
  yPosition += 7;
  
  if (details.children && details.childrenDetails) {
    doc.text(`Children Details: ${details.childrenDetails}`, 20, yPosition);
    yPosition += 7;
  }
  
  doc.text(`Pets: ${details.pets ? 'Yes' : 'No'}`, 20, yPosition);
  yPosition += 7;
  
  if (details.pets && details.petDetails) {
    doc.text(`Pet Details: ${details.petDetails}`, 20, yPosition);
    yPosition += 7;
  }
  
  if (details.additionalRequests) {
    doc.text(`Additional Requests: ${details.additionalRequests}`, 20, yPosition);
    yPosition += 7;
  }

  // Data Sharing Section
  yPosition = checkPageBreak(yPosition + 15);
  
  doc.setFontSize(16);
  doc.text('Data Sharing Preferences', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(`Utilities Data Sharing: ${data.dataSharing.utilities ? 'Agreed' : 'Declined'}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Insurance Data Sharing: ${data.dataSharing.insurance ? 'Agreed' : 'Declined'}`, 20, yPosition);
  yPosition += 15;

  // Signature Section
  yPosition = checkPageBreak(yPosition + 30);
  
  doc.setFontSize(16);
  doc.text('Signature', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.text('Application submitted with digital signature', 20, yPosition);
  yPosition += 7;
  doc.text(`Submission Date: ${new Date().toLocaleDateString()}`, 20, yPosition);

  return new Uint8Array(doc.output('arraybuffer'));
};
