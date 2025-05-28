
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
  
  // Helper function to add text with proper centering
  const addText = (text: string, x: number, y: number, maxWidth?: number, align: 'left' | 'center' = 'left'): number => {
    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      if (align === 'center') {
        lines.forEach((line: string, index: number) => {
          const textWidth = doc.getTextWidth(line);
          const centerX = (doc.internal.pageSize.width - textWidth) / 2;
          doc.text(line, centerX, y + (index * 6));
        });
      } else {
        doc.text(lines, x, y);
      }
      return y + (lines.length * 6);
    } else {
      if (align === 'center') {
        const textWidth = doc.getTextWidth(text);
        const centerX = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(text, centerX, y);
      } else {
        doc.text(text, x, y);
      }
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

  // Helper function to add a styled section header
  const addSectionHeader = (title: string) => {
    yPosition = checkNewPage(20);
    
    // Dark background header - matching preview exactly
    doc.setFillColor(31, 41, 55); // gray-800
    doc.rect(10, yPosition - 3, 190, 12, 'F');
    doc.setTextColor(255, 255, 255); // white text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(title, 0, yPosition + 4, 0, 'center'); // centered
    yPosition += 15;
    doc.setTextColor(0, 0, 0); // reset to black
  };

  // Helper function to add a subsection header
  const addSubSectionHeader = (title: string) => {
    yPosition = checkNewPage(12);
    doc.setFillColor(229, 231, 235); // gray-200
    doc.rect(10, yPosition - 3, 190, 12, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55); // gray-800
    yPosition = addText(title, 0, yPosition + 4, 0, 'center'); // centered
    yPosition += 10;
    doc.setTextColor(0, 0, 0); // reset to black
  };

  // Helper function to add a table row - matching preview styling exactly
  const addTableRow = (label: string, value: string, isOdd = false) => {
    yPosition = checkNewPage(12);
    
    // Alternating row colors - matching preview page exactly
    if (isOdd) {
      doc.setFillColor(249, 250, 251); // gray-50
      doc.rect(10, yPosition - 2, 190, 10, 'F');
    } else {
      doc.setFillColor(255, 255, 255); // white
      doc.rect(10, yPosition - 2, 190, 10, 'F');
    }
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55); // gray-800
    yPosition = addText(label, 15, yPosition + 3);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39); // gray-900
    yPosition = addText(value || '-', 80, yPosition - 6, 110);
    yPosition += 2;
    doc.setTextColor(0, 0, 0); // reset
  };

  // Header with logo and title - exactly like preview
  yPosition = checkNewPage(40);
  
  // Logo area (centered) - using the new logo
  doc.setFillColor(249, 115, 22); // orange-500 placeholder for logo
  doc.rect(85, yPosition - 5, 40, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('PALMER & PARTNERS', 0, yPosition + 5, 0, 'center'); // centered
  
  // Orange line exactly like preview
  doc.setFillColor(249, 115, 22); // orange-500
  doc.rect(10, yPosition + 5, 190, 1, 'F');
  yPosition += 20;
  
  // Main title - exactly like preview
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Tenancy Application', 0, yPosition, 0, 'center'); // centered
  yPosition += 20;

  // Property Details Section
  addSectionHeader('Property Details');
  let rowCount = 0;
  [
    ['Street Address', data.propertyPreferences.streetAddress || ''],
    ['Postcode', data.propertyPreferences.postcode || ''],
    ['Rental Amount', data.propertyPreferences.maxRent ? `£${data.propertyPreferences.maxRent}` : ''],
    ['Preferred Move-in Date', data.propertyPreferences.moveInDate || ''],
    ['Latest Move-in Date', data.propertyPreferences.latestMoveInDate || ''],
    ['Initial Tenancy Term', data.propertyPreferences.initialTenancyTerm || ''],
    ['Has Pets', data.additionalDetails.pets === 'yes' ? 'Yes' : 'No'],
    ['Under 18s', data.additionalDetails.under18Count || '0'],
    ['Under 18s Details', data.additionalDetails.childrenAges || ''],
    ['Conditions of Offer', data.additionalDetails.conditionsOfOffer || ''],
    ['Deposit Type', data.additionalDetails.depositType || '']
  ].forEach(([label, value], index) => {
    addTableRow(label, value, index % 2 === 1);
  });

  // Applicant sections
  data.applicants.forEach((applicant, index) => {
    addSectionHeader(`Applicant - #${index + 1}`);
    
    // Personal Details
    [
      ['First Name', applicant.firstName || ''],
      ['Last Name', applicant.lastName || ''],
      ['Date of Birth', applicant.dateOfBirth || ''],
      ['Email Address', applicant.email || ''],
      ['Mobile Number', applicant.phone || '']
    ].forEach(([label, value], rowIndex) => {
      addTableRow(label, value, rowIndex % 2 === 1);
    });

    // Employment Details subsection
    addSubSectionHeader('Employment Details');
    [
      ['Contract Type', applicant.employment || ''],
      ['Company Name', applicant.companyName || ''],
      ['Job Title', applicant.jobTitle || ''],
      ['Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : ''],
      ['Length of Service', applicant.lengthOfService || '']
    ].forEach(([label, value], rowIndex) => {
      addTableRow(label, value, rowIndex % 2 === 1);
    });

    // Current Property Details subsection
    addSubSectionHeader('Current Property Details');
    [
      ['Postcode', applicant.previousPostcode || ''],
      ['Street Address', applicant.previousAddress || ''],
      ['Move In Date', applicant.moveInDate || ''],
      ['Vacate Date', applicant.vacateDate || ''],
      ['Current Property Status', applicant.currentPropertyStatus || ''],
      ['Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '']
    ].forEach(([label, value], rowIndex) => {
      addTableRow(label, value, rowIndex % 2 === 1);
    });

    // Additional Information subsection
    addSubSectionHeader('Additional Information');
    [
      ['UK/ROI Passport', data.additionalDetails.ukPassport === 'yes' ? 'Yes' : 'No'],
      ['Adverse Credit', data.additionalDetails.adverseCredit === 'yes' ? 'Yes' : 'No'],
      ['Adverse Credit Details', data.additionalDetails.adverseCreditDetails || ''],
      ['Requires Guarantor', data.additionalDetails.guarantorRequired === 'yes' ? 'Yes' : 'No']
    ].forEach(([label, value], rowIndex) => {
      addTableRow(label, value, rowIndex % 2 === 1);
    });
  });

  // Data Sharing Section
  addSectionHeader('Data Sharing');
  [
    ['Accept Utilities', data.dataSharing.utilities ? 'Yes' : 'No'],
    ['Accept Insurance', data.dataSharing.insurance ? 'Yes' : 'No']
  ].forEach(([label, value], index) => {
    addTableRow(label, value, index % 2 === 1);
  });

  // Signature Section
  addSectionHeader('Signature');
  yPosition = checkNewPage(15);
  
  if (data.signature && data.signature.startsWith('data:image/')) {
    // For digital signatures, we'd need to embed the image
    // For now, just indicate it's a digital signature
    addTableRow('Signature Type', 'Digital Signature', false);
  } else {
    addTableRow('Full Name', data.signature || '', false);
    addTableRow('Signature', data.signature || '', true);
  }
  addTableRow('Submitted At', format(new Date(data.submittedAt), 'do MMMM yyyy - h:mm aa'), false);

  // Activity Log Section (if available)
  if (data.applicationId) {
    try {
      const { data: activityLogs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('application_id', data.applicationId)
        .order('created_at', { ascending: false });

      if (!error && activityLogs && activityLogs.length > 0) {
        addSectionHeader('History');
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        activityLogs.forEach((log: any, index: number) => {
          yPosition = checkNewPage(15);
          
          if (index % 2 === 1) {
            doc.setFillColor(249, 250, 251); // gray-50
            doc.rect(10, yPosition - 2, 190, 12, 'F');
          }
          
          const timestamp = format(new Date(log.created_at), 'do-MMM-yyyy h:mm aa');
          const action = log.action;
          const ipAddress = log.ip_address ? `IP Address: ${log.ip_address}` : '';
          
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(17, 24, 39); // gray-900
          yPosition = addText(action, 15, yPosition + 3);
          
          if (ipAddress) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(75, 85, 99); // gray-600
            yPosition = addText(ipAddress, 15, yPosition);
          }
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(107, 114, 128); // gray-500
          yPosition = addText(timestamp, 150, yPosition - (ipAddress ? 6 : 0));
          yPosition += 5;
        });
      }
    } catch (error) {
      console.error('Error fetching activity logs for PDF:', error);
    }
  }

  return doc.output('blob');
};

// Remove the old generateApplicationPDF function and replace with proper export
export const generateApplicationPDF = generatePdf;
