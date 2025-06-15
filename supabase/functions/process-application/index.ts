import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from 'npm:resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessApplicationRequest {
  application: {
    applicants: any[];
    propertyPreferences: any;
    additionalDetails: any;
    dataSharing: any;
    signature: string;
  };
  timestamp: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// PDF generation function (simplified version for edge function)
const generateApplicationPDF = async (data: any): Promise<string> => {
  // For now, return a placeholder base64 PDF
  // In a real implementation, you'd use a PDF library here
  const dummyPDF = "JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggMzMKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihUZW5hbmN5IEFwcGxpY2F0aW9uKSBUagpFVApEb25ld3N0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQ1IDAwMDAwIG4gCjAwMDAwMDAzMTYgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0MDAKJSVFT0Y=";
  return dummyPDF;
};

const sendApplicationEmailWithPDF = async (application: any): Promise<boolean> => {
  try {
    const primaryApplicant = application.applicants[0];
    
    // Generate PDF
    const pdfBase64 = await generateApplicationPDF(application);
    
    const emailResponse = await resend.emails.send({
      from: "Palmer & Partners <submitted@forms.palmerpartners.uk>",
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

    console.log("Application email with PDF sent:", emailResponse);
    return true;
  } catch (error) {
    console.error("Error sending application email:", error);
    return false;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { application, timestamp }: ProcessApplicationRequest = await req.json();
    
    console.log('Processing application in background:', timestamp);
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Start background processing (don't await - let it run in background)
    processApplicationInBackground(supabase, application);
    
    // Return immediate success
    return new Response(
      JSON.stringify({ success: true, message: 'Background processing started' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error starting background processing:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function processApplicationInBackground(supabase: any, application: any) {
  try {
    console.log('Starting background processing tasks...');
    
    // 1. Save to database
    const { data: insertedData, error: dbError } = await supabase
      .from('tenancy_applications')
      .insert([{
        applicants: application.applicants,
        property_preferences: application.propertyPreferences,
        additional_details: application.additionalDetails,
        data_sharing: application.dataSharing,
        signature: application.signature,
        status: 'pending'
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database save error:', dbError);
      throw new Error('Failed to save application');
    }

    console.log('Application saved to database:', insertedData.id);
    const applicationId = insertedData.id;
    const primaryApplicant = application.applicants[0];
    
    // 2. Log application submission
    await supabase
      .from('activity_logs')
      .insert([{
        application_id: applicationId,
        action: 'Application Submitted',
        user_identifier: `${primaryApplicant?.firstName} ${primaryApplicant?.lastName}`,
        details: {
          email: primaryApplicant?.email,
          property: application.propertyPreferences.streetAddress,
          applicant_count: application.applicants.length
        }
      }]);
    
    // 3. Send single email with PDF attachment (CC to admin)
    try {
      const emailSent = await sendApplicationEmailWithPDF(application);
      if (emailSent) {
        await supabase
          .from('activity_logs')
          .insert([{
            application_id: applicationId,
            action: 'Email Sent',
            user_identifier: 'System',
            details: {
              email_type: 'confirmation_with_admin_cc',
              recipient: primaryApplicant?.email,
              cc: 'admin@palmerandpartners.com.au'
            }
          }]);
        console.log('Confirmation email with PDF sent successfully');
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
      await supabase
        .from('activity_logs')
        .insert([{
          application_id: applicationId,
          action: 'Email Failed',
          user_identifier: 'System',
          details: {
            email_type: 'confirmation_with_admin_cc',
            error: emailError.message
          }
        }]);
    }
    
    console.log('Background processing completed successfully');
    
  } catch (error) {
    console.error('Background processing failed:', error);
    // Log the error for admin review
    try {
      await supabase
        .from('activity_logs')
        .insert([{
          action: 'Background Processing Error',
          user_identifier: 'System',
          details: {
            error: error.message,
            application_data: application
          }
        }]);
    } catch (logError) {
      console.error('Failed to log background processing error:', logError);
    }
  }
}

serve(handler);
