
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

  // Header - Dark grey background with logo
  const headerHeight = 25;
  doc.setFillColor(33, 33, 33); // #212121 dark grey
  doc.rect(0, 0, 210, headerHeight, 'F');

  try {
    // Try to load and add the actual logo
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/lovable-uploads/fc497427-18c1-4156-888c-56392e2a21cf.png';
    
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });
    
    // Calculate logo dimensions maintaining aspect ratio
    const maxLogoWidth = 40;
    const maxLogoHeight = 20;
    const aspectRatio = logoImg.naturalWidth / logoImg.naturalHeight;
    
    let logoWidth, logoHeight;
    if (aspectRatio > maxLogoWidth / maxLogoHeight) {
      logoWidth = maxLogoWidth;
      logoHeight = maxLogoWidth / aspectRatio;
    } else {
      logoHeight = maxLogoHeight;
      logoWidth = maxLogoHeight * aspectRatio;
    }
    
    const logoX = 105 - logoWidth / 2;
    const logoY = headerHeight / 2 - logoHeight / 2;
    
    doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.warn('Could not load logo, using text fallback');
    // Fallback to text logo
    doc.setFillColor(255, 255, 255);
    doc.rect(85, 8, 40, 9, 'F');
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Palmer & Partners', 105, 14, { align: 'center' });
  }

  // Orange bottom border
  doc.setFillColor(255, 111, 0); // #FF6F00 orange
  doc.rect(0, headerHeight, 210, 2, 'F');

  yPosition = headerHeight + 15;

  // Main title
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Tenancy Application', 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Helper function to add section header
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

  // Helper function for data rows
  const addDataRow = (label: string, value: string, currentY: number, isSubsection: boolean = false) => {
    const y = checkPageBreak(currentY);
    
    if (isSubsection) {
      doc.setFillColor(200, 200, 200);
      doc.rect(20, y, 170, 12, 'F');
      doc.setDrawColor(150, 150, 150);
      doc.rect(20, y, 170, 12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(label, 105, y + 7, { align: 'center' });
      return y + 12;
    }
    
    const labelWidth = 170 * 0.35;
    const valueWidth = 170 * 0.65;
    const rowHeight = 12;
    
    // Label column
    doc.setFillColor(243, 244, 246);
    doc.rect(20, y, labelWidth, rowHeight, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.5);
    doc.rect(20, y, labelWidth, rowHeight);
    
    // Value column
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

  // Helper function to format dates
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

  // Property Details Section
  yPosition = addSectionHeader('Property Details', yPosition);
  yPosition = addDataRow('Street Address', data.propertyPreferences?.streetAddress || '', yPosition);
  yPosition = addDataRow('Postcode', data.propertyPreferences?.postcode || '', yPosition);
  yPosition = addDataRow('Rental Amount', data.propertyPreferences?.maxRent ? `£${data.propertyPreferences.maxRent}` : '', yPosition);
  yPosition = addDataRow('Preferred Move-in Date', formatDate(data.propertyPreferences?.moveInDate || ''), yPosition);
  yPosition = addDataRow('Latest Move-in Date', formatDate(data.propertyPreferences?.latestMoveInDate || ''), yPosition);
  yPosition = addDataRow('Initial Tenancy Term', data.propertyPreferences?.initialTenancyTerm || '', yPosition);

  // Applicants Section
  data.applicants.forEach((applicant, index) => {
    yPosition = addSectionHeader(`Applicant - #${index + 1}`, yPosition);
    
    yPosition = addDataRow('First Name', applicant.firstName || '', yPosition);
    yPosition = addDataRow('Last Name', applicant.lastName || '', yPosition);
    yPosition = addDataRow('Date of Birth', formatDate(applicant.dateOfBirth || ''), yPosition);
    yPosition = addDataRow('Email Address', applicant.email || '', yPosition);
    yPosition = addDataRow('Mobile Number', applicant.phone || '', yPosition);

    // Employment Details
    yPosition = addDataRow('Employment Details', '', yPosition, true);
    yPosition = addDataRow('Contract Type', applicant.employment || '', yPosition);
    yPosition = addDataRow('Company Name', applicant.companyName || '', yPosition);
    yPosition = addDataRow('Job Title', applicant.jobTitle || '', yPosition);
    yPosition = addDataRow('Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '', yPosition);
    yPosition = addDataRow('Length of Service', applicant.lengthOfService || '', yPosition);

    // Current Property Details
    yPosition = addDataRow('Current Property Details', '', yPosition, true);
    yPosition = addDataRow('Postcode', applicant.currentPostcode || '', yPosition);
    yPosition = addDataRow('Street Address', applicant.currentAddress || '', yPosition);
    yPosition = addDataRow('Move In Date', formatDate(applicant.moveInDate || ''), yPosition);
    yPosition = addDataRow('Vacate Date', formatDate(applicant.vacateDate || ''), yPosition);
    yPosition = addDataRow('Current Property Status', applicant.currentPropertyStatus || '', yPosition);
    yPosition = addDataRow('Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '', yPosition);
  });

  // Data Sharing Section
  yPosition = addSectionHeader('Data Sharing', yPosition);
  yPosition = addDataRow('Accept Utilities', data.dataSharing?.utilities ? 'Yes' : 'No', yPosition);
  yPosition = addDataRow('Accept Insurance', data.dataSharing?.insurance ? 'Yes' : 'No', yPosition);

  // Signature Section
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
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text('Digital Signature Applied', 25 + labelWidth + (valueWidth - 10) / 2, yPosition + 14, { align: 'center' });
    }
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(data.signature || 'Digital Signature Applied', 25 + labelWidth, yPosition + 14);
  }
  
  yPosition += signatureRowHeight;
  
  // Submitted at
  const submittedDate = data.submittedAt ? new Date(data.submittedAt).toLocaleString() : new Date().toLocaleString();
  yPosition = addDataRow('Submitted At', submittedDate, yPosition);

  return new Uint8Array(doc.output('arraybuffer'));
};
