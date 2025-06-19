
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
      const testEmailContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #212121; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="background: white; color: #212121; padding: 8px 16px; display: inline-block; border-radius: 4px; font-weight: bold;">
              Palmer & Partners
            </div>
            <div style="height: 4px; background: #FF6F00; margin-top: 15px;"></div>
          </div>
          
          <h1 style="color: #212121; text-align: center; margin-bottom: 30px;">Test Email - Admin Panel</h1>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #212121; margin-top: 0;">Test Email Confirmation</h2>
            <p style="color: #666; margin-bottom: 0;">This is a test email sent from the admin panel to verify email functionality is working correctly.</p>
          </div>
          
          <div style="background: #FF6F00; color: white; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-weight: bold;">Email system is working properly! ✅</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This email was sent from the Palmer & Partners admin panel for testing purposes.
            </p>
          </div>
        </div>
      `;

      const success = await sendEmail({
        to: testEmail,
        subject: "Test Email - Palmer & Partners Admin Panel",
        html: testEmailContent,
        bcc: "calvinwarwick+admin@gmail.com"
      });

      if (success) {
        toast.success(`Test email sent successfully to ${testEmail}`);
        setTestEmail("");
      } else {
        toast.error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
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
                  Test Email Address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="Enter email address to test..."
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="flex-1"
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
                  This will send a test confirmation email to verify the email system is working
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
