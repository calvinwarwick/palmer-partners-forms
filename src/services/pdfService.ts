
import jsPDF from 'jspdf';
import { Applicant, PropertyPreferences, AdditionalDetails } from '@/domain/types/Applicant';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface PdfData {
  applicants: Applicant[];
  propertyPreferences: PropertyPreferences;
  additionalDetails: AdditionalDetails;
  dataSharing: { utilities: boolean; insurance: boolean };
  signature: string;
  submittedAt: string;
  applicationId?: string;
}

export const generatePdf = async (data: PdfData): Promise<Blob> => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Helper function to add text
  const addText = (text: string, x: number, y: number, maxWidth?: number): number => {
    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * 6);
    } else {
      doc.text(text, x, y);
      return y + 6;
    }
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > 280) {
      doc.addPage();
      return 20;
    }
    return yPosition;
  };

  // Helper function to add a styled header
  const addHeader = (text: string, isMainTitle = false) => {
    yPosition = checkNewPage(20);
    
    if (isMainTitle) {
      // Palmer & Partners header
      doc.setFillColor(43, 43, 43); // Dark gray
      doc.rect(10, yPosition - 5, 190, 15, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      yPosition = addText('Palmer & Partners', 15, yPosition + 5);
      
      // Orange line
      doc.setFillColor(255, 165, 0); // Orange
      doc.rect(10, yPosition, 190, 2, 'F');
      yPosition += 15;
      
      // Main title
      doc.setTextColor(0, 0, 0); // Black text
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      yPosition = addText('Tenancy Application', 105, yPosition, null);
      yPosition += 15;
    } else {
      // Section headers with dark background
      doc.setFillColor(43, 43, 43); // Dark gray
      doc.rect(10, yPosition - 3, 190, 12, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(text, 15, yPosition + 4);
      yPosition += 15;
      doc.setTextColor(0, 0, 0); // Reset to black
    }
  };

  // Helper function to add a table row
  const addTableRow = (label: string, value: string, isOdd = false) => {
    yPosition = checkNewPage(12);
    
    // Alternating row colors
    if (isOdd) {
      doc.setFillColor(245, 245, 245); // Light gray
      doc.rect(10, yPosition - 2, 190, 10, 'F');
    }
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(label, 15, yPosition + 3);
    
    doc.setFont('helvetica', 'normal');
    yPosition = addText(value || '-', 80, yPosition - 6, 110);
    yPosition += 2;
  };

  // Title and header
  addHeader('', true);

  // Property Details Section
  addHeader('Property Details');
  let rowCount = 0;
  addTableRow('Street Address', data.propertyPreferences.streetAddress, rowCount++ % 2 === 1);
  addTableRow('Postcode', data.propertyPreferences.postcode, rowCount++ % 2 === 1);
  addTableRow('Rental Amount', `£${data.propertyPreferences.maxRent}`, rowCount++ % 2 === 1);
  addTableRow('Preferred Move-in Date', data.propertyPreferences.moveInDate, rowCount++ % 2 === 1);
  addTableRow('Latest Move-in Date', data.propertyPreferences.latestMoveInDate || '-', rowCount++ % 2 === 1);
  addTableRow('Initial Tenancy Term', data.propertyPreferences.initialTenancyTerm || '-', rowCount++ % 2 === 1);
  addTableRow('Has Pets', data.additionalDetails.pets === 'yes' ? 'Yes' : 'No', rowCount++ % 2 === 1);
  addTableRow('Under 18s', data.additionalDetails.under18Count || '0', rowCount++ % 2 === 1);
  addTableRow('Under 18s Details', data.additionalDetails.childrenAges || '-', rowCount++ % 2 === 1);
  addTableRow('Conditions of Offer', data.additionalDetails.conditionsOfOffer || '-', rowCount++ % 2 === 1);
  addTableRow('Deposit Type', data.additionalDetails.depositType || '-', rowCount++ % 2 === 1);

  // Applicant sections
  data.applicants.forEach((applicant, index) => {
    addHeader(`Applicant - #${index + 1}`);
    
    rowCount = 0;
    addTableRow('First Name', applicant.firstName, rowCount++ % 2 === 1);
    addTableRow('Last Name', applicant.lastName, rowCount++ % 2 === 1);
    addTableRow('Date of Birth', applicant.dateOfBirth, rowCount++ % 2 === 1);
    addTableRow('Email Address', applicant.email, rowCount++ % 2 === 1);
    addTableRow('Mobile Number', applicant.phone, rowCount++ % 2 === 1);

    // Employment Details subsection
    yPosition += 10;
    doc.setFillColor(220, 220, 220); // Light gray for subsection
    doc.rect(10, yPosition - 3, 190, 12, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Employment Details', 15, yPosition + 4);
    yPosition += 10;

    rowCount = 0;
    addTableRow('Contract Type', applicant.employment || '-', rowCount++ % 2 === 1);
    addTableRow('Company Name', applicant.companyName || '-', rowCount++ % 2 === 1);
    addTableRow('Job Title', applicant.jobTitle || '-', rowCount++ % 2 === 1);
    addTableRow('Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '-', rowCount++ % 2 === 1);
    addTableRow('Length of Service', applicant.lengthOfService || '-', rowCount++ % 2 === 1);

    // Current Property Details subsection
    yPosition += 10;
    doc.setFillColor(220, 220, 220);
    doc.rect(10, yPosition - 3, 190, 12, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Current Property Details', 15, yPosition + 4);
    yPosition += 10;

    rowCount = 0;
    addTableRow('Postcode', applicant.previousPostcode || '-', rowCount++ % 2 === 1);
    addTableRow('Street Address', applicant.previousAddress || '-', rowCount++ % 2 === 1);
    addTableRow('Move In Date', applicant.moveInDate || '-', rowCount++ % 2 === 1);
    addTableRow('Vacate Date', applicant.vacateDate || '-', rowCount++ % 2 === 1);
    addTableRow('Current Property Status', applicant.currentPropertyStatus || '-', rowCount++ % 2 === 1);
    addTableRow('Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '-', rowCount++ % 2 === 1);

    // Additional Information subsection
    yPosition += 10;
    doc.setFillColor(220, 220, 220);
    doc.rect(10, yPosition - 3, 190, 12, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Additional Information', 15, yPosition + 4);
    yPosition += 10;

    rowCount = 0;
    addTableRow('UK/ROI Passport', data.additionalDetails.ukPassport === 'yes' ? 'Yes' : 'No', rowCount++ % 2 === 1);
    addTableRow('Adverse Credit', data.additionalDetails.adverseCredit === 'yes' ? 'Yes' : 'No', rowCount++ % 2 === 1);
    addTableRow('Adverse Credit Details', data.additionalDetails.adverseCreditDetails || '-', rowCount++ % 2 === 1);
    addTableRow('Requires Guarantor', data.additionalDetails.guarantorRequired === 'yes' ? 'Yes' : 'No', rowCount++ % 2 === 1);
  });

  // Data Sharing Section
  addHeader('Data Sharing');
  rowCount = 0;
  addTableRow('Accept Utilities', data.dataSharing.utilities ? 'Yes' : 'No', rowCount++ % 2 === 1);
  addTableRow('Accept Insurance', data.dataSharing.insurance ? 'Yes' : 'No', rowCount++ % 2 === 1);

  // Signature Section
  addHeader('Signature');
  rowCount = 0;
  addTableRow('Full name', data.signature, rowCount++ % 2 === 1);
  addTableRow('Signature', data.signature, rowCount++ % 2 === 1);
  addTableRow('Submitted At', format(new Date(data.submittedAt), 'do MMMM yyyy - h:mm aa'), rowCount++ % 2 === 1);

  // Activity Log Section (if available)
  if (data.applicationId) {
    try {
      const { data: activityLogs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('application_id', data.applicationId)
        .order('created_at', { ascending: false });

      if (!error && activityLogs && activityLogs.length > 0) {
        addHeader('History');
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        activityLogs.forEach((log: any, index: number) => {
          yPosition = checkNewPage(15);
          
          if (index % 2 === 1) {
            doc.setFillColor(245, 245, 245);
            doc.rect(10, yPosition - 2, 190, 12, 'F');
          }
          
          const timestamp = format(new Date(log.created_at), 'do-MMM-yyyy h:mm aa');
          const action = log.action;
          const ipAddress = log.ip_address ? `IP Address: ${log.ip_address}` : '';
          
          yPosition = addText(action, 15, yPosition + 3);
          yPosition = addText(ipAddress, 15, yPosition);
          yPosition = addText(timestamp, 150, yPosition - 6);
          yPosition += 5;
        });
      }
    } catch (error) {
      console.error('Error fetching activity logs for PDF:', error);
    }
  }

  return doc.output('blob');
};

// Export the correct function name for backward compatibility
export const generateApplicationPDF = (data: any): Uint8Array => {
  // This is a simplified synchronous version for the existing code
  const doc = new jsPDF();
  doc.text('Application PDF', 20, 20);
  return new Uint8Array(doc.output('arraybuffer'));
};
