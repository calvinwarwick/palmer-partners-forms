
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export const sendApplicationEmailWithPDF = async (application: any): Promise<boolean> => {
  try {
    console.log('Starting email send process...');
    const primaryApplicant = application.applicants[0];
    
    if (!primaryApplicant?.email) {
      console.error('No primary applicant email found');
      return false;
    }
    
    console.log('Sending email to:', primaryApplicant.email);
    
    // Generate PDF using the same service that works for admin preview
    const pdfBase64 = await generateApplicationPDF({
      applicants: application.applicants,
      propertyPreferences: application.propertyPreferences,
      additionalDetails: application.additionalDetails,
      dataSharing: application.dataSharing,
      signature: application.signature,
      submittedAt: new Date().toISOString(),
      applicationId: 'APP-' + Date.now()
    });
    
    console.log('PDF generated, length:', pdfBase64.length);
    
    console.log('Attempting to send email with Resend...');
    const emailResponse = await resend.emails.send({
      from: "Palmer & Partners <submitted@forms.palmerpartners.uk>",
      to: [primaryApplicant.email],
      bcc: ["calvinwarwick+admin@gmail.com"],
      subject: "Tenancy Application Received - Palmer & Partners",
      html: `
        <div style="font-family: 'Lexend', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%); padding: 30px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Application Received</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #212121; margin-bottom: 20px;">Dear ${primaryApplicant.firstName} ${primaryApplicant.lastName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for submitting your tenancy application for <strong>${application.propertyPreferences.streetAddress}</strong>.
            </p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #212121; margin-top: 0;">Application Summary:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>Property: ${application.propertyPreferences.streetAddress}</li>
                <li>Number of Applicants: ${application.applicants.length}</li>
                <li>Preferred Move-in Date: ${application.propertyPreferences.moveInDate}</li>
                <li>Maximum Rent: £${application.propertyPreferences.maxRent}</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We'll review your application and get back to you within <strong style="color: #FF6F00;">2-3 business days</strong>.
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Please find your completed application form attached to this email for your records.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #FF6F00; color: white; padding: 15px 30px; border-radius: 6px; font-weight: bold;">
                Application Status: Processing
              </div>
            </div>
            
            <p style="color: #888; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>Palmer & Partners Team</strong>
            </p>
          </div>
        </div>
      `,
      attachments: [{
        filename: 'tenancy-application.pdf',
        content: pdfBase64,
        type: 'application/pdf'
      }]
    });

    console.log("Raw email response:", JSON.stringify(emailResponse, null, 2));
    
    if (emailResponse.error) {
      console.error("Resend API error details:", JSON.stringify(emailResponse.error, null, 2));
      return false;
    }
    
    if (emailResponse.data) {
      console.log("Email sent successfully!");
      console.log("Email ID:", emailResponse.data.id);
      return true;
    } else {
      console.error("No data or error in response:", emailResponse);
      return false;
    }
    
  } catch (error) {
    console.error("Caught error in sendApplicationEmailWithPDF:", error);
    return false;
  }
};

