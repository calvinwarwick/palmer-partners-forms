
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
    
    // Generate comprehensive PDF with all application data
    const pdfBase64 = await generateComprehensiveApplicationPDF(application);
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

// Comprehensive PDF generation function for edge environment
const generateComprehensiveApplicationPDF = async (data: any): Promise<string> => {
  console.log('Generating comprehensive PDF with all application data...');
  
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'long' });
      const year = date.getFullYear();
      
      const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    } catch {
      return dateString;
    }
  };

  // Build comprehensive PDF content with all application data
  let pdfContent = `
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
/F2 5 0 R
>>
>>
/Contents 6 0 R
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
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

6 0 obj
<<
/Length 2500
>>
stream
BT
/F2 24 Tf
50 750 Td
(Palmer & Partners - Tenancy Application) Tj
0 -40 Td

/F2 16 Tf
(Property Details) Tj
0 -25 Td
/F1 12 Tf
(Street Address: ${data.propertyPreferences?.streetAddress || 'N/A'}) Tj
0 -20 Td
(Postcode: ${data.propertyPreferences?.postcode || 'N/A'}) Tj
0 -20 Td
(Maximum Rent: £${data.propertyPreferences?.maxRent || 'N/A'}) Tj
0 -20 Td
(Move-in Date: ${formatDate(data.propertyPreferences?.moveInDate || '')}) Tj
0 -20 Td
(Latest Move-in Date: ${formatDate(data.propertyPreferences?.latestMoveInDate || '')}) Tj
0 -20 Td
(Initial Tenancy Term: ${data.propertyPreferences?.initialTenancyTerm || 'N/A'}) Tj
0 -30 Td

/F2 16 Tf
(Primary Applicant) Tj
0 -25 Td
/F1 12 Tf
(Name: ${data.applicants[0]?.firstName || ''} ${data.applicants[0]?.lastName || ''}) Tj
0 -20 Td
(Email: ${data.applicants[0]?.email || ''}) Tj
0 -20 Td
(Phone: ${data.applicants[0]?.phone || ''}) Tj
0 -20 Td
(Date of Birth: ${formatDate(data.applicants[0]?.dateOfBirth || '')}) Tj
0 -30 Td

/F2 16 Tf
(Employment Details) Tj
0 -25 Td
/F1 12 Tf
(Employment Status: ${data.applicants[0]?.employment || ''}) Tj
0 -20 Td
(Company Name: ${data.applicants[0]?.companyName || ''}) Tj
0 -20 Td
(Job Title: ${data.applicants[0]?.jobTitle || ''}) Tj
0 -20 Td
(Annual Income: £${data.applicants[0]?.annualIncome || ''}) Tj
0 -20 Td
(Length of Service: ${data.applicants[0]?.lengthOfService || ''}) Tj
0 -30 Td

/F2 16 Tf
(Current Address) Tj
0 -25 Td
/F1 12 Tf
(Current Address: ${data.applicants[0]?.currentAddress || ''}) Tj
0 -20 Td
(Current Postcode: ${data.applicants[0]?.currentPostcode || ''}) Tj
0 -20 Td
(Time at Address: ${data.applicants[0]?.timeAtAddress || ''}) Tj
0 -20 Td
(Landlord Name: ${data.applicants[0]?.landlordName || ''}) Tj
0 -20 Td
(Landlord Phone: ${data.applicants[0]?.landlordPhone || ''}) Tj
0 -20 Td
(Rent Up to Date: ${data.applicants[0]?.rentUpToDate === 'yes' ? 'Yes' : 'No'}) Tj
0 -30 Td

/F2 16 Tf
(Additional Information) Tj
0 -25 Td
/F1 12 Tf
(Pets: ${data.additionalDetails?.pets ? 'Yes' : 'No'}) Tj
0 -20 Td
(Under 18s: ${data.additionalDetails?.under18Count || '0'}) Tj
0 -20 Td
(UK/ROI Passport: ${data.additionalDetails?.ukPassport === 'yes' ? 'Yes' : 'No'}) Tj
0 -20 Td
(Adverse Credit: ${data.additionalDetails?.adverseCredit === 'yes' ? 'Yes' : 'No'}) Tj
0 -20 Td
(Guarantor Required: ${data.additionalDetails?.guarantorRequired === 'yes' ? 'Yes' : 'No'}) Tj
0 -20 Td
(Deposit Type: ${data.additionalDetails?.depositType || ''}) Tj
0 -30 Td

/F2 16 Tf
(Data Sharing) Tj
0 -25 Td
/F1 12 Tf
(Utilities: ${data.dataSharing?.utilities ? 'Yes' : 'No'}) Tj
0 -20 Td
(Insurance: ${data.dataSharing?.insurance ? 'Yes' : 'No'}) Tj
0 -30 Td

/F2 16 Tf
(Signature) Tj
0 -25 Td
/F1 12 Tf
(Signed: ${data.signature ? 'Digital Signature Applied' : 'Not Signed'}) Tj
0 -20 Td
(Submitted: ${new Date().toLocaleString()}) Tj

ET
endstream
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000245 00000 n 
0000000316 00000 n 
0000000392 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
2945
%%EOF`;
  
  // Convert to base64
  const base64 = btoa(pdfContent);
  console.log('Comprehensive PDF generated successfully with all application data');
  return base64;
};
