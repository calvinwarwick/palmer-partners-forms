import { supabase } from "@/integrations/supabase/client";

interface EmailData {
  to: string;
  subject: string;
  html: string;
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

export const generateApplicationEmailHTML = (data: TenancyApplicationData): string => {
  const { applicants, propertyPreferences, signature, submittedAt } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 30px; }
        .section h3 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .applicant { background-color: #f9fafb; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px; }
        .info-item { margin-bottom: 8px; }
        .label { font-weight: bold; color: #4b5563; }
        .signature { background-color: #fef3c7; padding: 15px; border-radius: 8px; text-align: center; }
        .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Tenancy Application Confirmation</h1>
        <p>Thank you for submitting your application</p>
      </div>
      
      <div class="content">
        <div class="section">
          <p><strong>Submission Date:</strong> ${new Date(submittedAt).toLocaleString()}</p>
          <p>Dear Applicant(s), we have successfully received your tenancy application. Please find the details below for your records.</p>
        </div>

        <div class="section">
          <h3>Applicant Information</h3>
          ${applicants.map((applicant, index) => `
            <div class="applicant">
              <h4>Applicant ${index + 1}: ${applicant.firstName} ${applicant.lastName}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Email:</span> ${applicant.email}
                </div>
                <div class="info-item">
                  <span class="label">Phone:</span> ${applicant.phone}
                </div>
                <div class="info-item">
                  <span class="label">Date of Birth:</span> ${applicant.dateOfBirth || 'Not provided'}
                </div>
                <div class="info-item">
                  <span class="label">Employment:</span> ${applicant.employment || 'Not provided'}
                </div>
                <div class="info-item">
                  <span class="label">Annual Income:</span> £${applicant.annualIncome || 'Not provided'}
                </div>
                <div class="info-item">
                  <span class="label">Previous Address:</span> ${applicant.previousAddress || 'Not provided'}
                </div>
              </div>
              ${applicant.reference1Name ? `
                <div style="margin-top: 15px;">
                  <strong>Reference:</strong> ${applicant.reference1Name} (${applicant.reference1Contact})
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h3>Property Preferences</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Property Type:</span> ${propertyPreferences.propertyType}
            </div>
            <div class="info-item">
              <span class="label">Maximum Rent:</span> £${propertyPreferences.maxRent}/month
            </div>
            <div class="info-item">
              <span class="label">Preferred Location:</span> ${propertyPreferences.preferredLocation || 'Not specified'}
            </div>
            <div class="info-item">
              <span class="label">Move-in Date:</span> ${propertyPreferences.moveInDate || 'Flexible'}
            </div>
          </div>
          ${propertyPreferences.additionalRequests ? `
            <div style="margin-top: 15px;">
              <span class="label">Additional Requests:</span>
              <p style="background-color: #f9fafb; padding: 10px; border-radius: 4px; margin-top: 5px;">
                ${propertyPreferences.additionalRequests}
              </p>
            </div>
          ` : ''}
        </div>

        <div class="section">
          <h3>Digital Signature</h3>
          <div class="signature">
            <p><strong>Signed by:</strong> ${signature}</p>
            <p><em>Digitally signed on ${new Date(submittedAt).toLocaleDateString()}</em></p>
          </div>
        </div>

        <div class="section">
          <h3>Next Steps</h3>
          <ul>
            <li>We will review your application within 2-3 business days</li>
            <li>You will receive an email notification regarding the status of your application</li>
            <li>If you need to make any changes, please contact us as soon as possible</li>
            <li>Keep this email for your records</li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <p>This is an automated email. Please do not reply directly to this message.</p>
        <p>For any questions, please contact our office.</p>
      </div>
    </body>
    </html>
  `;
};

export const sendApplicationConfirmation = async (
  applicants: any[],
  propertyPreferences: any,
  signature: string
): Promise<boolean> => {
  const submittedAt = new Date().toISOString();
  
  // Send email to the primary applicant
  const primaryApplicant = applicants[0];
  const emailData: EmailData = {
    to: primaryApplicant.email,
    subject: "Tenancy Application Confirmation - Thank You",
    html: generateApplicationEmailHTML({
      applicants,
      propertyPreferences,
      signature,
      submittedAt
    })
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
  
  const adminEmailData: EmailData = {
    to: "admin@estateagent.com", // This would be configurable
    subject: `New Tenancy Application from ${primaryApplicant.firstName} ${primaryApplicant.lastName}`,
    html: `
      <h2>New Tenancy Application Received</h2>
      <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}</p>
      <p><strong>Primary Applicant:</strong> ${primaryApplicant.firstName} ${primaryApplicant.lastName}</p>
      <p><strong>Email:</strong> ${primaryApplicant.email}</p>
      <p><strong>Phone:</strong> ${primaryApplicant.phone}</p>
      <p><strong>Number of Applicants:</strong> ${applicants.length}</p>
      <p><strong>Max Rent:</strong> £${propertyPreferences.maxRent}/month</p>
      <p><strong>Property Type:</strong> ${propertyPreferences.propertyType}</p>
      
      <p>Please review the full application in the admin dashboard.</p>
    `
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
