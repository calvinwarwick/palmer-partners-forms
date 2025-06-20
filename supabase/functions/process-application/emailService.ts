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

  // Helper function to load image as base64
  const loadImageAsBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      return btoa(binary);
    } catch (error) {
      console.warn('Could not load image:', url, error);
      return '';
    }
  };

  // Header with logos - maintaining proper aspect ratio
  const headerHeight = 25;
  doc.setFillColor(33, 33, 33); // #212121 dark grey
  doc.rect(0, 0, 210, headerHeight, 'F');

  // Load and add the logos with proper aspect ratio
  try {
    const leftLogoBase64 = await loadImageAsBase64('https://c0c4d145-b715-4d36-855a-41890ccb2e58.lovableproject.com/lovable-uploads/8958574e-86f0-4482-9a99-322142a0f734.png');
    const rightLogoBase64 = await loadImageAsBase64('https://c0c4d145-b715-4d36-855a-41890ccb2e58.lovableproject.com/lovable-uploads/fb64eebc-b467-4dd1-b635-6d1817b04c67.png');
    
    if (leftLogoBase64) {
      // Maintain aspect ratio for left logo (text logo is wider)
      const leftLogoWidth = 35;
      const leftLogoHeight = 12;
      doc.addImage(`data:image/png;base64,${leftLogoBase64}`, 'PNG', 10, 6.5, leftLogoWidth, leftLogoHeight);
    }
    
    if (rightLogoBase64) {
      // Maintain aspect ratio for right logo (P logo is more square)
      const rightLogoWidth = 15;
      const rightLogoHeight = 15;
      doc.addImage(`data:image/png;base64,${rightLogoBase64}`, 'PNG', 185, 5, rightLogoWidth, rightLogoHeight);
    }
  } catch (error) {
    console.warn('Could not add logos, using text fallback');
    // Fallback to text if logos fail to load
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Palmer', 25, 16);
    doc.setTextColor(255, 111, 0);
    doc.text('&', 55, 16);
    doc.setTextColor(255, 255, 255);
    doc.text('Partners', 65, 16);
  }

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

  // Add Terms and Conditions - properly styled in table format
  yPosition = checkPageBreak(yPosition + 20);
  yPosition = addSectionHeader('Terms and Conditions', yPosition);
  
  // Create a table cell for terms and conditions
  const termsY = checkPageBreak(yPosition);
  const termsHeight = 180; // Increased height for better spacing
  
  // Terms cell background
  doc.setFillColor(255, 255, 255);
  doc.rect(20, termsY, 170, termsHeight, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(20, termsY, 170, termsHeight);

  const termsText = `By submitting this application, you agree to the following terms and conditions:

If your offer is accepted by the landlord of your chosen property, the "Holding Deposit" will become payable. Upon receipt of this payment Palmer & Partners will commence the referencing process. This is usually done via an online form sent to your email address. This form must be completed within 72 hours to avoid the failure of your tenancy application.

Important: all rent, and deposit must be paid in full and received by Palmer & Partners in cleared funds prior to the start of your tenancy.

Holding Deposit:
Upon acceptance of your application by the landlord of your chosen property, a holding deposit equal to 1 weeks' rent will be taken; this amount will be offset against the total deposit owed.

Referencing Information:
Before being able to advise our landlord to grant a tenancy by signing a tenancy agreement, Palmer & Partners will need to complete a full reference check on any proposed tenant named overleaf. We use an independent reference provider to carry out this service. A successful reference check is dependent on, but not limited to, the following criteria:

• Named tenants must a combined minimum UK based annual salary greater than 30 x monthly rent (excluding bonus/commission). Alternatively, if a tenant has UK based savings in excess of this sum and they have been in place for over 3 months, there are circumstances where this can be considered in lieu of income.
• If you are self-employed, you must have at least 2 completed tax years of accounts confirming average annual income greater than 30 x monthly rent.
• Any guarantor must earn in excess of 36 x monthly rent per year or have UK based savings in excess of this sum (these savings must have been in place for over 3 months).
• Named tenants must have no County Court Judgements (CCJ) or Bankruptcy and not be in an Individual Voluntary Arrangement (IVA) or similar agreement.
• A successful "previous landlord reference" where your previous landlord/agent must confirm that you have always paid your rent on time, kept the property in good order and that you are free to leave the tenancy.

Should a tenant or guarantor fail a credit check due to inaccurate or misleading information, fail to fill in the referencing forms within the stipulated time frame or withdraw from the application process for any reason, the above "Holding Deposit" is non-refundable. Should the landlord withdraw from the application process prior to the start date of the tenancy, any deposit or rent paid will be refunded to the tenant in full.

Change of Occupancy:
If the tenant wishes to change the identity of any tenant named on the current tenancy agreement, upon receipt of consent from the landlord, Palmer & Partners will draw up a new tenancy agreement to be signed by all parties. An administration charge of £50.00 + VAT (£60.00 Inc. VAT) will be charged for this service. Any new reference required will be charged at £50.00 + VAT (£60.00 Inc. VAT). Additionally, there will be a charge of £50.00 + VAT (£60.00 Inc. VAT) to re-register any Deposit in the new tenant's name(s).

Missed Appointments:
In the event that an appointment is missed by the tenant (e.g., where it has been arranged that a tenant will be present to allow a contractor to access the property), any charges levied to the landlord or agent by a third party for this missed appointment will be passed directly on to the tenant.

Consequences of Early Termination:
If the tenant wishes to terminate the tenancy prior to the end of a fixed term, upon receiving written permission from the landlord (such permission does not have to be granted), the tenant will remain liable for all rent, bills, charges and costs payable under the terms of the contract until the term expires of the property is re-let, whichever is earlier. Should the property be re-let during the fixed term, the tenant will also be responsible for any remarketing fees that have been or will be incurred by the landlord for finding a new tenant (usually a sum equal to one month's rent per year or part year of the tenancy remaining) as well as any costs incurred by the landlord in having to pay for additional referencing or obtaining a new Inventory/Schedule of Condition report. Furthermore, the tenant is responsible for any other reasonable costs (e.g., telephone lines, satellite television contracts, TV licensing, cleaning, administration fees, etc.) incurred until the end of the term or until when the property is re-let. For the avoidance of doubt, this clause shall not take effect if the tenant is operating a pre-agreed "break clause" contained in the contract.

Right to Rent Check:
Under the Immigration Act 2014, Palmer & Partners are required to check that all tenants have a legal "Right to Rent" in the UK. The tenant must provide us with original documents as proof of their "Right to Rent". If the tenant is a resident of the UK, a passport will be sufficient proof. However, if the tenant is not a resident in the UK, additional documentation or "share code" will be required; a list of admissible documents is available upon request.

Management of the Property:
You will be advised at the start of your tenancy who is managing the property i.e., Palmer & Partners, the landlord or a 3rd party. Where the property is managed by Palmer & Partners, we will need to obtain the landlord's consent before authorising or arranging any repair.

When we manage a property AND hold keys, we can provide access to our contractors (with your prior permission). However, where we do NOT hold keys or a contractor is unable to collect keys, it is the tenant's responsibility to provide access.

Insurance:
It is the tenant's responsibility to insure their personal belongings with a reputable insurer for the duration of the tenancy. Palmer & Partners work alongside two financial services companies: Colchester Mortgages and Ipswich Mortgages. We will ask the appropriate company (based on the property location) to contact you to discuss your insurance options. Any data passed to the above company will be held in line with their GDPR procedures.

Utilities:
If your new property is managed by Palmer & Partners, we may disclose your name and contact information to any incumbent utility providers, water company and local authority. This may be done directly or via One Utility Bill Ltd (OUB). OUB will contact you on or around your move-in day to inform you of who currently supplies the utilities to your new home. Additionally, in line with the tenancy start date, OUB will transfer the Council Tax and water account into your name. Furthermore, OUB, existing utility suppliers and the local authority may contact you directly to discuss their services, products and prices. OUB will only use any tenants' details for the purposes of utility switching and not in any other way. Any data passed to OUB, or incumbent utility provider will be held in line with their GDPR procedures.

Taxation:
If rent is paid directly to the landlord's bank account and the landlord is resident overseas, the tenant will be responsible for applying the provisions of the HM Revenue and Customs Non-Residential Landlords scheme for taxing UK income and should ask for advice on this. This provision does NOT apply where rent is paid to Palmer & Partners.

Data Protection:
Palmer & Partners are fully compliant with all relevant Data Protection and G.D.P.R. legislation. Palmer & Partners reserve the right to pass on any relevant information held on you (current and future contact information, referencing results and tenancy performance details) to your landlord, local authority, utility companies, tenancy deposit schemes, debt collection agencies or the police.

Complaints Procedure:
Should a tenant/applicant have any problems with Palmer & Partners' services you should write to the branch manager. This complaint will be acknowledged within 3 working days of receipt and an investigation undertaken. A formal written outcome of the investigation will be sent to you. If you remain dissatisfied, you should write to the Managing Director – the same time limits apply. Following the Managing Director's investigation, a written statement expressing Palmer & Partners' final view will be sent to you, including any offer made. This letter will confirm that, should still remain dissatisfied, you are entitled to refer the matter to The Property Ombudsman (TPO) for review within six months. The TPO will only review complaints made by consumers and only once the in-house complaints procedure has been completed.`;

  // Style the terms text with small font and proper line height
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7); // Smaller font size
  doc.setTextColor(0, 0, 0);
  
  const lines = doc.splitTextToSize(termsText, 160); // Narrower width for padding
  let currentTermsY = termsY + 8; // Start with padding from top
  
  for (let i = 0; i < lines.length; i++) {
    if (currentTermsY > termsY + termsHeight - 8) {
      // Need new page for terms continuation
      doc.addPage();
      currentTermsY = 20;
      
      // Continue terms cell on new page
      doc.setFillColor(255, 255, 255);
      doc.rect(20, currentTermsY - 8, 170, 200, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(20, currentTermsY - 8, 170, 200);
    }
    
    doc.text(lines[i], 25, currentTermsY); // Left padding of 5 units
    currentTermsY += 3; // Reduced line height for compact appearance
  }

  // Convert to base64
  const pdfOutput = doc.output('arraybuffer');
  const uint8Array = new Uint8Array(pdfOutput);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);
  
  console.log('PDF generated successfully with logos, exact terms, and removed Previous Property Details');
  return base64;
};
