
import { Applicant, PropertyPreferences, AdditionalDetails } from '@/domain/types/Applicant';
import { sendEmail } from '../api/emailApi';
import { generateApplicationPDF } from '../pdfService';

export const formatApplicationForEmail = (
  applicants: Applicant[],
  propertyPreferences: PropertyPreferences,
  signature: string
): string => {
  const applicantsList = applicants.map((applicant, index) => `
    <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'};">
      <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Applicant ${index + 1}</td>
      <td style="padding: 12px; border: 1px solid #dee2e6;">${applicant.firstName} ${applicant.lastName}</td>
    </tr>
    <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'};">
      <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Email</td>
      <td style="padding: 12px; border: 1px solid #dee2e6;">${applicant.email}</td>
    </tr>
    <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'};">
      <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Phone</td>
      <td style="padding: 12px; border: 1px solid #dee2e6;">${applicant.phone}</td>
    </tr>
    <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'};">
      <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Annual Income</td>
      <td style="padding: 12px; border: 1px solid #dee2e6;">£${applicant.annualIncome}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #ffffff;">
      <div style="background-color: #ff6600; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Palmer & Partners</h1>
        <p style="color: white; margin: 5px 0 0 0; font-size: 16px;">Property Management Services</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #333333; border-bottom: 2px solid #ff6600; padding-bottom: 10px;">New Tenancy Application Received</h2>
        
        <div style="margin: 30px 0;">
          <h3 style="background-color: #404040; color: white; padding: 12px; margin: 0 0 15px 0;">Applicant Information</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            ${applicantsList}
          </table>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="background-color: #404040; color: white; padding: 12px; margin: 0 0 15px 0;">Property Requirements</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Property Type</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${propertyPreferences.propertyType}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Maximum Rent</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">£${propertyPreferences.maxRent}/month</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Preferred Location</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${propertyPreferences.preferredLocation}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Move-in Date</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${propertyPreferences.moveInDate}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #ff6600; margin: 30px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333333;">Digital Signature</h3>
          <p style="margin: 0; font-style: italic; color: #666666;">${signature}</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #666666;">
            Submitted: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <p style="margin: 0; color: #0066cc; font-weight: bold;">📎 Complete application form attached as PDF</p>
          <p style="margin: 10px 0 0 0; color: #666666; font-size: 14px;">
            Please review the attached detailed application form for complete applicant information.
          </p>
        </div>
      </div>
      
      <div style="background-color: #404040; padding: 20px; text-align: center; color: white;">
        <p style="margin: 0; font-size: 14px;">Palmer & Partners Property Management</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Professional Property Services</p>
      </div>
    </div>
  `;
};

export const sendApplicationConfirmation = async (
  applicants: Applicant[],
  propertyPreferences: PropertyPreferences,
  additionalDetails: AdditionalDetails,
  dataSharing: { utilities: boolean; insurance: boolean },
  signature: string
): Promise<boolean> => {
  const primaryApplicant = applicants[0];
  
  try {
    // Generate PDF
    const applicationData = {
      applicants,
      propertyPreferences,
      additionalDetails,
      dataSharing,
      signature,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Generating PDF for confirmation email...');
    const pdfBytes = await generateApplicationPDF(applicationData);
    console.log('PDF generated, size:', pdfBytes.length, 'bytes');
    
    // Convert to base64 string properly
    const uint8Array = new Uint8Array(pdfBytes);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    const pdfBase64 = btoa(binaryString);
    console.log('PDF converted to base64, length:', pdfBase64.length);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        <div style="background-color: #3a3a3a; padding: 20px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            
            <!-- Header with logo -->
            <div style="background-color: #3a3a3a; padding: 20px; text-align: left;">
              <div style="display: inline-block; background-color: #ff6600; padding: 10px; border-radius: 5px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">P&</span>
              </div>
              <span style="color: white; font-size: 20px; margin-left: 10px; vertical-align: top; line-height: 44px;">Palmer & Partners</span>
              <div style="color: #ff6600; font-size: 12px; margin-top: 5px;">Independent Estate & Letting Agents</div>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px; background-color: #f5f5f5;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 18px;">Tenancy Application</h2>
              
              <p style="color: #333; margin: 0 0 15px 0; font-size: 14px;">Dear ${primaryApplicant.firstName}</p>
              
              <p style="color: #333; margin: 0 0 15px 0; font-size: 14px;">A tenancy application form has been submitted.</p>
              
              <p style="color: #333; margin: 0 0 15px 0; font-size: 14px;">Please refer to the PDF attached to this email.</p>
              
              <p style="color: #333; margin: 0 0 5px 0; font-size: 14px;">Thanks,</p>
              <p style="color: #333; margin: 0; font-size: 14px;"><span style="background-color: #ffeb3b; padding: 2px 4px;">Palmer</span> & Partners</p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
              <p style="color: #666; margin: 0; font-size: 12px;">© 2025 <span style="background-color: #ffeb3b; padding: 1px 3px;">Palmer</span> & Partners. All rights reserved.</p>
            </div>
            
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResult = await sendEmail({
      to: primaryApplicant.email,
      subject: "Application Received - Palmer & Partners",
      html,
      attachment: {
        filename: `tenancy-application-${primaryApplicant.lastName}-${Date.now()}.pdf`,
        content: pdfBase64,
        type: 'application/pdf'
      }
    });

    console.log('Email send result:', emailResult);
    return emailResult;
  } catch (error) {
    console.error('Error in sendApplicationConfirmation:', error);
    // Send email without attachment as fallback
    const fallbackHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        <div style="background-color: #3a3a3a; padding: 20px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            
            <!-- Header with logo -->
            <div style="background-color: #3a3a3a; padding: 20px; text-align: left;">
              <div style="display: inline-block; background-color: #ff6600; padding: 10px; border-radius: 5px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">P&</span>
              </div>
              <span style="color: white; font-size: 20px; margin-left: 10px; vertical-align: top; line-height: 44px;">Palmer & Partners</span>
              <div style="color: #ff6600; font-size: 12px; margin-top: 5px;">Independent Estate & Letting Agents</div>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px; background-color: #f5f5f5;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 18px;">Tenancy Application</h2>
              
              <p style="color: #333; margin: 0 0 15px 0; font-size: 14px;">Dear ${primaryApplicant.firstName}</p>
              
              <p style="color: #333; margin: 0 0 15px 0; font-size: 14px;">A tenancy application form has been submitted.</p>
              
              <p style="color: #333; margin: 0 0 15px 0; font-size: 14px;">We will review your application and get back to you within 2-3 business days.</p>
              
              <p style="color: #333; margin: 0 0 5px 0; font-size: 14px;">Thanks,</p>
              <p style="color: #333; margin: 0; font-size: 14px;"><span style="background-color: #ffeb3b; padding: 2px 4px;">Palmer</span> & Partners</p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
              <p style="color: #666; margin: 0; font-size: 12px;">© 2025 <span style="background-color: #ffeb3b; padding: 1px 3px;">Palmer</span> & Partners. All rights reserved.</p>
            </div>
            
          </div>
        </div>
      </body>
      </html>
    `;
    
    return sendEmail({
      to: primaryApplicant.email,
      subject: "Application Received - Palmer & Partners",
      html: fallbackHtml
    });
  }
};

export const sendAdminNotification = async (
  applicants: Applicant[],
  propertyPreferences: PropertyPreferences,
  additionalDetails: AdditionalDetails,
  dataSharing: { utilities: boolean; insurance: boolean },
  signature: string
): Promise<boolean> => {
  try {
    // Generate PDF for admin
    const applicationData = {
      applicants,
      propertyPreferences,
      additionalDetails,
      dataSharing,
      signature,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Generating PDF for admin notification...');
    const pdfBytes = await generateApplicationPDF(applicationData);
    console.log('PDF generated for admin, size:', pdfBytes.length, 'bytes');
    
    // Convert to base64 string properly
    const uint8Array = new Uint8Array(pdfBytes);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    const pdfBase64 = btoa(binaryString);
    console.log('Admin PDF converted to base64, length:', pdfBase64.length);

    const html = formatApplicationForEmail(applicants, propertyPreferences, signature);

    const emailResult = await sendEmail({
      to: "admin@palmerpartners.com",
      subject: `New Application: ${applicants[0].firstName} ${applicants[0].lastName} - ${propertyPreferences.propertyType}`,
      html,
      attachment: {
        filename: `application-${applicants[0].lastName}-${Date.now()}.pdf`,
        content: pdfBase64,
        type: 'application/pdf'
      }
    });

    console.log('Admin email send result:', emailResult);
    return emailResult;
  } catch (error) {
    console.error('Error in sendAdminNotification:', error);
    // Send email without attachment as fallback
    const fallbackHtml = formatApplicationForEmail(applicants, propertyPreferences, signature);
    
    return sendEmail({
      to: "admin@palmerpartners.com",
      subject: `New Application: ${applicants[0].firstName} ${applicants[0].lastName}`,
      html: fallbackHtml
    });
  }
};
