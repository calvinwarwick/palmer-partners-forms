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

const sendApplicationConfirmation = async (application: any): Promise<boolean> => {
  try {
    const primaryApplicant = application.applicants[0];
    
    const emailResponse = await resend.emails.send({
      from: "Palmer & Partners <onboarding@resend.dev>",
      to: [primaryApplicant.email],
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
    });

    console.log("Confirmation email sent:", emailResponse);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
};

const sendAdminNotification = async (application: any): Promise<boolean> => {
  try {
    const primaryApplicant = application.applicants[0];
    
    const emailResponse = await resend.emails.send({
      from: "Palmer & Partners System <onboarding@resend.dev>",
      to: ["admin@palmerandpartners.com.au"], // Replace with actual admin email
      subject: `New Tenancy Application - ${application.propertyPreferences.streetAddress}`,
      html: `
        <div style="font-family: 'Lexend', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #212121; padding: 30px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">New Application</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #212121; margin-bottom: 20px;">Application Details</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #212121; margin-top: 0;">Property Information:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li><strong>Address:</strong> ${application.propertyPreferences.streetAddress}</li>
                <li><strong>Postcode:</strong> ${application.propertyPreferences.postcode}</li>
                <li><strong>Max Rent:</strong> $${application.propertyPreferences.maxRent}</li>
                <li><strong>Move-in Date:</strong> ${application.propertyPreferences.moveInDate}</li>
              </ul>
            </div>
            
            <div style="background: #fff5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #212121; margin-top: 0;">Primary Applicant:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li><strong>Name:</strong> ${primaryApplicant.firstName} ${primaryApplicant.lastName}</li>
                <li><strong>Email:</strong> ${primaryApplicant.email}</li>
                <li><strong>Phone:</strong> ${primaryApplicant.phone}</li>
                <li><strong>Employment:</strong> ${primaryApplicant.employmentStatus}</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              <strong>Total Applicants:</strong> ${application.applicants.length}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleString()}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="display: inline-block; background: #FF6F00; color: white; padding: 15px 30px; border-radius: 6px; font-weight: bold; text-decoration: none;">
                Review Application
              </a>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Admin notification sent:", emailResponse);
    return true;
  } catch (error) {
    console.error("Error sending admin notification:", error);
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
    
    // 3. Send confirmation email (with error handling)
    try {
      const confirmationSent = await sendApplicationConfirmation(application);
      if (confirmationSent) {
        await supabase
          .from('activity_logs')
          .insert([{
            application_id: applicationId,
            action: 'Email Sent',
            user_identifier: 'System',
            details: {
              email_type: 'confirmation',
              recipient: primaryApplicant?.email
            }
          }]);
        console.log('Confirmation email sent successfully');
      }
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
      // Log the error but don't fail the entire process
      await supabase
        .from('activity_logs')
        .insert([{
          application_id: applicationId,
          action: 'Email Failed',
          user_identifier: 'System',
          details: {
            email_type: 'confirmation',
            error: emailError.message
          }
        }]);
    }
    
    // 4. Send admin notification (with error handling)
    try {
      const adminNotificationSent = await sendAdminNotification(application);
      if (adminNotificationSent) {
        await supabase
          .from('activity_logs')
          .insert([{
            application_id: applicationId,
            action: 'Email Sent',
            user_identifier: 'System',
            details: {
              email_type: 'admin_notification',
              recipient: 'admin'
            }
          }]);
        console.log('Admin notification sent successfully');
      }
    } catch (emailError) {
      console.error('Admin notification error:', emailError);
      await supabase
        .from('activity_logs')
        .insert([{
          application_id: applicationId,
          action: 'Email Failed',
          user_identifier: 'System',
          details: {
            email_type: 'admin_notification',
            error: emailError.message
          }
        }]);
    }
    
    // 5. Generate PDF (placeholder for future implementation)
    // TODO: Implement PDF generation in background
    console.log('PDF generation would happen here');
    
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
