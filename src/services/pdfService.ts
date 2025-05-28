
import jsPDF from 'jspdf';

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  employment: string;
  companyName?: string;
  jobTitle?: string;
  annualIncome: string;
  lengthOfService?: string;
  previousAddress: string;
  previousPostcode?: string;
  moveInDate?: string;
  vacateDate?: string;
  currentPropertyStatus?: string;
  currentRentalAmount?: string;
  reference1Name?: string;
  reference1Contact?: string;
  ukPassport?: string;
  adverseCredit?: string;
  requiresGuarantor?: string;
  guarantorAddress?: string;
  guarantorPostcode?: string;
}

interface PropertyDetails {
  streetAddress: string;
  postcode: string;
  rentalAmount: string;
  preferredMoveInDate: string;
  latestMoveInDate: string;
  initialTenancyTerm: string;
  hasPets: string;
  under18s: string;
  conditionsOfOffer: string;
  depositType: string;
}

interface TenancyApplicationData {
  applicants: Applicant[];
  propertyDetails?: PropertyDetails;
  dataSharing?: {
    acceptUtilities: string;
    acceptInsurance: string;
  };
  signature: string;
  submittedAt: string;
}

const addPalmerPartnersHeader = (doc: jsPDF) => {
  // Orange header background
  doc.setFillColor(255, 102, 0);
  doc.rect(0, 0, 210, 30, 'F');
  
  // Palmer & Partners logo text
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Palmer & Partners', 15, 20);
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Property Management & Lettings', 15, 26);
};

