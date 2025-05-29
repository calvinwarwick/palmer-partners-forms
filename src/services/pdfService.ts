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
  
  // Set default font to Helvetica (closest to Lexend) with 12px size
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
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

  // Helper function to add a styled section header (H4 styling) with 10px top margin
  const addSectionHeader = (title: string) => {
    yPosition = checkNewPage(30); // Increased space for margin
    
    // Add 10px top margin
    yPosition += 10;
    
    // H4 styling with rounded corners and border
    doc.setFillColor(32, 32, 32); // #202020
    doc.roundedRect(15, yPosition - 5, 180, 15, 2.5, 2.5, 'F'); // rounded corners top only
    
    // Black border bottom
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2);
    doc.line(15, yPosition + 10, 195, yPosition + 10);
    
    // White text, centered, size 12, Lexend font (Helvetica fallback)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(title, 0, yPosition + 3, 0, 'center');
    yPosition += 15;
    doc.setTextColor(0, 0, 0); // reset to black
    doc.setFontSize(12); // reset to 12px
  };

  // Helper function to add subsection headers within tables (Employment Details, etc.)
  const addTableSubsectionRow = (title: string) => {
    yPosition = checkNewPage(12);
    
    // Section header row styling - light grey background
    doc.setFillColor(216, 216, 216); // rgb(216, 216, 216)
    doc.rect(15, yPosition - 2, 180, 10, 'F');
    
    // Border for table cell
    doc.setDrawColor(221, 221, 221); // #ddd
    doc.setLineWidth(0.5);
    doc.rect(15, yPosition - 2, 180, 10, 'S');
    
    // Black text, centered, bold, size 10
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(title, 0, yPosition + 4, 0, 'center');
    yPosition += 8;
    doc.setFontSize(12); // reset to 12px
    doc.setFont('helvetica', 'normal'); // reset to normal
  };

  // Helper function to add a table row with borders
  const addTableRow = (label: string, value: string) => {
    yPosition = checkNewPage(12);
    
    // Left column (th) with #f2f2f2 background - 25% width
    doc.setFillColor(242, 242, 242); // #f2f2f2
    doc.rect(15, yPosition - 2, 45, 10, 'F'); // 25% of 180px = 45px
    
    // Right column (td) with white background - 75% width  
    doc.setFillColor(255, 255, 255); // white
    doc.rect(60, yPosition - 2, 135, 10, 'F'); // 75% of 180px = 135px
    
    // Borders for both cells (#ddd)
    doc.setDrawColor(221, 221, 221); // #ddd
    doc.setLineWidth(0.5);
    doc.rect(15, yPosition - 2, 45, 10, 'S'); // left cell border
    doc.rect(60, yPosition - 2, 135, 10, 'S'); // right cell border
    
    // Label text (left column) - bold, 12px Lexend (Helvetica fallback)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    yPosition = addText(label, 23, yPosition + 3); // 8px padding from left
    
    // Value text (right column) - normal, 12px Lexend (Helvetica fallback)
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    yPosition = addText(value || '-', 68, yPosition - 6, 125); // 8px padding from left edge of right column
    yPosition += 2;
  };

  // Header with logo and title
  yPosition = checkNewPage(40);
  
  // Logo area with grey background
  doc.setFillColor(229, 231, 235); // gray-200 background
  doc.rect(10, yPosition - 8, 190, 25, 'F');
  
  // Logo placeholder - we'll use text since we can't easily load external images in jsPDF
  doc.setFillColor(249, 115, 22); // orange-500 for logo background
  doc.rect(80, yPosition - 5, 50, 18, 'F');
  
  // Logo text centered in orange box
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('PALMER & PARTNERS', 0, yPosition + 5, 0, 'center');
  
  // Orange line
  doc.setFillColor(249, 115, 22); // orange-500
  doc.rect(10, yPosition + 8, 190, 1, 'F');
  yPosition += 20;
  
  // Main title - 20px for title, then reset to 12px Lexend
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Tenancy Application', 0, yPosition, 0, 'center');
  yPosition += 20;
  
  // Reset to 12px Lexend for body text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Property Details Section
  addSectionHeader('Property Details');
  
  // Property details table rows
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

  // Only show Under 18s Details if there are more than 1 under 18s
  if (data.additionalDetails.under18Count && parseInt(data.additionalDetails.under18Count) > 1 && data.additionalDetails.childrenAges) {
    propertyRows.push(['Under 18s Details', data.additionalDetails.childrenAges]);
  }

  propertyRows.push(
    ['Conditions of Offer', data.additionalDetails.conditionsOfOffer || ''],
    ['Deposit Type', data.additionalDetails.depositType || '']
  );

  propertyRows.forEach(([label, value]) => {
    addTableRow(label, value);
  });

  // Page break after property details
  doc.addPage();
  yPosition = 20;

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
    ].forEach(([label, value]) => {
      addTableRow(label, value);
    });

    // Employment Details subsection
    addTableSubsectionRow('Employment Details');
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
    addTableSubsectionRow('Current Property Details');
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
    addTableSubsectionRow('Additional Information');
    
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

    // Page break after each applicant
    doc.addPage();
    yPosition = 20;
  });

  // Data Sharing Section
  addSectionHeader('Data Sharing');
  [
    ['Accept Utilities', data.dataSharing.utilities ? 'Yes' : 'No'],
    ['Accept Insurance', data.dataSharing.insurance ? 'Yes' : 'No']
  ].forEach(([label, value]) => {
    addTableRow(label, value);
  });

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

  // Page break before terms
  doc.addPage();
  yPosition = 20;

  // Terms & Conditions Section with 10px font size
  addSectionHeader('Terms and conditions');
  yPosition = checkNewPage(20);
  
  const termsText = `Terms & Conditions
If your offer is accepted by the landlord of your chosen property, the "Holding Deposit" will become payable. Upon receipt of this payment Palmer & Partners will commence the referencing process. This is usually done via an online form sent to your email address. This form must be completed within 72 hours to avoid the failure of your tenancy application.

Important: all rent, and deposit must be paid in full and received by Palmer & Partners in cleared funds prior to the start of your tenancy.

Holding Deposit
Upon acceptance of your application by the landlord of your chosen property, a holding deposit equal to 1 weeks' rent will be taken; this amount will be offset against the total deposit owed.

Referencing Information
Before being able to advise our landlord to grant a tenancy by signing a tenancy agreement, Palmer & Partners will need to complete a full reference check on any proposed tenant named overleaf. We use an independent reference provider to carry out this service. A successful reference check is dependent on, but not limited to, the following criteria:

• Named tenants must a combined minimum UK based annual salary greater than 30 x monthly rent (excluding bonus/commission). Alternatively, if a tenant has UK based savings in excess of this sum and they have been in place for over 3 months, there are circumstances where this can be considered in lieu of income.
• If you are self-employed, you must have at least 2 completed tax years of accounts confirming average annual income greater than 30 x monthly rent.
• Any guarantor must earn in excess of 36 x monthly rent per year or have UK based savings in excess of this sum (these savings must have been in place for over 3 months).
• Named tenants must have no County Court Judgements (CCJ) or Bankruptcy and not be in an Individual Voluntary Arrangement (IVA) or similar agreement.
• A successful "previous landlord reference" where your previous landlord/agent must confirm that you have always paid your rent on time, kept the property in good order and that you are free to leave the tenancy.

Should a tenant or guarantor fail a credit check due to inaccurate or misleading information, fail to fill in the referencing forms within the stipulated time frame or withdraw from the application process for any reason, the above "Holding Deposit" is non-refundable. Should the landlord withdraw from the application process prior to the start date of the tenancy, any deposit or rent paid will be refunded to the tenant in full.

Change of Occupancy
If the tenant wishes to change the identity of any tenant named on the current tenancy agreement, upon receipt of consent from the landlord, Palmer & Partners will draw up a new tenancy agreement to be signed by all parties. An administration charge of £50.00 + VAT (£60.00 Inc. VAT) will be charged for this service. Any new reference required will be charged at £50.00 + VAT (£60.00 Inc. VAT). Additionally, there will be a charge of £50.00 + VAT (£60.00 Inc. VAT) to re-register any Deposit in the new tenant's name(s).

Missed Appointments
In the event that an appointment is missed by the tenant (e.g., where it has been arranged that a tenant will be present to allow a contractor to access the property), any charges levied to the landlord or agent by a third party for this missed appointment will be passed directly on to the tenant.

Consequences of Early Termination
If the tenant wishes to terminate the tenancy prior to the end of a fixed term, upon receiving written permission from the landlord (such permission does not have to be granted), the tenant will remain liable for all rent, bills, charges and costs payable under the terms of the contract until the term expires of the property is re-let, whichever is earlier. Should the property be re-let during the fixed term, the tenant will also be responsible for any remarketing fees that have been or will be incurred by the landlord for finding a new tenant (usually a sum equal to one month's rent per year or part year of the tenancy remaining) as well as any costs incurred by the landlord in having to pay for additional referencing or obtaining a new Inventory/Schedule of Condition report. Furthermore, the tenant is responsible for any other reasonable costs (e.g., telephone lines, satellite television contracts, TV licensing, cleaning, administration fees, etc.) incurred until the end of the term or until when the property is re-let. For the avoidance of doubt, this clause shall not take effect if the tenant is operating a pre-agreed "break clause" contained in the contract.

Right to Rent Check
Under the Immigration Act 2014, Palmer & Partners are required to check that all tenants have a legal "Right to Rent" in the UK. The tenant must provide us with original documents as proof of their "Right to Rent". If the tenant is a resident of the UK, a passport will be sufficient proof. However, if the tenant is not a resident in the UK, additional documentation or "share code" will be required; a list of admissible documents is available upon request.

Management of the Property
You will be advised at the start of your tenancy who is managing the property i.e., Palmer & Partners, the landlord or a 3rd party. Where the property is managed by Palmer & Partners, we will need to obtain the landlord's consent before authorising or arranging any repair.

When we manage a property AND hold keys, we can provide access to our contractors (with your prior permission). However, where we do NOT hold keys or a contractor is unable to collect keys, it is the tenant's responsibility to provide access.

Insurance
It is the tenant's responsibility to insure their personal belongings with a reputable insurer for the duration of the tenancy. Palmer & Partners work alongside two financial services companies: Colchester Mortgages and Ipswich Mortgages. We will ask the appropriate company (based on the property location) to contact you to discuss your insurance options. Any data passed to the above company will be held in line with their GDPR procedures.

Utilities
If your new property is managed by Palmer & Partners, we may disclose your name and contact information to any incumbent utility providers, water company and local authority. This may be done directly or via One Utility Bill Ltd (OUB). OUB will contact you on or around your move-in day to inform you of who currently supplies the utilities to your new home. Additionally, in line with the tenancy start date, OUB will transfer the Council Tax and water account into your name. Furthermore, OUB, existing utility suppliers and the local authority may contact you directly to discuss their services, products and prices. OUB will only use any tenants' details for the purposes of utility switching and not in any other way. Any data passed to OUB, or incumbent utility provider will be held in line with their GDPR procedures.

Taxation
If rent is paid directly to the landlord's bank account and the landlord is resident overseas, the tenant will be responsible for applying the provisions of the HM Revenue and Customs Non-Residential Landlords scheme for taxing UK income and should ask for advice on this. This provision does NOT apply where rent is paid to Palmer & Partners.

Data Protection
Palmer & Partners are fully compliant with all relevant Data Protection and G.D.P.R. legislation. Palmer & Partners reserve the right to pass on any relevant information held on you (current and future contact information, referencing results and tenancy performance details) to your landlord, local authority, utility companies, tenancy deposit schemes, debt collection agencies or the police.

Complaints Procedure
Should a tenant/applicant have any problems with Palmer & Partners' services you should write to the branch manager. This complaint will be acknowledged within 3 working days of receipt and an investigation undertaken. A formal written outcome of the investigation will be sent to you. If you remain dissatisfied, you should write to the Managing Director – the same time limits apply. Following the Managing Director's investigation, a written statement expressing Palmer & Partners' final view will be sent to you, including any offer made. This letter will confirm that, should still remain dissatisfied, you are entitled to refer the matter to The Property Ombudsman (TPO) for review within six months. The TPO will only review complaints made by consumers and only once the in-house complaints procedure has been completed.`;

  // Set font size to 10px for Terms and Conditions
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  yPosition = addText(termsText, 15, yPosition, 180);
  yPosition += 20;

  // Activity Log Section (if available)
  if (data.applicationId) {
    try {
      const { data: activityLogs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('application_id', data.applicationId)
        .order('created_at', { ascending: false });

      if (!error && activityLogs && activityLogs.length > 0) {
        // Page break before history
        doc.addPage();
        yPosition = 20;
        
        addSectionHeader('History');
        
        // Reset to 12px for activity log entries
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');

        activityLogs.forEach((log: any) => {
          yPosition = checkNewPage(15);
          
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

// Remove the old generateApplicationPDF function and replace with proper export
export const generateApplicationPDF = generatePdf;
