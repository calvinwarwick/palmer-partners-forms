
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
    console.log('RESEND_API_KEY available:', !!Deno.env.get("RESEND_API_KEY"));
    console.log('RESEND_API_KEY length:', Deno.env.get("RESEND_API_KEY")?.length || 0);
    
    // Generate PDF (placeholder for now)
    const pdfBase64 = await generateApplicationPDF(application);
    console.log('PDF generated, length:', pdfBase64.length);
    
    console.log('Attempting to send email with Resend...');
    const emailResponse = await resend.emails.send({
      from: "Palmer & Partners <submitted@forms.palmerpartners.uk>", // Using your verified domain
      to: [primaryApplicant.email],
      cc: ["admin@palmerandpartners.com.au"],
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
      console.error("Error type:", typeof emailResponse.error);
      console.error("Error message:", emailResponse.error?.message || 'No error message');
      return false;
    }
    
    if (emailResponse.data) {
      console.log("Email sent successfully!");
      console.log("Email ID:", emailResponse.data.id);
      console.log("Email data:", JSON.stringify(emailResponse.data, null, 2));
      return true;
    } else {
      console.error("No data or error in response:", emailResponse);
      return false;
    }
    
  } catch (error) {
    console.error("Caught error in sendApplicationEmailWithPDF:", error);
    console.error("Error type:", typeof error);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    
    // Check if it's a network error
    if (error?.cause) {
      console.error("Error cause:", error.cause);
    }
    
    // Check if it's a Resend-specific error
    if (error?.response) {
      console.error("HTTP response status:", error.response?.status);
      console.error("HTTP response data:", error.response?.data);
    }
    
    return false;
  }
};

// PDF generation function (simplified version for edge function)
const generateApplicationPDF = async (data: any): Promise<string> => {
  console.log('Generating PDF for application...');
  // For now, return a placeholder base64 PDF
  // In a real implementation, you'd use a PDF library here
  const dummyPDF = "JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggMzMKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihUZW5hbmN5IEFwcGxpY2F0aW9uKSBUagpFVApEb25ld3N0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQ1IDAwMDAwIG4gCjAwMDAwMDAzMTYgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0MDAKJSVFT0Y=";
  console.log('PDF generated successfully');
  return dummyPDF;
};
