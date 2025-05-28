
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
    
    const pdfBytes = generateApplicationPDF(applicationData);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #ff6600; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Palmer & Partners</h1>
          <p style="color: white; margin: 5px 0 0 0; font-size: 16px;">Property Management Services</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333333; border-bottom: 2px solid #ff6600; padding-bottom: 10px;">Application Confirmation</h2>
          
          <p style="color: #333333; line-height: 1.6;">Dear ${primaryApplicant.firstName} ${primaryApplicant.lastName},</p>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">✓ Application Successfully Received</h3>
            <p style="margin: 0; color: #333333;">
              Thank you for submitting your tenancy application. We have received all your details and will begin processing immediately.
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333333; margin: 0 0 15px 0;">Next Steps</h3>
            <ul style="color: #666666; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Our team will review your application within <strong>2-3 business days</strong></li>
              <li>We may contact you for additional information or references</li>
              <li>You will receive an update via email or phone once review is complete</li>
            </ul>
          </div>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">📎 Your Application Copy</h3>
            <p style="margin: 0; color: #856404;">
              A complete copy of your application form is attached to this email for your records.
            </p>
          </div>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #333333; margin: 0 0 15px 0;">Contact Information</h3>
            <p style="color: #666666; line-height: 1.6; margin: 0;">
              <strong>Email:</strong> ${primaryApplicant.email}<br>
              <strong>Phone:</strong> ${primaryApplicant.phone}
            </p>
          </div>
          
          <p style="color: #333333; line-height: 1.6;">
            If you have any questions or need to update your application, please don't hesitate to contact us.
          </p>
          
          <p style="color: #333333; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong>The Palmer & Partners Team</strong>
          </p>
        </div>
        
        <div style="background-color: #404040; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 14px;">Palmer & Partners Property Management</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Professional Property Services</p>
        </div>
      </div>
    `;

    return sendEmail({
      to: primaryApplicant.email,
      subject: "Application Received - Palmer & Partners",
      html,
      attachment: {
        filename: `tenancy-application-${primaryApplicant.lastName}-${Date.now()}.pdf`,
        content: pdfBase64,
        type: 'application/pdf'
      }
    });
  } catch (error) {
    console.error('Error generating PDF for confirmation email:', error);
    // Send email without attachment as fallback
    const fallbackHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Application Confirmation</h1>
        <p>Dear ${primaryApplicant.firstName} ${primaryApplicant.lastName},</p>
        <p>Thank you for submitting your tenancy application. We have received your details and will review within 2-3 business days.</p>
        <p>Best regards,<br>Palmer & Partners</p>
      </div>
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
    
    const pdfBytes = generateApplicationPDF(applicationData);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));
    
    const html = formatApplicationForEmail(applicants, propertyPreferences, signature);

    return sendEmail({
      to: "admin@palmerpartners.uk",
      subject: `New Application: ${applicants[0].firstName} ${applicants[0].lastName} - ${propertyPreferences.propertyType}`,
      html,
      attachment: {
        filename: `application-${applicants[0].lastName}-${Date.now()}.pdf`,
        content: pdfBase64,
        type: 'application/pdf'
      }
    });
  } catch (error) {
    console.error('Error generating PDF for admin notification:', error);
    // Send email without attachment as fallback
    const fallbackHtml = formatApplicationForEmail(applicants, propertyPreferences, signature);
    
    return sendEmail({
      to: "admin@palmerpartners.uk",
      subject: `New Application: ${applicants[0].firstName} ${applicants[0].lastName}`,
      html: fallbackHtml
    });
  }
};