const addSectionHeader = (doc: jsPDF, title: string, yPosition: number) => {
  doc.setFillColor(64, 64, 64);
  doc.rect(15, yPosition - 5, 180, 12, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(title, 20, yPosition + 3);
};

const addTableRow = (doc: jsPDF, label: string, value: string, yPosition: number, isEven: boolean) => {
  if (isEven) {
    doc.setFillColor(248, 248, 248);
    doc.rect(15, yPosition - 2, 180, 10, 'F');
  }
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(label, 20, yPosition + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(value || '-', 105, yPosition + 4);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export const generateApplicationPDF = (data: TenancyApplicationData): Uint8Array => {
  const { applicants, propertyDetails, dataSharing, signature, submittedAt } = data;
  const doc = new jsPDF();
  
  let yPosition = 40;
  
  // Add header
  addPalmerPartnersHeader(doc);
  
  // Main title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Tenancy Application', 15, yPosition);
  yPosition += 20;
  
  // Property Details Section
  addSectionHeader(doc, 'Property Details', yPosition);
  yPosition += 20;
  
  const propertyData = propertyDetails || {
    streetAddress: 'Not specified',
    postcode: 'Not specified',
    rentalAmount: '0',
    preferredMoveInDate: '',
    latestMoveInDate: '',
    initialTenancyTerm: '1 year',
    hasPets: 'No',
    under18s: 'None',
    conditionsOfOffer: '',
    depositType: 'Traditional deposit'
  };
  
  const propertyRows = [
    ['Street Address', propertyData.streetAddress],
    ['Postcode', propertyData.postcode],
    ['Rental Amount', `£${propertyData.rentalAmount}.00`],
    ['Preferred Move-in Date', formatDate(propertyData.preferredMoveInDate)],
    ['Latest Move-in Date', formatDate(propertyData.latestMoveInDate)],
    ['Initial Tenancy Term', propertyData.initialTenancyTerm],
    ['Has Pets', propertyData.hasPets],
    ['Under 18s', propertyData.under18s],
    ['Conditions of Offer', propertyData.conditionsOfOffer || '-'],
    ['Deposit Type', propertyData.depositType]
  ];
  
  propertyRows.forEach((row, index) => {
    addTableRow(doc, row[0], row[1], yPosition, index % 2 === 0);
    yPosition += 10;
  });
  
  yPosition += 15;
  
  // Process each applicant
  applicants.forEach((applicant, applicantIndex) => {
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      addPalmerPartnersHeader(doc);
      yPosition = 50;
    }
    
    // Applicant Details Section
    addSectionHeader(doc, `Applicant Details${applicants.length > 1 ? ` - ${applicant.firstName} ${applicant.lastName}` : ''}`, yPosition);
    yPosition += 20;
    
    const applicantRows = [
      ['First Name', applicant.firstName],
      ['Last Name', applicant.lastName],
      ['Date of Birth', formatDate(applicant.dateOfBirth)],
      ['Email Address', applicant.email],
      ['Mobile Number', applicant.phone],
    ];
    
    applicantRows.forEach((row, index) => {
      addTableRow(doc, row[0], row[1], yPosition, index % 2 === 0);
      yPosition += 10;
    });
    
    yPosition += 15;
    
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      addPalmerPartnersHeader(doc);
      yPosition = 50;
    }
    
    // Employment Details
    addSectionHeader(doc, 'Employment Details', yPosition);
    yPosition += 20;
    
    const employmentRows = [
      ['Contract Type', applicant.employment || 'N/A'],
      ['Company Name', applicant.companyName || '-'],
      ['Job Title', applicant.jobTitle || '-'],
      ['Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '-'],
      ['Length of Service', applicant.lengthOfService || '-'],
    ];
    
    employmentRows.forEach((row, index) => {
      addTableRow(doc, row[0], row[1], yPosition, index % 2 === 0);
      yPosition += 10;
    });
    
    yPosition += 15;
    
    // Check if we need a new page
    if (yPosition > 180) {
      doc.addPage();
      addPalmerPartnersHeader(doc);
      yPosition = 50;
    }
    
    // Current Property Details
    addSectionHeader(doc, 'Current Property Details', yPosition);
    yPosition += 20;
    
    const currentPropertyRows = [
      ['Postcode', applicant.previousPostcode || propertyData.postcode],
      ['Street Address', applicant.previousAddress || '-'],
      ['Move In Date', formatDate(applicant.moveInDate || '')],
      ['Vacate Date', formatDate(applicant.vacateDate || '')],
      ['Current Property Status', applicant.currentPropertyStatus || '-'],
      ['Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '-'],
    ];
    
    currentPropertyRows.forEach((row, index) => {
      addTableRow(doc, row[0], row[1], yPosition, index % 2 === 0);
      yPosition += 10;
    });
    
    yPosition += 15;
  });
  
  // Check if we need a new page
  if (yPosition > 180) {
    doc.addPage();
    addPalmerPartnersHeader(doc);
    yPosition = 50;
  }
  
  // Additional Information
  addSectionHeader(doc, 'Additional Information', yPosition);
  yPosition += 20;
  
  const firstApplicant = applicants[0];
  const additionalRows = [
    ['UK/ROI Passport', firstApplicant.ukPassport || 'No'],
    ['Adverse Credit', firstApplicant.adverseCredit || 'No'],
    ['Requires Guarantor', firstApplicant.requiresGuarantor || 'No'],
  ];
  
  additionalRows.forEach((row, index) => {
    addTableRow(doc, row[0], row[1], yPosition, index % 2 === 0);
    yPosition += 10;
  });
  
  yPosition += 15;
  
  // Guarantor Address (if applicable)
  if (firstApplicant.requiresGuarantor === 'Yes') {
    if (yPosition > 200) {
      doc.addPage();
      addPalmerPartnersHeader(doc);
      yPosition = 50;
    }
    
    addSectionHeader(doc, 'Guarantor Address', yPosition);
    yPosition += 20;
    
    const guarantorRows = [
      ['Street Address', firstApplicant.guarantorAddress || '-'],
      ['Postcode', firstApplicant.guarantorPostcode || '-'],
    ];
    
    guarantorRows.forEach((row, index) => {
      addTableRow(doc, row[0], row[1], yPosition, index % 2 === 0);
      yPosition += 10;
    });
    
    yPosition += 15;
  }
  
  // Data Sharing
  if (dataSharing) {
    if (yPosition > 200) {
      doc.addPage();
      addPalmerPartnersHeader(doc);
      yPosition = 50;
    }
    
    addSectionHeader(doc, 'Data Sharing', yPosition);
    yPosition += 20;
    
    const dataSharingRows = [
      ['Accept Utilities', dataSharing.acceptUtilities],
      ['Accept Insurance', dataSharing.acceptInsurance],
    ];
    
    dataSharingRows.forEach((row, index) => {
      addTableRow(doc, row[0], row[1], yPosition, index % 2 === 0);
      yPosition += 10;
    });
    
    yPosition += 15;
  }
  
  // Signature Section
  if (yPosition > 220) {
    doc.addPage();
    addPalmerPartnersHeader(doc);
    yPosition = 50;
  }
  
  addSectionHeader(doc, 'Signature', yPosition);
  yPosition += 20;
  
  const signatureRows = [
    ['Full name', signature],
    ['Submitted At', `${formatDate(submittedAt)} - ${new Date(submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`]
  ];
  
  signatureRows.forEach((row, index) => {
    addTableRow(doc, row[0], row[1], yPosition, index % 2 === 0);
    yPosition += 10;
  });
  
  // Add Terms and Conditions placeholder
  yPosition += 20;
  if (yPosition > 250) {
    doc.addPage();
    addPalmerPartnersHeader(doc);
    yPosition = 50;
  }
  
  addSectionHeader(doc, 'Terms and conditions', yPosition);
  yPosition += 20;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions', 20, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text('If your offer is accepted by the landlord of your chosen property, the "Holding Deposit" will become', 20, yPosition);
  yPosition += 5;
  doc.text('payable. Upon receipt of this payment Palmer & Partners will commence the referencing process.', 20, yPosition);
  yPosition += 5;
  doc.text('This is usually done via an online form sent to your email address. This form must be completed', 20, yPosition);
  yPosition += 5;
  doc.text('within 72 hours to avoid the failure of your tenancy application.', 20, yPosition);
  
  // Footer on all pages
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('Palmer & Partners - Tenancy Application', 20, 285);
    doc.text(`Page ${i} of ${pageCount}`, 170, 285);
  }
  
  // Generate PDF as Uint8Array properly
  const pdfOutput = doc.output('arraybuffer');
  return new Uint8Array(pdfOutput);
};
