
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

  // Helper function to format currency
  const formatCurrency = (amount: string | number) => {
    if (!amount) return '';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `£${num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper function to format phone numbers in UK format
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    // Format as UK mobile number
    if (digits.length === 11 && digits.startsWith('07')) {
      return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
    return phone; // Return original if not standard UK mobile
  };

  // Header with logos - matching your reference image exactly
  const headerHeight = 25;
  doc.setFillColor(33, 33, 33); // #212121 dark grey
  doc.rect(0, 0, 210, headerHeight, 'F');

  // Add Palmer & Partners text in white (since we can't load external images in Deno)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Palmer', 25, 16);
  
  // Add & in orange
  doc.setTextColor(255, 111, 0);
  doc.text('&', 55, 16);
  
  // Add Partners in white
  doc.setTextColor(255, 255, 255);
  doc.text('Partners', 65, 16);

  // Orange bottom border
  doc.setFillColor(255, 111, 0); // #FF6F00 orange
  doc.rect(0, headerHeight, 210, 2, 'F');

  yPosition = headerHeight + 15;

  // Main title - matching your reference
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Tenancy Application', 105, yPosition, { align: 'center' });
  yPosition += 20;

  // Helper function to add section header - matching your reference exactly
  const addSectionHeader = (title: string, currentY: number) => {
    const y = checkPageBreak(currentY + 5);
    
    doc.setFillColor(33, 33, 33);
    doc.rect(20, y, 170, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, y + 8, { align: 'center' });
    
    return y + 12;
  };

  // Helper function for data rows - matching your reference exactly
  const addDataRow = (label: string, value: string, currentY: number) => {
    const y = checkPageBreak(currentY);
    
    const labelWidth = 170 * 0.4;
    const valueWidth = 170 * 0.6;
    const rowHeight = 10;
    
    // Label column - light grey background
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y, labelWidth, rowHeight, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(20, y, labelWidth, rowHeight);
    
    // Value column - white background
    doc.setFillColor(255, 255, 255);
    doc.rect(20 + labelWidth, y, valueWidth, rowHeight, 'F');
    doc.rect(20 + labelWidth, y, valueWidth, rowHeight);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(label, 22, y + 6);
    
    doc.text(value || '-', 22 + labelWidth, y + 6);
    
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

  // Property Details Section - matching your reference exactly
  yPosition = addSectionHeader('Property Details', yPosition);
  yPosition = addDataRow('Street Address', data.propertyPreferences?.streetAddress || '', yPosition);
  yPosition = addDataRow('Postcode', data.propertyPreferences?.postcode || '', yPosition);
  yPosition = addDataRow('Rental Amount', data.propertyPreferences?.maxRent ? formatCurrency(data.propertyPreferences.maxRent) : '', yPosition);
  yPosition = addDataRow('Preferred Move-in Date', formatDate(data.propertyPreferences?.moveInDate || ''), yPosition);
  yPosition = addDataRow('Latest Move-in Date', formatDate(data.propertyPreferences?.latestMoveInDate || ''), yPosition);
  yPosition = addDataRow('Initial Tenancy Term', data.propertyPreferences?.initialTenancyTerm || '', yPosition);
  yPosition = addDataRow('Has Pets', data.additionalDetails?.pets ? 'Yes' : 'No', yPosition);
  
  // Under 18s - show "None" if 0
  const under18Count = data.additionalDetails?.under18Count;
  const under18Display = (!under18Count || under18Count === '0') ? 'None' : under18Count;
  yPosition = addDataRow('Under 18s', under18Display, yPosition);
  
  if (data.additionalDetails?.under18Count && parseInt(data.additionalDetails.under18Count) > 0 && data.additionalDetails?.childrenAges) {
    yPosition = addDataRow('Under 18s Details', data.additionalDetails.childrenAges, yPosition);
  }
  yPosition = addDataRow('Conditions of Offer', data.additionalDetails?.additionalRequests || '-', yPosition);
  
  // Deposit Type - format as requested
  let depositDisplay = '';
  if (data.additionalDetails?.depositType === 'traditional') {
    depositDisplay = 'Traditional deposit';
  } else if (data.additionalDetails?.depositType === 'replacement') {
    depositDisplay = 'Deposit replacement';
  } else {
    depositDisplay = data.additionalDetails?.depositType || '';
  }
  yPosition = addDataRow('Deposit Type', depositDisplay, yPosition);

  // Applicants Section
  data.applicants.forEach((applicant: any, index: number) => {
    yPosition = addSectionHeader(`Applicant - #${index + 1}`, yPosition);
    
    // Personal Details
    yPosition = addDataRow('First Name', applicant.firstName || '', yPosition);
    yPosition = addDataRow('Last Name', applicant.lastName || '', yPosition);
    yPosition = addDataRow('Date of Birth', formatDate(applicant.dateOfBirth || ''), yPosition);
    yPosition = addDataRow('Email Address', applicant.email || '', yPosition);
    yPosition = addDataRow('Mobile Number', formatPhoneNumber(applicant.phone || ''), yPosition);

    // Employment Details
    yPosition = addSectionHeader('Employment Details', yPosition);
    yPosition = addDataRow('Contract Type', applicant.employment || '', yPosition);
    yPosition = addDataRow('Company Name', applicant.companyName || '', yPosition);
    yPosition = addDataRow('Job Title', applicant.jobTitle || '', yPosition);
    yPosition = addDataRow('Annual Salary', applicant.annualIncome ? formatCurrency(applicant.annualIncome) : '', yPosition);
    yPosition = addDataRow('Length of Service', applicant.lengthOfService || '', yPosition);

    // Current Property Details
    yPosition = addSectionHeader('Current Property Details', yPosition);
    yPosition = addDataRow('Postcode', applicant.currentPostcode || applicant.previousPostcode || '', yPosition);
    yPosition = addDataRow('Street Address', applicant.currentAddress || applicant.previousAddress || '', yPosition);
    yPosition = addDataRow('Time at Address', applicant.timeAtAddress || 'N/A', yPosition);
    yPosition = addDataRow('Current Property Status', applicant.currentPropertyStatus || '', yPosition);
    yPosition = addDataRow('Current Rental Amount', applicant.currentRentalAmount ? formatCurrency(applicant.currentRentalAmount) : '', yPosition);

    // Previous Property Details
    yPosition = addSectionHeader('Previous Property Details', yPosition);
    yPosition = addDataRow('Previous Address', applicant.previousAddress || '', yPosition);
    yPosition = addDataRow('Previous Postcode', applicant.previousPostcode || '', yPosition);
    yPosition = addDataRow('Move In Date', formatDate(applicant.moveInDate || ''), yPosition);
    yPosition = addDataRow('Vacate Date', formatDate(applicant.vacateDate || ''), yPosition);
    yPosition = addDataRow('Previous Landlord Name', applicant.previousLandlordName || 'N/A', yPosition);
    yPosition = addDataRow('Previous Landlord Phone', formatPhoneNumber(applicant.previousLandlordPhone || ''), yPosition);

    // Additional Information
    yPosition = addSectionHeader('Additional Information', yPosition);
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
      yPosition = addSectionHeader('Guarantor Details', yPosition);
      yPosition = addDataRow('Guarantor Name', applicant.guarantorName || '', yPosition);
      yPosition = addDataRow('Relationship', applicant.guarantorRelationship || '', yPosition);
    }
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
  const labelWidth = 170 * 0.4;
  const valueWidth = 170 * 0.6;
  const signatureRowHeight = 20;
  
  // Signature label
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPosition, labelWidth, signatureRowHeight, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, yPosition, labelWidth, signatureRowHeight);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('Signature', 22, yPosition + 6);
  
  // Signature value
  doc.setFillColor(255, 255, 255);
  doc.rect(20 + labelWidth, yPosition, valueWidth, signatureRowHeight, 'F');
  doc.rect(20 + labelWidth, yPosition, valueWidth, signatureRowHeight);
  
  // Add signature if it exists
  if (data.signature && data.signature.startsWith('data:image/')) {
    try {
      const maxSignatureWidth = valueWidth - 10;
      const maxSignatureHeight = 12;
      doc.addImage(data.signature, 'PNG', 22 + labelWidth, yPosition + 4, maxSignatureWidth, maxSignatureHeight);
    } catch (error) {
      console.warn('Could not add signature image, using placeholder');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('Digital Signature Applied', 22 + labelWidth, yPosition + 12);
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(data.signature || 'Digital Signature Applied', 22 + labelWidth, yPosition + 12);
  }
  
  yPosition += signatureRowHeight;
  
  // Submitted at
  const submittedDate = data.submittedAt ? new Date(data.submittedAt).toLocaleString() : new Date().toLocaleString();
  yPosition = addDataRow('Submitted At', submittedDate, yPosition);

  // Add Terms and Conditions
  yPosition = checkPageBreak(yPosition + 20);
  yPosition = addSectionHeader('Terms and Conditions', yPosition);
  
  const termsText = `By submitting this application, you agree to the following terms and conditions:

1. All information provided is true and accurate to the best of your knowledge.
2. You consent to credit and reference checks being carried out.
3. You understand that providing false information may result in rejection of your application.
4. You agree to pay the first month's rent and deposit upon acceptance of your application.
5. You understand that this application does not guarantee tenancy of the property.
6. Personal data will be processed in accordance with GDPR and our Privacy Policy.
7. You consent to being contacted regarding your application and related services.
8. Any holding deposit paid is subject to the terms of the Tenant Fees Act 2019.
9. You agree to provide additional documentation if requested.
10. This application is valid for 30 days from submission date.

For full terms and conditions, please visit our website or contact our office.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  
  const lines = doc.splitTextToSize(termsText, 170);
  for (let i = 0; i < lines.length; i++) {
    yPosition = checkPageBreak(yPosition + 5);
    doc.text(lines[i], 20, yPosition);
    yPosition += 5;
  }

  // Convert to base64
  const pdfOutput = doc.output('arraybuffer');
  const uint8Array = new Uint8Array(pdfOutput);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);
  
  console.log('PDF generated successfully with proper styling and terms');
  return base64;
};