// Use the same PDF generation logic that works perfectly in the admin preview
const generateApplicationPDF = async (data: any): Promise<string> => {
  console.log('Generating PDF using the same logic as admin preview...');
  
  // Import jsPDF - this is available in Deno edge runtime
  const jsPDF = (await import('https://cdn.skypack.dev/jspdf')).default;
  
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

  // Header with logo placeholder - matching the demo exactly
  const headerHeight = 25;
  doc.setFillColor(33, 33, 33); // #212121 dark grey
  doc.rect(0, 0, 210, headerHeight, 'F');

  // Logo placeholder (white rectangle with text) - centered
  doc.setFillColor(255, 255, 255);
  doc.rect(85, 8, 40, 9, 'F');
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Palmer & Partners', 105, 14, { align: 'center' });

  // Orange bottom border
  doc.setFillColor(255, 111, 0); // #FF6F00 orange
  doc.rect(0, headerHeight, 210, 2, 'F');

  yPosition = headerHeight + 15;

  // Main title - matching the demo
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Tenancy Application', 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Helper function to add section header - matching the demo exactly
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

  // Helper function for subsection headers
  const addSubsectionHeader = (title: string, currentY: number) => {
    const y = checkPageBreak(currentY);
    
    doc.setFillColor(200, 200, 200);
    doc.rect(20, y, 170, 12, 'F');
    doc.setDrawColor(150, 150, 150);
    doc.rect(20, y, 170, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 105, y + 7, { align: 'center' });
    
    return y + 12;
  };

  // Helper function for data rows - matching the demo exactly
  const addDataRow = (label: string, value: string, currentY: number) => {
    const y = checkPageBreak(currentY);
    
    const labelWidth = 170 * 0.35;
    const valueWidth = 170 * 0.65;
    const rowHeight = 12;
    
    // Label column - matching the demo
    doc.setFillColor(243, 244, 246);
    doc.rect(20, y, labelWidth, rowHeight, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.5);
    doc.rect(20, y, labelWidth, rowHeight);
    
    // Value column - matching the demo
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

  // Helper function to format dates - matching the demo exactly
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

  // Property Details Section - matching the demo exactly
  yPosition = addSectionHeader('Property Details', yPosition);
  yPosition = addDataRow('Street Address', data.propertyPreferences?.streetAddress || '', yPosition);
  yPosition = addDataRow('Postcode', data.propertyPreferences?.postcode || '', yPosition);
  yPosition = addDataRow('Rental Amount', data.propertyPreferences?.maxRent ? `£${data.propertyPreferences.maxRent}` : '', yPosition);
  yPosition = addDataRow('Preferred Move-in Date', formatDate(data.propertyPreferences?.moveInDate || ''), yPosition);
  yPosition = addDataRow('Latest Move-in Date', formatDate(data.propertyPreferences?.latestMoveInDate || ''), yPosition);
  yPosition = addDataRow('Initial Tenancy Term', data.propertyPreferences?.initialTenancyTerm || '', yPosition);
  yPosition = addDataRow('Has Pets', data.additionalDetails?.pets ? 'Yes' : 'No', yPosition);
  yPosition = addDataRow('Under 18s', data.additionalDetails?.under18Count || '0', yPosition);
  if (data.additionalDetails?.under18Count && parseInt(data.additionalDetails.under18Count) > 0 && data.additionalDetails?.childrenAges) {
    yPosition = addDataRow('Under 18s Details', data.additionalDetails.childrenAges, yPosition);
  }
  yPosition = addDataRow('Additional Requests', data.additionalDetails?.additionalRequests || '', yPosition);
  yPosition = addDataRow('Deposit Type', data.additionalDetails?.depositType || '', yPosition);

  // Applicants Section - matching the demo exactly
  data.applicants.forEach((applicant: any, index: number) => {
    yPosition = addSectionHeader(`Applicant - #${index + 1}`, yPosition);
    
    // Personal Details
    yPosition = addDataRow('First Name', applicant.firstName || '', yPosition);
    yPosition = addDataRow('Last Name', applicant.lastName || '', yPosition);
    yPosition = addDataRow('Date of Birth', formatDate(applicant.dateOfBirth || ''), yPosition);
    yPosition = addDataRow('Email Address', applicant.email || '', yPosition);
    yPosition = addDataRow('Mobile Number', applicant.phone || '', yPosition);

    // Employment Details
    yPosition = addSubsectionHeader('Employment Details', yPosition);
    yPosition = addDataRow('Contract Type', applicant.employment || '', yPosition);
    yPosition = addDataRow('Company Name', applicant.companyName || '', yPosition);
    yPosition = addDataRow('Job Title', applicant.jobTitle || '', yPosition);
    yPosition = addDataRow('Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '', yPosition);
    yPosition = addDataRow('Length of Service', applicant.lengthOfService || '', yPosition);

    // Current Property Details
    yPosition = addSubsectionHeader('Current Property Details', yPosition);
    yPosition = addDataRow('Postcode', applicant.currentPostcode || applicant.previousPostcode || '', yPosition);
    yPosition = addDataRow('Street Address', applicant.currentAddress || applicant.previousAddress || '', yPosition);
    yPosition = addDataRow('Time at Address', applicant.timeAtAddress || 'N/A', yPosition);
    yPosition = addDataRow('Landlord Name', applicant.landlordName || 'N/A', yPosition);
    yPosition = addDataRow('Landlord Phone', applicant.landlordPhone || 'N/A', yPosition);
    yPosition = addDataRow('Rent Up to Date', applicant.rentUpToDate === 'yes' ? 'Yes' : 'No', yPosition);
    yPosition = addDataRow('Notice Period', applicant.noticePeriod || 'N/A', yPosition);
    yPosition = addDataRow('Current Property Status', applicant.currentPropertyStatus || '', yPosition);
    yPosition = addDataRow('Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '', yPosition);

    // Previous Property Details
    yPosition = addSubsectionHeader('Previous Property Details', yPosition);
    yPosition = addDataRow('Previous Address', applicant.previousAddress || '', yPosition);
    yPosition = addDataRow('Previous Postcode', applicant.previousPostcode || '', yPosition);
    yPosition = addDataRow('Move In Date', formatDate(applicant.moveInDate || ''), yPosition);
    yPosition = addDataRow('Vacate Date', formatDate(applicant.vacateDate || ''), yPosition);
    yPosition = addDataRow('Previous Landlord Name', applicant.previousLandlordName || 'N/A', yPosition);
    yPosition = addDataRow('Previous Landlord Phone', applicant.previousLandlordPhone || 'N/A', yPosition);

    // Additional Information
    yPosition = addSubsectionHeader('Additional Information', yPosition);
    yPosition = addDataRow('UK/ROI Passport', data.additionalDetails?.ukPassport === 'yes' ? 'Yes' : 'No', yPosition);
    yPosition = addDataRow('Adverse Credit', data.additionalDetails?.adverseCredit === 'yes' ? 'Yes' : 'No', yPosition);
    if (data.additionalDetails?.adverseCredit === 'yes' && data.additionalDetails?.adverseCreditDetails) {
      yPosition = addDataRow('Adverse Credit Details', data.additionalDetails.adverseCreditDetails, yPosition);
    }
    yPosition = addDataRow('Requires Guarantor', data.additionalDetails?.guarantorRequired === 'yes' ? 'Yes' : 'No', yPosition);
    if (data.additionalDetails?.pets && data.additionalDetails?.petDetails) {
      yPosition = addDataRow('Pet Details', data.additionalDetails.petDetails, yPosition);
    }

    // Guarantor Details
    if (applicant.guarantorAdded && applicant.guarantorName) {
      yPosition = addSubsectionHeader('Guarantor Details', yPosition);
      yPosition = addDataRow('Guarantor Name', applicant.guarantorName || '', yPosition);
      yPosition = addDataRow('Relationship', applicant.guarantorRelationship || '', yPosition);
    }
  });

  // Data Sharing Section - matching the demo exactly
  yPosition = addSectionHeader('Data Sharing', yPosition);
  yPosition = addDataRow('Accept Utilities', data.dataSharing?.utilities ? 'Yes' : 'No', yPosition);
  yPosition = addDataRow('Accept Insurance', data.dataSharing?.insurance ? 'Yes' : 'No', yPosition);

  // Signature Section - matching the demo exactly
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
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Digital Signature Applied', 25 + labelWidth + 5, yPosition + 14);
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(data.signature || 'Digital Signature Applied', 25 + labelWidth + 5, yPosition + 14);
  }
  
  yPosition += signatureRowHeight;
  
  // Submitted at
  const submittedDate = data.submittedAt ? new Date(data.submittedAt).toLocaleString() : new Date().toLocaleString();
  yPosition = addDataRow('Submitted At', submittedDate, yPosition);

  // Convert to base64
  const pdfOutput = doc.output('arraybuffer');
  const uint8Array = new Uint8Array(pdfOutput);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);
  
  console.log('PDF generated successfully using admin preview logic');
  return base64;
};
