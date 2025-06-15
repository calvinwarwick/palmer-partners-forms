
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { sendApplicationConfirmation, sendAdminNotification } from '../send-application-email/emailService.ts';

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
