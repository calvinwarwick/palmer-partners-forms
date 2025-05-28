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

interface ActivityLog {
  id: string;
  action: string;
  user_identifier: string | null;
  ip_address: string | null;
  created_at: string;
  details: any;
}

export const generatePdf = async (data: PdfData): Promise<Blob> => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Helper function to add text with word wrapping
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

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Tenancy Application', 20, yPosition);
  yPosition += 10;

  // Personal Information Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  yPosition = checkNewPage(30);
  yPosition = addText('Personal Information', 20, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  data.applicants.forEach((applicant, index) => {
    yPosition = checkNewPage(40);
    
    doc.setFont('helvetica', 'bold');
    yPosition = addText(`Applicant ${index + 1}`, 20, yPosition);
    yPosition += 3;
    
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Name: ${applicant.firstName} ${applicant.lastName}`, 25, yPosition);
    yPosition = addText(`Email: ${applicant.email}`, 25, yPosition);
    yPosition = addText(`Phone: ${applicant.phone}`, 25, yPosition);
    yPosition = addText(`Date of Birth: ${applicant.dateOfBirth}`, 25, yPosition);
    yPosition = addText(`Current Address: ${applicant.currentAddress}`, 25, yPosition, 150);
    yPosition = addText(`Previous Address: ${applicant.previousAddress || 'N/A'}`, 25, yPosition, 150);
    yPosition = addText(`Employment Status: ${applicant.employmentStatus}`, 25, yPosition);
    
    if (applicant.employerName) {
      yPosition = addText(`Employer: ${applicant.employerName}`, 25, yPosition);
    }
    if (applicant.jobTitle) {
      yPosition = addText(`Job Title: ${applicant.jobTitle}`, 25, yPosition);
    }
    if (applicant.annualIncome) {
      yPosition = addText(`Annual Income: £${applicant.annualIncome}`, 25, yPosition);
    }
    
    yPosition += 5;
  });

  // Property Preferences Section
  yPosition = checkNewPage(40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Property Preferences', 20, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Property Address: ${data.propertyPreferences.streetAddress}`, 25, yPosition, 150);
  yPosition = addText(`Postcode: ${data.propertyPreferences.postcode}`, 25, yPosition);
  yPosition = addText(`Maximum Rent: £${data.propertyPreferences.maxRent}`, 25, yPosition);
  yPosition = addText(`Preferred Move-in Date: ${data.propertyPreferences.moveInDate}`, 25, yPosition);
  yPosition = addText(`Property Type: ${data.propertyPreferences.propertyType}`, 25, yPosition);
  yPosition = addText(`Bedrooms: ${data.propertyPreferences.bedrooms}`, 25, yPosition);
  yPosition += 10;

  // Additional Details Section
  yPosition = checkNewPage(40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Additional Details', 20, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Pets: ${data.additionalDetails.pets ? 'Yes' : 'No'}`, 25, yPosition);
  if (data.additionalDetails.petDetails) {
    yPosition = addText(`Pet Details: ${data.additionalDetails.petDetails}`, 25, yPosition, 150);
  }
  yPosition = addText(`Smoking: ${data.additionalDetails.smoking ? 'Yes' : 'No'}`, 25, yPosition);
  if (data.additionalDetails.additionalInfo) {
    yPosition = addText(`Additional Information:`, 25, yPosition);
    yPosition = addText(data.additionalDetails.additionalInfo, 25, yPosition, 150);
  }
  yPosition += 10;

  // Data Sharing Section
  yPosition = checkNewPage(25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Data Sharing Preferences', 20, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Share with Utilities: ${data.dataSharing.utilities ? 'Yes' : 'No'}`, 25, yPosition);
  yPosition = addText(`Share with Insurance: ${data.dataSharing.insurance ? 'Yes' : 'No'}`, 25, yPosition);
  yPosition += 10;

  // Signature Section
  yPosition = checkNewPage(25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Digital Signature', 20, yPosition);
  yPosition += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Signature: ${data.signature}`, 25, yPosition);
  yPosition = addText(`Submitted: ${format(new Date(data.submittedAt), 'MMMM dd, yyyy HH:mm')}`, 25, yPosition);
  yPosition += 15;

  // Activity Log Section
  if (data.applicationId) {
    try {
      const { data: activityLogs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('application_id', data.applicationId)
        .order('created_at', { ascending: false });

      if (!error && activityLogs && activityLogs.length > 0) {
        yPosition = checkNewPage(40);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        yPosition = addText('Activity Log', 20, yPosition);
        yPosition += 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        activityLogs.forEach((log: ActivityLog) => {
          yPosition = checkNewPage(15);
          
          const timestamp = format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss');
          yPosition = addText(`${timestamp} - ${log.action}`, 25, yPosition);
          
          if (log.user_identifier) {
            yPosition = addText(`  User: ${log.user_identifier}`, 25, yPosition);
          }
          
          if (log.ip_address) {
            yPosition = addText(`  IP: ${log.ip_address}`, 25, yPosition);
          }
          
          if (log.details && Object.keys(log.details).length > 0) {
            const detailsText = JSON.stringify(log.details, null, 2);
            yPosition = addText(`  Details: ${detailsText}`, 25, yPosition, 150);
          }
          
          yPosition += 3;
        });
      }
    } catch (error) {
      console.error('Error fetching activity logs for PDF:', error);
      // Continue without activity logs if there's an error
    }
  }

  return doc.output('blob');
};
