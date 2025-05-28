
import { supabase } from "@/integrations/supabase/client";
import { generateApplicationPDF } from "./pdfService";

interface EmailData {
  to: string;
  subject: string;
  html: string;
  attachment?: {
    filename: string;
    content: string;
    type: string;
  };
}

interface TenancyApplicationData {
  applicants: any[];
  propertyPreferences: any;
  signature: string;
  submittedAt: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    console.log("Sending email via Supabase Edge Function:", emailData.to);
    
    const { data, error } = await supabase.functions.invoke('send-application-email', {
      body: emailData
    });

    if (error) {
      console.error("Error calling email function:", error);
      return false;
    }

    console.log("Email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

export const generateSimpleConfirmationEmailHTML = (applicantName: string, applicationRef: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #2563eb; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; max-width: 600px; margin: 0 auto; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .tagline { font-size: 16px; opacity: 0.9; }
        .highlight { background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
        .btn { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Palmer & Partners</div>
        <div class="tagline">Premium Estate Agents</div>
      </div>
      
      <div class="content">
        <h2>Application Received Successfully</h2>
        
        <p>Dear ${applicantName},</p>
        
        <p>Thank you for submitting your tenancy application through Palmer & Partners. We have successfully received your application and all supporting documentation.</p>
        
        <div class="highlight">
          <h3>Application Reference: ${applicationRef}</h3>
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our team will review your application within 24-48 hours</li>
            <li>We may contact you for additional information or clarifications</li>
            <li>You'll receive an email update on your application status</li>
            <li>If successful, we'll arrange a property viewing and tenancy agreement</li>
          </ul>
        </div>

        <p><strong>Please find your complete application details attached as a PDF for your records.</strong></p>
        
        <p>If you have any questions about your application or need to make any changes, please contact us immediately using the reference number above.</p>
        
        <p>Thank you for choosing Palmer & Partners for your property needs.</p>
        
        <p>Best regards,<br>
        <strong>The Palmer & Partners Team</strong><br>
        Premium Estate Agents</p>
      </div>

      <div class="footer">
        <p><strong>Palmer & Partners</strong></p>
        <p>123 Kensington High Street, London W8 5SF</p>
        <p>Phone: +44 20 7123 4567 | Email: info@palmerpartners.com</p>
        <p>This is an automated email. Please do not reply directly to this message.</p>
      </div>
    </body>
    </html>
  `;
};

// Helper function to convert Uint8Array to base64 without spread operator
const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};

export const sendApplicationConfirmation = async (
  applicants: any[],
  propertyPreferences: any,
  signature: string
): Promise<boolean> => {
  const submittedAt = new Date().toISOString();
  const applicationRef = `APP-${Date.now()}`;
  
  // Generate PDF
  const pdfContent = generateApplicationPDF({
    applicants,
    propertyPreferences,
    signature,
    submittedAt
  });
  
  // Convert PDF to base64 for email attachment using safe method
  const pdfBase64 = uint8ArrayToBase64(pdfContent);
  
  // Send email to the primary applicant
  const primaryApplicant = applicants[0];
  const emailData: EmailData = {
    to: primaryApplicant.email,
    subject: "Tenancy Application Confirmation - Palmer & Partners",
    html: generateSimpleConfirmationEmailHTML(`${primaryApplicant.firstName} ${primaryApplicant.lastName}`, applicationRef),
    attachment: {
      filename: `Tenancy_Application_${applicationRef}.pdf`,
      content: pdfBase64,
      type: 'application/pdf'
    }
  };

  try {
    const success = await sendEmail(emailData);
    console.log("Application confirmation email sent:", success);
    return success;
  } catch (error) {
    console.error("Failed to send application confirmation email:", error);
    return false;
  }
};

export const sendAdminNotification = async (
  applicants: any[],
  propertyPreferences: any,
  signature: string
): Promise<boolean> => {
  const submittedAt = new Date().toISOString();
  const primaryApplicant = applicants[0];
  const applicationRef = `APP-${Date.now()}`;
  
  // Generate PDF for admin
  const pdfContent = generateApplicationPDF({
    applicants,
    propertyPreferences,
    signature,
    submittedAt
  });
  
  // Convert PDF to base64 for email attachment using safe method
  const pdfBase64 = uint8ArrayToBase64(pdfContent);
  
  const adminEmailData: EmailData = {
    to: "admin@palmerpartners.com",
    subject: `New Tenancy Application - ${primaryApplicant.firstName} ${primaryApplicant.lastName} (${applicationRef})`,
    html: `
      <h2>New Tenancy Application Received</h2>
      <p><strong>Application Reference:</strong> ${applicationRef}</p>
      <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}</p>
      <p><strong>Primary Applicant:</strong> ${primaryApplicant.firstName} ${primaryApplicant.lastName}</p>
      <p><strong>Email:</strong> ${primaryApplicant.email}</p>
      <p><strong>Phone:</strong> ${primaryApplicant.phone}</p>
      <p><strong>Number of Applicants:</strong> ${applicants.length}</p>
      <p><strong>Max Rent:</strong> £${propertyPreferences.maxRent}/month</p>
      <p><strong>Property Type:</strong> ${propertyPreferences.propertyType}</p>
      
      <p><strong>Complete application details are attached as PDF.</strong></p>
      
      <p>Please review and process this application in the admin dashboard.</p>
    `,
    attachment: {
      filename: `Tenancy_Application_${applicationRef}.pdf`,
      content: pdfBase64,
      type: 'application/pdf'
    }
  };

  try {
    const success = await sendEmail(adminEmailData);
    console.log("Admin notification email sent:", success);
    return success;
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    return false;
  }
};
