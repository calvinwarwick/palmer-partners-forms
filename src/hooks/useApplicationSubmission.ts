
import { useState } from 'react';
import { sendApplicationConfirmation, sendAdminNotification } from '@/services/emailService';
import { Application } from '@/domain/types/Applicant';
import { toast } from 'sonner';

export const useApplicationSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitApplication = async (application: Application) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting application:', application);
      
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
