
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
    
    // Generate actual PDF with application data
    const pdfBase64 = await generateApplicationPDF(application);
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

// Actual PDF generation function for edge environment
const generateApplicationPDF = async (data: any): Promise<string> => {
  console.log('Generating PDF with application data...');
  
  // This is a simplified PDF generation for the edge function
  // In a production environment, you might want to use a different PDF library
  // that works better in edge functions, or call the main PDF service
  
  const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

5 0 obj
<<
/Length 200
>>
stream
BT
/F1 16 Tf
50 750 Td
(Palmer & Partners - Tenancy Application) Tj
0 -30 Td
/F1 12 Tf
(Applicant: ${data.applicants[0]?.firstName} ${data.applicants[0]?.lastName}) Tj
0 -20 Td
(Property: ${data.propertyPreferences?.streetAddress || 'N/A'}) Tj
0 -20 Td
(Max Rent: £${data.propertyPreferences?.maxRent || 'N/A'}) Tj
0 -20 Td
(Move-in Date: ${data.propertyPreferences?.moveInDate || 'N/A'}) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000245 00000 n 
0000000316 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
567
%%EOF`;
  
  // Convert to base64
  const base64 = btoa(pdfContent);
  console.log('PDF generated successfully with application data');
  return base64;
};
