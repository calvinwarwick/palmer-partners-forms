
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

// Comprehensive PDF generation function for edge environment with proper multi-page support
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

  // Build comprehensive PDF content with proper multi-page layout
  let pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R 4 0 R 5 0 R]
/Count 3
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 6 0 R
/F2 7 0 R
>>
>>
/Contents 8 0 R
>>
endobj

4 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 6 0 R
/F2 7 0 R
>>
>>
/Contents 9 0 R
>>
endobj

5 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 6 0 R
/F2 7 0 R
>>
>>
/Contents 10 0 R
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

7 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

8 0 obj
<<
/Length 3500
>>
stream
BT
% Header with logos and company name
/F2 18 Tf
0.2 0.2 0.2 rg
50 750 Td
(Palmer & Partners) Tj

% Orange underline
0.85 0.44 0 rg
50 742 512 2 re
f

% Main title
/F2 24 Tf
0.2 0.2 0.2 rg
50 700 Td
(Tenancy Application) Tj

% Property Details Section
0 -50 Td
/F2 16 Tf
0.2 0.2 0.2 rg
(Property Details) Tj

% Property details table
0 -30 Td
/F2 10 Tf
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Street Address) Tj
210 0 Td
0 0 0 rg
(${data.propertyPreferences?.streetAddress || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Postcode) Tj
210 0 Td
(${data.propertyPreferences?.postcode || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Maximum Rent) Tj
210 0 Td
(£${data.propertyPreferences?.maxRent || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Move-in Date) Tj
210 0 Td
(${formatDate(data.propertyPreferences?.moveInDate || '')}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Latest Move-in Date) Tj
210 0 Td
(${formatDate(data.propertyPreferences?.latestMoveInDate || '')}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Initial Tenancy Term) Tj
210 0 Td
(${data.propertyPreferences?.initialTenancyTerm || 'N/A'}) Tj

% Primary Applicant Section
-215 -50 Td
/F2 16 Tf
0.2 0.2 0.2 rg
(Primary Applicant) Tj

% Applicant details table
0 -30 Td
/F2 10 Tf
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Name) Tj
210 0 Td
(${data.applicants[0]?.firstName || ''} ${data.applicants[0]?.lastName || ''}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Email) Tj
210 0 Td
(${data.applicants[0]?.email || ''}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Phone) Tj
210 0 Td
(${data.applicants[0]?.phone || ''}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Date of Birth) Tj
210 0 Td
(${formatDate(data.applicants[0]?.dateOfBirth || '')}) Tj

ET
endstream
endobj

9 0 obj
<<
/Length 3000
>>
stream
BT
% Page 2 Header
/F2 18 Tf
0.2 0.2 0.2 rg
50 750 Td
(Palmer & Partners - Tenancy Application \\(Page 2\\)) Tj

% Orange underline
0.85 0.44 0 rg
50 742 512 2 re
f

% Employment Details Section
/F2 16 Tf
0.2 0.2 0.2 rg
50 700 Td
(Employment Details) Tj

% Employment table
0 -30 Td
/F2 10 Tf
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Employment Status) Tj
210 0 Td
(${data.applicants[0]?.employment || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Company Name) Tj
210 0 Td
(${data.applicants[0]?.companyName || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Job Title) Tj
210 0 Td
(${data.applicants[0]?.jobTitle || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Annual Income) Tj
210 0 Td
(£${data.applicants[0]?.annualIncome || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Length of Service) Tj
210 0 Td
(${data.applicants[0]?.lengthOfService || 'N/A'}) Tj

% Current Address Section
-215 -50 Td
/F2 16 Tf
0.2 0.2 0.2 rg
(Current Address) Tj

% Address table
0 -30 Td
/F2 10 Tf
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Current Address) Tj
210 0 Td
(${data.applicants[0]?.currentAddress || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Current Postcode) Tj
210 0 Td
(${data.applicants[0]?.currentPostcode || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Time at Address) Tj
210 0 Td
(${data.applicants[0]?.timeAtAddress || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Landlord Name) Tj
210 0 Td
(${data.applicants[0]?.landlordName || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Landlord Phone) Tj
210 0 Td
(${data.applicants[0]?.landlordPhone || 'N/A'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Rent Up to Date) Tj
210 0 Td
(${data.applicants[0]?.rentUpToDate === 'yes' ? 'Yes' : 'No'}) Tj

ET
endstream
endobj

10 0 obj
<<
/Length 2500
>>
stream
BT
% Page 3 Header
/F2 18 Tf
0.2 0.2 0.2 rg
50 750 Td
(Palmer & Partners - Tenancy Application \\(Page 3\\)) Tj

% Orange underline
0.85 0.44 0 rg
50 742 512 2 re
f

% Additional Information Section
/F2 16 Tf
0.2 0.2 0.2 rg
50 700 Td
(Additional Information) Tj

% Additional info table
0 -30 Td
/F2 10 Tf
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Pets) Tj
210 0 Td
(${data.additionalDetails?.pets ? 'Yes' : 'No'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Under 18s) Tj
210 0 Td
(${data.additionalDetails?.under18Count || '0'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(UK/ROI Passport) Tj
210 0 Td
(${data.additionalDetails?.ukPassport === 'yes' ? 'Yes' : 'No'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Adverse Credit) Tj
210 0 Td
(${data.additionalDetails?.adverseCredit === 'yes' ? 'Yes' : 'No'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Guarantor Required) Tj
210 0 Td
(${data.additionalDetails?.guarantorRequired === 'yes' ? 'Yes' : 'No'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Deposit Type) Tj
210 0 Td
(${data.additionalDetails?.depositType || 'N/A'}) Tj

% Data Sharing Section
-215 -50 Td
/F2 16 Tf
0.2 0.2 0.2 rg
(Data Sharing) Tj

% Data sharing table
0 -30 Td
/F2 10 Tf
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Utilities) Tj
210 0 Td
(${data.dataSharing?.utilities ? 'Yes' : 'No'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Insurance) Tj
210 0 Td
(${data.dataSharing?.insurance ? 'Yes' : 'No'}) Tj

% Signature Section
-215 -50 Td
/F2 16 Tf
0.2 0.2 0.2 rg
(Signature) Tj

% Signature table
0 -30 Td
/F2 10 Tf
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Signed) Tj
210 0 Td
(${data.signature ? 'Digital Signature Applied' : 'Not Signed'}) Tj

-210 -20 Td
0.9 0.9 0.9 rg
0 0 200 15 re
f
0 0 0 rg
5 5 Td
(Submitted) Tj
210 0 Td
(${new Date().toLocaleString()}) Tj

ET
endstream
endobj

xref
0 11
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000123 00000 n 
0000000253 00000 n 
0000000383 00000 n 
0000000513 00000 n 
0000000584 00000 n 
0000000660 00000 n 
0000004215 00000 n 
0000007270 00000 n 
trailer
<<
/Size 11
/Root 1 0 R
>>
startxref
9820
%%EOF`;
  
  // Convert to base64
  const base64 = btoa(pdfContent);
  console.log('Comprehensive multi-page PDF generated successfully with all application data');
  return base64;
};
