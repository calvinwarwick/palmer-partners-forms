
import { useState } from 'react';
import { sendApplicationConfirmation, sendAdminNotification } from '@/services/emailService';
import { Application } from '@/domain/types/Applicant';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useApplicationSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitApplication = async (application: Application) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting application:', application);
      
      // Save to database first
      const { error: dbError } = await supabase
        .from('tenancy_applications')
        .insert({
          applicants: application.applicants,
          property_preferences: application.propertyPreferences,
          additional_details: application.additionalDetails,
          data_sharing: application.dataSharing,
          signature: application.signature,
          status: 'pending'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save application');
      }
      
      // Send confirmation email to applicant
      const confirmationSent = await sendApplicationConfirmation(
        application.applicants,
        application.propertyPreferences,
        application.additionalDetails,
        application.dataSharing,
        application.signature
      );
      
      // Send notification to admin
      const adminNotificationSent = await sendAdminNotification(
        application.applicants,
        application.propertyPreferences,
        application.additionalDetails,
        application.dataSharing,
        application.signature
      );
      
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
