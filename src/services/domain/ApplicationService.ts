
import { sendEmail } from '../api/emailApi';
import { generateApplicationPDF } from '../pdfService';
import { Application } from '@/domain/types/Applicant';

const convertArrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const sendApplicationConfirmation = async (application: Application): Promise<boolean> => {
  console.log('Generating PDF for confirmation email...');
  
  try {
    const pdfBuffer = await generateApplicationPDF({
      applicants: application.applicants,
      propertyPreferences: application.propertyPreferences,
      additionalDetails: application.additionalDetails,
      dataSharing: application.dataSharing,
      signature: application.signature,
      submittedAt: new Date().toISOString(),
      applicationId: 'APP-' + Date.now()
    });
    
    console.log('PDF generated successfully, size:', pdfBuffer.byteLength, 'bytes');
    
    // Convert to base64 for email attachment
    const pdfBase64 = convertArrayBufferToBase64(pdfBuffer.buffer);
    console.log('PDF converted to base64, length:', pdfBase64.length);
    
    const applicantEmail = application.applicants[0]?.email;
    const applicantName = `${application.applicants[0]?.firstName} ${application.applicants[0]?.lastName}`;
    
    if (!applicantEmail) {
      console.error('No applicant email found');
      return false;
    }

    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: 'Lexend', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .highlight { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .status-badge { display: inline-block; background: #FF6F00; color: white; padding: 15px 30px; border-radius: 6px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Application Received</h1>
            </div>
            
            <div class="content">
              <h2 style="color: #212121; margin-bottom: 20px;">Dear ${applicantName},</h2>
              
              <p style="margin-bottom: 20px;">
                Thank you for submitting your tenancy application for <strong>${application.propertyPreferences.streetAddress}</strong>.
              </p>
              
              <div class="highlight">
                <h3 style="color: #212121; margin-top: 0;">Application Summary:</h3>
                <ul style="margin: 0;">
                  <li>Property: ${application.propertyPreferences.streetAddress}</li>
                  <li>Number of Applicants: ${application.applicants.length}</li>
                  <li>Preferred Move-in Date: ${application.propertyPreferences.moveInDate}</li>
                  <li>Maximum Rent: £${application.propertyPreferences.maxRent}</li>
                </ul>
              </div>
              
              <p style="margin-bottom: 20px;">
                We'll review your application and get back to you within <strong style="color: #FF6F00;">2-3 business days</strong>.
              </p>
              
              <p style="margin-bottom: 20px;">
                Please find your completed application form attached to this email for your records.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div class="status-badge">Application Status: Processing</div>
              </div>
              
              <p style="color: #888; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                <strong>Palmer & Partners Team</strong>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailRequest = {
      to: applicantEmail,
      subject: 'Tenancy Application Confirmation - Palmer & Partners',
      html: emailHtml,
      attachment: {
        filename: 'tenancy-application.pdf',
        content: pdfBase64,
        type: 'application/pdf'
      }
    };

    const result = await sendEmail(emailRequest);
    console.log('Confirmation email send result:', result);
    return result;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

export const sendAdminNotification = async (application: Application): Promise<boolean> => {
  console.log('Generating PDF for admin notification...');
  
  try {
    const pdfBuffer = await generateApplicationPDF({
      applicants: application.applicants,
      propertyPreferences: application.propertyPreferences,
      additionalDetails: application.additionalDetails,
      dataSharing: application.dataSharing,
      signature: application.signature,
      submittedAt: new Date().toISOString(),
      applicationId: 'APP-' + Date.now()
    });
    
    console.log('PDF generated for admin, size:', pdfBuffer.byteLength, 'bytes');
    
    // Convert to base64 for email attachment
    const pdfBase64 = convertArrayBufferToBase64(pdfBuffer.buffer);
    console.log('Admin PDF converted to base64, length:', pdfBase64.length);
    
    const applicantName = `${application.applicants[0]?.firstName} ${application.applicants[0]?.lastName}`;
    const applicantEmail = application.applicants[0]?.email;
    
    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: 'Lexend', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .highlight { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .action-required { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #FF6F00; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">New Tenancy Application</h1>
            </div>
            
            <div class="content">
              <p>A new tenancy application has been submitted and requires your review.</p>
              
              <div class="highlight">
                <h3 style="color: #212121; margin-top: 0;">Application Summary:</h3>
                <ul style="margin: 0;">
                  <li><strong>Applicant:</strong> ${applicantName}</li>
                  <li><strong>Email:</strong> ${applicantEmail}</li>
                  <li><strong>Property:</strong> ${application.propertyPreferences.streetAddress}</li>
                  <li><strong>Maximum Rent:</strong> £${application.propertyPreferences.maxRent}</li>
                  <li><strong>Preferred Move-in Date:</strong> ${application.propertyPreferences.moveInDate}</li>
                  <li><strong>Number of Applicants:</strong> ${application.applicants.length}</li>
                  <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
                </ul>
              </div>
              
              <div class="action-required">
                <p><strong>Action Required:</strong> Please review the attached application and follow up with the applicant within 2-3 business days.</p>
              </div>
              
              <p>The complete application form is attached to this email.</p>
              
              <p style="color: #888; font-size: 14px; margin-top: 30px;">
                This is an automated notification from the tenancy application system.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailRequest = {
      to: 'calvinwarwick+admin@gmail.com',
      subject: `New Tenancy Application - ${applicantName}`,
      html: emailHtml,
      attachment: {
        filename: 'tenancy-application.pdf',
        content: pdfBase64,
        type: 'application/pdf'
      }
    };

    const result = await sendEmail(emailRequest);
    console.log('Admin email send result:', result);
    return result;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
};
