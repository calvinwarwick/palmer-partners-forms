
import { sendEmail } from '../api/emailApi';
import { generateApplicationPdf } from '../pdfService';
import { Application } from '@/domain/types/Applicant';

export const sendApplicationConfirmation = async (application: Application): Promise<boolean> => {
  console.log('Generating PDF for confirmation email...');
  
  try {
    const pdfBuffer = await generateApplicationPdf(application);
    console.log('PDF generated, size:', pdfBuffer.byteLength, 'bytes');
    
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
    console.log('PDF converted to base64, length:', pdfBase64.length);
    
    const applicantEmail = application.applicants[0]?.email;
    const applicantName = `${application.applicants[0]?.firstName} ${application.applicants[0]?.lastName}`;
    
    if (!applicantEmail) {
      console.error('No applicant email found');
      return false;
    }

    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #FF6F00; border-bottom: 2px solid #FF6F00; padding-bottom: 10px;">
              Tenancy Application Confirmation
            </h2>
            
            <p>Dear ${applicantName},</p>
            
            <p>Thank you for submitting your tenancy application. We have received your application and it is now being processed.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #FF6F00; margin-top: 0;">Application Details:</h3>
              <p><strong>Property:</strong> ${application.propertyPreferences.streetAddress}, ${application.propertyPreferences.postcode}</p>
              <p><strong>Maximum Rent:</strong> £${application.propertyPreferences.maxRent}</p>
              <p><strong>Preferred Move-in Date:</strong> ${application.propertyPreferences.moveInDate}</p>
              <p><strong>Number of Applicants:</strong> ${application.applicants.length}</p>
            </div>
            
            <p>Please find your completed application form attached to this email for your records.</p>
            
            <p>We will review your application and contact you within 2-3 business days with an update.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin-bottom: 5px;"><strong>Best regards,</strong></p>
              <p style="margin-bottom: 5px;">The Property Management Team</p>
              <p style="font-size: 14px; color: #666;">This is an automated confirmation email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailRequest = {
      to: applicantEmail,
      subject: 'Tenancy Application Confirmation',
      html: emailHtml,
      attachment: {
        filename: 'tenancy-application.pdf',
        content: pdfBase64,
        type: 'application/pdf'
      }
    };

    const result = await sendEmail(emailRequest);
    console.log('Email send result:', result);
    return result;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

export const sendAdminNotification = async (application: Application): Promise<boolean> => {
  console.log('Generating PDF for admin notification...');
  
  try {
    const pdfBuffer = await generateApplicationPdf(application);
    console.log('PDF generated for admin, size:', pdfBuffer.byteLength, 'bytes');
    
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
    console.log('Admin PDF converted to base64, length:', pdfBase64.length);
    
    const applicantName = `${application.applicants[0]?.firstName} ${application.applicants[0]?.lastName}`;
    const applicantEmail = application.applicants[0]?.email;
    
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #FF6F00; border-bottom: 2px solid #FF6F00; padding-bottom: 10px;">
              New Tenancy Application Received
            </h2>
            
            <p>A new tenancy application has been submitted and requires your review.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #FF6F00; margin-top: 0;">Application Summary:</h3>
              <p><strong>Applicant:</strong> ${applicantName}</p>
              <p><strong>Email:</strong> ${applicantEmail}</p>
              <p><strong>Property:</strong> ${application.propertyPreferences.streetAddress}, ${application.propertyPreferences.postcode}</p>
              <p><strong>Maximum Rent:</strong> £${application.propertyPreferences.maxRent}</p>
              <p><strong>Preferred Move-in Date:</strong> ${application.propertyPreferences.moveInDate}</p>
              <p><strong>Number of Applicants:</strong> ${application.applicants.length}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #FF6F00;">
              <p><strong>Action Required:</strong> Please review the attached application and follow up with the applicant within 2-3 business days.</p>
            </div>
            
            <p>The complete application form is attached to this email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 14px; color: #666;">This is an automated notification from the tenancy application system.</p>
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
