
import { useState } from 'react';
import { sendApplicationConfirmation, sendAdminNotification } from '@/services/domain/ApplicationService';
import { Application } from '@/domain/types/Applicant';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useActivityTracking } from './useActivityTracking';

export const useApplicationSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { logActivity } = useActivityTracking();

  const submitApplication = async (application: Application) => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting application submission:', application);
      
      // Save to database first - using the correct column names
      const { data: insertedData, error: dbError } = await supabase
        .from('tenancy_applications')
        .insert([{
          applicants: application.applicants as any,
          property_preferences: application.propertyPreferences as any,
          additional_details: application.additionalDetails as any,
          data_sharing: application.dataSharing as any,
          signature: application.signature,
          status: 'pending'
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save application');
      }

      console.log('Application saved to database successfully:', insertedData.id);

      const applicationId = insertedData.id;
      const primaryApplicant = application.applicants[0];
      
      // Log application submission
      await logActivity({
        applicationId,
        action: 'Application Submitted',
        userIdentifier: `${primaryApplicant?.firstName} ${primaryApplicant?.lastName}`,
        details: {
          email: primaryApplicant?.email,
          property: application.propertyPreferences.streetAddress,
          applicant_count: application.applicants.length
        }
      });
      
      console.log('About to send confirmation email...');
      
      // Send confirmation email to applicant with error handling
      let confirmationSent = false;
      try {
        confirmationSent = await sendApplicationConfirmation(application);
        console.log('Confirmation email result:', confirmationSent);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the entire submission for email errors
        confirmationSent = false;
      }
      
      if (confirmationSent) {
        // Log email sent
        await logActivity({
          applicationId,
          action: 'Email Sent',
          userIdentifier: 'System',
          details: {
            email_type: 'confirmation',
            recipient: primaryApplicant?.email
          }
        });
      }
      
      console.log('About to send admin notification...');
      
      // Send notification to admin with error handling
      let adminNotificationSent = false;
      try {
        adminNotificationSent = await sendAdminNotification(application);
        console.log('Admin notification result:', adminNotificationSent);
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError);
        // Don't fail the entire submission for email errors
        adminNotificationSent = false;
      }
      
      if (adminNotificationSent) {
        // Log admin notification sent
        await logActivity({
          applicationId,
          action: 'Email Sent',
          userIdentifier: 'System',
          details: {
            email_type: 'admin_notification',
            recipient: 'admin'
          }
        });
      }
      
      // Mark as submitted even if emails fail
      setIsSubmitted(true);
      
      if (confirmationSent && adminNotificationSent) {
        toast.success('Application submitted successfully with email notifications!');
      } else if (!confirmationSent && !adminNotificationSent) {
        toast.success('Application submitted successfully (email notifications failed - will be sent manually)');
      } else {
        toast.success('Application submitted successfully (some email notifications failed)');
      }
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isSubmitted,
    submitApplication
  };
};
