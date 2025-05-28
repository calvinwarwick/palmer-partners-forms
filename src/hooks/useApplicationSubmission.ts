
import { useState } from 'react';
import { sendApplicationConfirmation, sendAdminNotification } from '@/services/emailService';
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
      console.log('Submitting application:', application);
      
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
      
      // Send confirmation email to applicant
      const confirmationSent = await sendApplicationConfirmation(
        application.applicants,
        application.propertyPreferences,
        application.additionalDetails,
        application.dataSharing,
        application.signature
      );
      
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
      
      // Send notification to admin
      const adminNotificationSent = await sendAdminNotification(
        application.applicants,
        application.propertyPreferences,
        application.additionalDetails,
        application.dataSharing,
        application.signature
      );
      
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
      
      if (confirmationSent && adminNotificationSent) {
        setIsSubmitted(true);
        toast.success('Application submitted successfully!');
      } else {
        throw new Error('Failed to send emails');
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
