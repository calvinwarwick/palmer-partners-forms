
import { saveApplicationToDatabase, logActivity } from './databaseService.ts';
import { sendApplicationEmailWithPDF } from './emailService.ts';

export async function processApplicationInBackground(supabase: any, application: any) {
  try {
    console.log('Starting background processing tasks...');
    
    // 1. Save to database
    const insertedData = await saveApplicationToDatabase(supabase, application);
    const applicationId = insertedData.id;
    const primaryApplicant = application.applicants[0];
    
    // 2. Log application submission
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
    try {
      const emailSent = await sendApplicationEmailWithPDF(application);
      if (emailSent) {
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
        console.log('Confirmation email with PDF sent successfully');
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
      await logActivity(supabase, {
        application_id: applicationId,
        action: 'Email Failed',
        user_identifier: 'System',
        details: {
          email_type: 'confirmation_with_admin_cc',
          error: emailError.message
        }
      });
    }
    
    console.log('Background processing completed successfully');
    
  } catch (error) {
    console.error('Background processing failed:', error);
    // Log the error for admin review
    try {
      await logActivity(supabase, {
        action: 'Background Processing Error',
        user_identifier: 'System',
        details: {
          error: error.message,
          application_data: application
        }
      });
    } catch (logError) {
      console.error('Failed to log background processing error:', logError);
    }
  }
}
