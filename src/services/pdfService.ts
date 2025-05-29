
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

export const generatePdf = async (data: PdfData): Promise<Uint8Array> => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Set default font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
  // Helper function to add text
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

  // Helper function to add a black header section
  const addSectionHeader = (title: string) => {
    yPosition = checkNewPage(20);
    
    // Black header background
    doc.setFillColor(0, 0, 0);
    doc.rect(20, yPosition - 5, 170, 12, 'F');
    
    // White text, centered
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(title, 0, yPosition + 3, 0, 'center');
    yPosition += 10;
    doc.setTextColor(0, 0, 0); // reset to black
    doc.setFont('helvetica', 'normal');
  };

  // Helper function to add subsection headers (Employment Details, etc.)
  const addSubsectionHeader = (title: string) => {
    yPosition = checkNewPage(12);
    
    // Light grey background for subsection
    doc.setFillColor(200, 200, 200);
    doc.rect(20, yPosition - 2, 170, 10, 'F');
    
    // Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(20, yPosition - 2, 170, 10, 'S');
    
    // Black text, centered, bold
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(title, 0, yPosition + 4, 0, 'center');
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
  };

  // Helper function to add a table row
  const addTableRow = (label: string, value: string) => {
    yPosition = checkNewPage(12);
    
    // Left column (label) - light grey background
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 2, 60, 10, 'F');
    
    // Right column (value) - white background  
    doc.setFillColor(255, 255, 255);
    doc.rect(80, yPosition - 2, 110, 10, 'F');
    
    // Borders
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(20, yPosition - 2, 60, 10, 'S'); // left cell
    doc.rect(80, yPosition - 2, 110, 10, 'S'); // right cell
    
    // Label text (left column) - bold
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(label, 23, yPosition + 3);
    
    // Value text (right column) - normal
    doc.setFont('helvetica', 'normal');
    const wrappedValue = doc.splitTextToSize(value || '-', 105);
    doc.text(wrappedValue, 83, yPosition + 3);
    
    yPosition += 10;
  };

  // Main title
  yPosition = checkNewPage(40);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Tenancy Application', 0, yPosition, 0, 'center');
  yPosition += 20;
  
  // Reset to normal font
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Property Details Section
  addSectionHeader('Property Details');
  
  const propertyRows = [
    ['Street Address', data.propertyPreferences.streetAddress || ''],
    ['Postcode', data.propertyPreferences.postcode || ''],
    ['Rental Amount', data.propertyPreferences.maxRent ? `£${data.propertyPreferences.maxRent}` : ''],
    ['Preferred Move-in Date', data.propertyPreferences.moveInDate || ''],
    ['Latest Move-in Date', data.propertyPreferences.latestMoveInDate || ''],
    ['Initial Tenancy Term', data.propertyPreferences.initialTenancyTerm || ''],
    ['Has Pets', data.additionalDetails.pets === 'yes' ? 'Yes' : 'No'],
    ['Under 18s', data.additionalDetails.under18Count || '0']
  ];

  // Only show Under 18s Details if there are under 18s and details exist
  if (data.additionalDetails.under18Count && parseInt(data.additionalDetails.under18Count) > 0 && data.additionalDetails.childrenAges) {
    propertyRows.push(['Under 18s Details', data.additionalDetails.childrenAges]);
  }

  propertyRows.push(
    ['Conditions of Offer', data.additionalDetails.conditionsOfOffer || ''],
    ['Deposit Type', data.additionalDetails.depositType || '']
  );

  propertyRows.forEach(([label, value]) => {
    addTableRow(label, value);
  });

  yPosition += 10;

  // Applicant sections
  data.applicants.forEach((applicant, index) => {
    yPosition = checkNewPage(40);
    
    addSectionHeader(`Applicant - #${index + 1}`);
    
    // Personal Details
    [
      ['First Name', applicant.firstName || ''],
      ['Last Name', applicant.lastName || ''],
      ['Date of Birth', applicant.dateOfBirth || ''],
      ['Email Address', applicant.email || ''],
      ['Mobile Number', applicant.phone || '']
    ].forEach(([label, value]) => {
      addTableRow(label, value);
    });

    // Employment Details subsection
    addSubsectionHeader('Employment Details');
    [
      ['Contract Type', applicant.employment || ''],
      ['Company Name', applicant.companyName || ''],
      ['Job Title', applicant.jobTitle || ''],
      ['Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : ''],
      ['Length of Service', applicant.lengthOfService || '']
    ].forEach(([label, value]) => {
      addTableRow(label, value);
    });

    // Current Property Details subsection
    addSubsectionHeader('Current Property Details');
    [
      ['Postcode', applicant.previousPostcode || ''],
      ['Street Address', applicant.previousAddress || ''],
      ['Move In Date', applicant.moveInDate || ''],
      ['Vacate Date', applicant.vacateDate || ''],
      ['Current Property Status', applicant.currentPropertyStatus || ''],
      ['Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '']
    ].forEach(([label, value]) => {
      addTableRow(label, value);
    });

    // Additional Information subsection
    addSubsectionHeader('Additional Information');
    
    const additionalInfoRows = [
      ['UK/ROI Passport', data.additionalDetails.ukPassport === 'yes' ? 'Yes' : 'No'],
      ['Adverse Credit', data.additionalDetails.adverseCredit === 'yes' ? 'Yes' : 'No']
    ];
    
    // Only show Adverse Credit Details if applicant has adverse credit
    if (data.additionalDetails.adverseCredit === 'yes' && data.additionalDetails.adverseCreditDetails) {
      additionalInfoRows.push(['Adverse Credit Details', data.additionalDetails.adverseCreditDetails]);
    }
    
    additionalInfoRows.push(['Requires Guarantor', data.additionalDetails.guarantorRequired === 'yes' ? 'Yes' : 'No']);
    
    // Add pet details if pets exist
    if (data.additionalDetails.pets === 'yes' && data.additionalDetails.petDetails) {
      additionalInfoRows.push(['Pet Details', data.additionalDetails.petDetails]);
    }
    
    additionalInfoRows.forEach(([label, value]) => {
      addTableRow(label, value);
    });

    yPosition += 10;
  });

  // Data Sharing Section
  addSectionHeader('Data Sharing');
  [
    ['Accept Utilities', data.dataSharing.utilities ? 'Yes' : 'No'],
    ['Accept Insurance', data.dataSharing.insurance ? 'Yes' : 'No']
  ].forEach(([label, value]) => {
    addTableRow(label, value);
  });

  yPosition += 10;

  // Signature Section
  addSectionHeader('Signature');
  
  if (data.signature && data.signature.startsWith('data:image/')) {
    addTableRow('Full name', data.applicants[0]?.firstName + ' ' + data.applicants[0]?.lastName || '');
    addTableRow('Signature', 'Digital Signature (Image)');
  } else {
    addTableRow('Full name', data.signature || '');
    addTableRow('Signature', data.signature || '');
  }
  addTableRow('Submitted At', format(new Date(data.submittedAt), 'do MMMM yyyy - h:mm aa'));

  // Activity Log Section (if available)
  if (data.applicationId) {
    try {
      const { data: activityLogs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('application_id', data.applicationId)
        .order('created_at', { ascending: false });

      if (!error && activityLogs && activityLogs.length > 0) {
        yPosition += 10;
        
        addSectionHeader('History');
        
        activityLogs.forEach((log: any) => {
          const timestamp = format(new Date(log.created_at), 'do-MMM-yyyy h:mm aa');
          const action = log.action;
          const ipAddress = log.ip_address ? `IP: ${log.ip_address}` : '';
          
          addTableRow(action, `${timestamp}${ipAddress ? ' - ' + ipAddress : ''}`);
        });
      }
    } catch (error) {
      console.error('Error fetching activity logs for PDF:', error);
    }
  }

  // Convert to Uint8Array
  const pdfBlob = doc.output('blob');
  const arrayBuffer = await pdfBlob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

// Export the main function
export const generateApplicationPDF = generatePdf;
