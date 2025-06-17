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

  // Load the actual logo image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Header - Dark grey background with centered logo (half height)
  const headerHeight = 25; // Reduced from 50
  doc.setFillColor(33, 33, 33); // #212121 dark grey
  doc.rect(0, 0, 210, headerHeight, 'F'); // Full width dark header

  try {
    // Try to load and add the actual logo
    const logoImg = await loadImage('/lovable-uploads/fc497427-18c1-4156-888c-56392e2a21cf.png');
    
    // Calculate logo dimensions maintaining aspect ratio
    const imgWidth = logoImg.naturalWidth;
    const imgHeight = logoImg.naturalHeight;
    const aspectRatio = imgWidth / imgHeight;
    
    // Set maximum dimensions for the logo area - made larger
    const maxLogoWidth = 40; // Increased from 30
    const maxLogoHeight = 20; // Increased from 15
    
    let logoWidth, logoHeight;
    
    // Calculate actual dimensions maintaining aspect ratio
    if (aspectRatio > maxLogoWidth / maxLogoHeight) {
      // Image is wider - constrain by width
      logoWidth = maxLogoWidth;
      logoHeight = maxLogoWidth / aspectRatio;
    } else {
      // Image is taller - constrain by height
      logoHeight = maxLogoHeight;
      logoWidth = maxLogoHeight * aspectRatio;
    }
    
    const logoX = 105 - logoWidth / 2; // Center horizontally
    const logoY = headerHeight / 2 - logoHeight / 2; // Center vertically in the smaller header
    
    // Add the actual logo image without background (PNG has transparency)
    doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    // Fallback to text logo if image loading fails
    doc.setFillColor(255, 255, 255); // White background for text
    doc.rect(85, 8, 40, 9, 'F');
    
    doc.setTextColor(33, 33, 33); // Dark grey text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('P&P', 105, 14, { align: 'center' });
  }

  // Orange bottom border
  doc.setFillColor(255, 111, 0); // #FF6F00 orange
  doc.rect(0, headerHeight, 210, 2, 'F');

  yPosition = headerHeight + 15; // Increased top padding from 10 to 15

  // Main title - moved closer to form with reduced bottom spacing
  doc.setTextColor(33, 33, 33); // Dark grey text
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Tenancy Application', 105, yPosition, { align: 'center' });
  yPosition += 5; // Much reduced spacing from 10 to 5

  // Helper function to add section header exactly like demo
  const addSectionHeader = (title: string, currentY: number) => {
    const y = checkPageBreak(currentY + 10);
    
    // Dark grey background exactly like demo
    doc.setFillColor(33, 33, 33); // #212121
    doc.rect(20, y - 5, 170, 15, 'F');
    
    // White text centered
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, y + 4, { align: 'center' });
    
    return y + 10;
  };

  // Helper function for data rows with exact 35% width like demo
  const addDataRow = (label: string, value: string, currentY: number, isSubsection: boolean = false) => {
    const y = checkPageBreak(currentY);
    
    if (isSubsection) {
      // Light grey subsection header with no extra spacing
      doc.setFillColor(200, 200, 200);
      doc.rect(20, y, 170, 12, 'F');
      doc.setDrawColor(150, 150, 150);
      doc.rect(20, y, 170, 12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(label, 105, y + 7, { align: 'center' });
      return y + 12; // Return immediately after subsection header, no extra spacing
    }
    
    // Calculate exact 35% width for labels
    const labelWidth = 170 * 0.35; // 59.5
    const valueWidth = 170 * 0.65; // 110.5
    const rowHeight = 12;
    
    // Label column - light grey background
    doc.setFillColor(243, 244, 246); // bg-gray-100
    doc.rect(20, y, labelWidth, rowHeight, 'F');
    doc.setDrawColor(209, 213, 219); // border-gray-300
    doc.setLineWidth(0.5);
    doc.rect(20, y, labelWidth, rowHeight);
    
    // Value column - white background
    doc.setFillColor(255, 255, 255);
    doc.rect(20 + labelWidth, y, valueWidth, rowHeight, 'F');
    doc.rect(20 + labelWidth, y, valueWidth, rowHeight);
    
    // Text styling exactly like demo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    // Label text (medium weight)
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, y + 7);
    
    // Value text
    doc.setFont('helvetica', 'normal');
    doc.text(value || '-', 25 + labelWidth, y + 7);
    
    return y + rowHeight;
  };

  // Helper function to format dates like the demo
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'long' });
      const year = date.getFullYear();
      
      // Add ordinal suffix
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

  // Helper function to format submitted date like the demo
  const formatSubmittedDate = (dateString: string) => {
    if (!dateString) return new Date().toLocaleString();
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'long' });
      const year = date.getFullYear();
      const time = date.toLocaleTimeString('en-GB', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      // Add ordinal suffix
      const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      return `${day}${getOrdinalSuffix(day)} ${month} ${year} - ${time}`;
    } catch {
      return new Date().toLocaleString();
    }
  };

  // Helper function to determine if has pets - handle both boolean and string types
  const hasPets = () => {
    const pets = data.additionalDetails?.pets;
    if (typeof pets === 'boolean') {
      return pets;
    }
    return pets === 'yes';
  };

  // Property Details Section
  yPosition = addSectionHeader('Property Details', yPosition);
  yPosition = addDataRow('Street Address', data.propertyPreferences?.streetAddress || '', yPosition);
  yPosition = addDataRow('Postcode', data.propertyPreferences?.postcode || '', yPosition);
  yPosition = addDataRow('Rental Amount', data.propertyPreferences?.maxRent ? `£${data.propertyPreferences.maxRent}` : '', yPosition);
  yPosition = addDataRow('Preferred Move-in Date', formatDate(data.propertyPreferences?.moveInDate || ''), yPosition);
  yPosition = addDataRow('Latest Move-in Date', formatDate(data.propertyPreferences?.latestMoveInDate || ''), yPosition);
  yPosition = addDataRow('Initial Tenancy Term', data.propertyPreferences?.initialTenancyTerm || '', yPosition);
  yPosition = addDataRow('Has Pets', hasPets() ? 'Yes' : 'No', yPosition);
  yPosition = addDataRow('Under 18s', data.additionalDetails?.under18Count || '0', yPosition);
  if (data.additionalDetails?.under18Count && parseInt(data.additionalDetails.under18Count) > 0 && data.additionalDetails?.childrenAges) {
    yPosition = addDataRow('Under 18s Details', data.additionalDetails.childrenAges, yPosition);
  }
  yPosition = addDataRow('Additional Requests', data.additionalDetails?.additionalRequests || '', yPosition);

  // Applicants Section
  data.applicants.forEach((applicant, index) => {
    yPosition = addSectionHeader(`Applicant - #${index + 1}`, yPosition);
    
    // Personal Details
    yPosition = addDataRow('First Name', applicant.firstName || '', yPosition);
    yPosition = addDataRow('Last Name', applicant.lastName || '', yPosition);
    yPosition = addDataRow('Date of Birth', formatDate(applicant.dateOfBirth || ''), yPosition);
    yPosition = addDataRow('Email Address', applicant.email || '', yPosition);
    yPosition = addDataRow('Mobile Number', applicant.phone || '', yPosition);

    // Employment Details Subsection
    yPosition = addDataRow('Employment Details', '', yPosition, true);
    yPosition = addDataRow('Contract Type', applicant.employment || '', yPosition);
    yPosition = addDataRow('Company Name', applicant.companyName || '', yPosition);
    yPosition = addDataRow('Job Title', applicant.jobTitle || '', yPosition);
    yPosition = addDataRow('Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '', yPosition);
    yPosition = addDataRow('Length of Service', applicant.lengthOfService || '', yPosition);

    // Current Property Details Subsection
    yPosition = addDataRow('Current Property Details', '', yPosition, true);
    yPosition = addDataRow('Postcode', applicant.previousPostcode || applicant.currentPostcode || '', yPosition);
    yPosition = addDataRow('Street Address', applicant.previousAddress || applicant.currentAddress || '', yPosition);
    yPosition = addDataRow('Move In Date', formatDate(applicant.moveInDate || ''), yPosition);
    yPosition = addDataRow('Vacate Date', formatDate(applicant.vacateDate || ''), yPosition);
    yPosition = addDataRow('Current Property Status', applicant.currentPropertyStatus || '', yPosition);
    yPosition = addDataRow('Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '', yPosition);

    // Additional Information Subsection
    yPosition = addDataRow('Additional Information', '', yPosition, true);
    yPosition = addDataRow('UK/ROI Passport', applicant.ukPassport === 'yes' ? 'Yes' : 'No', yPosition);
    yPosition = addDataRow('Adverse Credit', applicant.adverseCredit === 'yes' ? 'Yes' : 'No', yPosition);
    if (applicant.adverseCredit === 'yes' && applicant.adverseCreditDetails) {
      yPosition = addDataRow('Adverse Credit Details', applicant.adverseCreditDetails, yPosition);
    }
    yPosition = addDataRow('Requires Guarantor', applicant.guarantorRequired === 'yes' ? 'Yes' : 'No', yPosition);
    if (hasPets() && data.additionalDetails?.petDetails) {
      yPosition = addDataRow('Pet Details', data.additionalDetails.petDetails, yPosition);
    }
  });

  // Data Sharing Section
  yPosition = addSectionHeader('Data Sharing', yPosition);
  yPosition = addDataRow('Accept Utilities', data.dataSharing?.utilities ? 'Yes' : 'No', yPosition);
  yPosition = addDataRow('Accept Insurance', data.dataSharing?.insurance ? 'Yes' : 'No', yPosition);

  // Signature Section
  yPosition = addSectionHeader('Signature', yPosition);
  yPosition = addDataRow('Full Name', `${data.applicants[0]?.firstName || ''} ${data.applicants[0]?.lastName || ''}`, yPosition);
  
  // Special signature row with actual signature image
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
  
  // Try to add actual signature image if it exists and is a data URL
  if (data.signature && data.signature.startsWith('data:image/')) {
    try {
      // Add the signature image
      const maxSignatureWidth = valueWidth - 10;
      const maxSignatureHeight = 15;
      doc.addImage(data.signature, 'PNG', 25 + labelWidth, yPosition + 5, maxSignatureWidth, maxSignatureHeight);
    } catch (error) {
      // Fallback to placeholder if image fails to load
      doc.setFillColor(243, 244, 246);
      doc.rect(25 + labelWidth, yPosition + 5, valueWidth - 10, 15, 'F');
      doc.setDrawColor(209, 213, 219);
      doc.rect(25 + labelWidth, yPosition + 5, valueWidth - 10, 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text('Digital Signature Applied', 25 + labelWidth + (valueWidth - 10) / 2, yPosition + 14, { align: 'center' });
    }
  } else {
    // Fallback placeholder
    doc.setFillColor(243, 244, 246);
    doc.rect(25 + labelWidth, yPosition + 5, valueWidth - 10, 15, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.rect(25 + labelWidth, yPosition + 5, valueWidth - 10, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Digital Signature Applied', 25 + labelWidth + (valueWidth - 10) / 2, yPosition + 14, { align: 'center' });
  }
  
  yPosition += signatureRowHeight;
  yPosition = addDataRow('Submitted At', formatSubmittedDate(data.submittedAt || ''), yPosition);

  return new Uint8Array(doc.output('arraybuffer'));
};
