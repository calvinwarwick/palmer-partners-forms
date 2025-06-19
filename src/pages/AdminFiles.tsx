
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Settings } from "lucide-react";
import FileUploadTab from "@/components/admin/FileUploadTab";
import ApplicationHeader from "@/components/shared/ApplicationHeader";
import { sendEmail } from "@/services/api/emailApi";
import { generateApplicationPDF } from "@/services/pdfService";

const AdminFiles = () => {
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSendingTest(true);

    try {
      // Generate a sample application data for testing
      const sampleApplicationData = {
        applicants: [{
          id: "test-applicant-1",
          firstName: "John",
          lastName: "Doe", 
          email: testEmail,
          phone: "07123456789",
          dateOfBirth: "1990-01-01",
          employment: "Full-time Employment",
          companyName: "Test Company Ltd",
          jobTitle: "Software Developer",
          annualIncome: "50000",
          lengthOfService: "2 years",
          currentAddress: "123 Test Street",
          currentPostcode: "SW1A 1AA",
          timeAtAddress: "2 years",
          landlordName: "Test Landlord",
          landlordPhone: "07987654321",
          rentUpToDate: "yes",
          noticePeriod: "1 month",
          currentPropertyStatus: "Renting",
          currentRentalAmount: "1200",
          previousAddress: "456 Previous Road",
          previousPostcode: "SW1A 2BB",
          moveInDate: "2022-01-01",
          vacateDate: "2024-01-01",
          previousLandlordName: "Previous Landlord",
          previousLandlordPhone: "07111222333"
        }],
        propertyPreferences: {
          propertyType: "apartment",
          streetAddress: "789 Demo Property Lane, London",
          postcode: "SW1A 3CC",
          maxRent: "1500",
          preferredLocation: "Central London",
          moveInDate: "2024-02-01",
          latestMoveInDate: "2024-02-15",
          initialTenancyTerm: "12 months",
          additionalRequests: "Test additional requests"
        },
        additionalDetails: {
          pets: false,
          under18Count: "0",
          additionalRequests: "Test additional requests",
          depositType: "Traditional Deposit",
          ukPassport: "yes",
          adverseCredit: "no",
          guarantorRequired: "no"
        },
        dataSharing: {
          utilities: true,
          insurance: false
        },
        signature: "Test Digital Signature",
        submittedAt: new Date().toISOString(),
        applicationId: "TEST-" + Date.now()
      };

      console.log('Generating test PDF...');
      const pdfBuffer = await generateApplicationPDF(sampleApplicationData);
      console.log('Test PDF generated successfully, size:', pdfBuffer.byteLength, 'bytes');
      
      // Convert to base64 for email attachment
      const convertArrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      };
      
      const pdfBase64 = convertArrayBufferToBase64(pdfBuffer.buffer);
      console.log('Test PDF converted to base64, length:', pdfBase64.length);

      const testEmailContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Lexend', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .highlight { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .status-badge { display: inline-block; background: #FF6F00; color: white; padding: 15px 30px; border-radius: 6px; font-weight: bold; }
              .view-online-btn { display: inline-block; background: #212121; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 10px 0; }
              .test-banner { background: #dc3545; color: white; padding: 10px; text-align: center; font-weight: bold; margin-bottom: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="test-banner">🧪 TEST EMAIL - This is a test of the customer confirmation email system</div>
              <div class="header">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Application Received</h1>
              </div>
              
              <div class="content">
                <h2 style="color: #212121; margin-bottom: 20px;">Dear John Doe,</h2>
                
                <p style="margin-bottom: 20px;">
                  Thank you for submitting your tenancy application for <strong>789 Demo Property Lane, London</strong>.
                </p>
                
                <div class="highlight">
                  <h3 style="color: #212121; margin-top: 0;">Application Summary:</h3>
                  <ul style="margin: 0;">
                    <li>Property: 789 Demo Property Lane, London</li>
                    <li>Number of Applicants: 1</li>
                    <li>Preferred Move-in Date: 2024-02-01</li>
                    <li>Maximum Rent: £1500</li>
                  </ul>
                </div>
                
                <p style="margin-bottom: 20px;">
                  We'll review your application and get back to you within <strong style="color: #FF6F00;">2-3 business days</strong>.
                </p>
                
                <p style="margin-bottom: 20px;">
                  Please find your completed application form attached to this email for your records.
                </p>

                <div style="text-align: center; margin: 20px 0;">
                  <a href="${window.location.origin}/pdf/" class="view-online-btn" style="color: white; text-decoration: none;">
                    View Your Application Online
                  </a>
                  <p style="font-size: 14px; color: #666; margin-top: 10px;">
                    You can also view your application anytime at: ${window.location.origin}/pdf/
                  </p>
                </div>
                
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

      const success = await sendEmail({
        to: testEmail,
        subject: "TEST - Tenancy Application Confirmation - Palmer & Partners",
        html: testEmailContent,
        bcc: "calvinwarwick+admin@gmail.com",
        attachment: {
          filename: 'tenancy-application.pdf',
          content: pdfBase64,
          type: 'application/pdf'
        }
      });

      if (success) {
        toast.success(`Test confirmation email sent successfully to ${testEmail}`, {
          description: "Complete with PDF attachment - check your inbox and spam folder",
          duration: 5000,
        });
        setTestEmail("");
      } else {
        toast.error('Failed to send test confirmation email', {
          description: "Please check the console for more details",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error sending test confirmation email:', error);
      toast.error('Failed to send test confirmation email', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: 5000,
      });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader title="Admin Files & Tools" />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Admin Tools Section */}
        <Card className="mb-6 border-0 bg-white/95 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-dark-grey flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Tools
            </CardTitle>
            <CardDescription>
              Administrative tools for testing and management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-email" className="text-sm font-medium text-dark-grey">
                  Test Customer Confirmation Email
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="Enter email address to test..."
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !sendingTest) {
                        handleSendTestEmail();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendTestEmail}
                    disabled={sendingTest}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {sendingTest ? 'Sending...' : 'Send Test'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  This will send an exact replica of the customer confirmation email with PDF attachment, 
                  including all styling and content that customers receive when they submit their application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Management Section */}
        <FileUploadTab />
      </div>
    </div>
  );
};

export default AdminFiles;
