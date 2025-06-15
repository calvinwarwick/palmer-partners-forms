
import { saveApplicationToDatabase, logActivity } from './databaseService.ts';
import { sendApplicationEmailWithPDF } from './emailService.ts';

export async function processApplicationInBackground(supabase: any, application: any) {
  try {
    console.log('Starting background processing tasks...');
    
    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable not found');
      throw new Error('Email service not configured');
    }
    console.log('RESEND_API_KEY found, length:', resendApiKey.length);
    
    // 1. Save to database
    console.log('Saving application to database...');
    const insertedData = await saveApplicationToDatabase(supabase, application);
    const applicationId = insertedData.id;
    const primaryApplicant = application.applicants[0];
    console.log('Application saved with ID:', applicationId);
    
    // 2. Log application submission
    console.log('Logging application submission...');
    await logActivity(supabase, {
      application_id: applicationId,
      action: 'Application Submitted',
      user_identifier: `${primaryApplicant?.firstName} ${primaryApplicant?.lastName}`,
      details: {
        email: primaryApplicant?.email,
        property: application.propertyPreferences.streetAddress,
        applicant_count: application.applicants.length
      }
    });
    
    // 3. Send single email with PDF attachment (CC to admin)
    console.log('Attempting to send email...');
    try {
      const emailSent = await sendApplicationEmailWithPDF(application);
      if (emailSent) {
        console.log('Email sent successfully');
        await logActivity(supabase, {
          application_id: applicationId,
          action: 'Email Sent',
          user_identifier: 'System',
          details: {
            email_type: 'confirmation_with_admin_cc',
            recipient: primaryApplicant?.email,
            cc: 'admin@palmerandpartners.com.au'
          }
        });
        console.log('Email activity logged successfully');
      } else {
        console.error('Email sending failed - emailSent returned false');
        throw new Error('Email sending failed');
      }
    } catch (emailError) {
      console.error('Email error caught:', emailError);
      await logActivity(supabase, {
        application_id: applicationId,
        action: 'Email Failed',
        user_identifier: 'System',
        details: {
          email_type: 'confirmation_with_admin_cc',
          error: emailError.message,
          stack: emailError.stack
        }
      });
      // Don't throw here - we want to continue processing even if email fails
    }
    
    console.log('Background processing completed successfully');
    
  } catch (error) {
    console.error('Background processing failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Log the error for admin review
    try {
      await logActivity(supabase, {
        action: 'Background Processing Error',
        user_identifier: 'System',
        details: {
          error: error.message,
          stack: error.stack,
          application_data: application
        }
      });
    } catch (logError) {
      console.error('Failed to log background processing error:', logError);
    }
  }
}
