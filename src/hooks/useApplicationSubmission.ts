
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendApplicationConfirmation, sendAdminNotification } from '@/services/emailService';
import { Application } from '../domain/types/Applicant';

export const useApplicationSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const submitApplication = async (application: Application) => {
    setIsSubmitting(true);
    
    try {
      console.log("Application submitted:", application);
      
      toast({
        title: "Sending confirmation...",
        description: "Please wait while we process your application.",
      });

      const [confirmationSent, adminNotified] = await Promise.all([
        sendApplicationConfirmation(application.applicants, application.propertyPreferences, application.signature),
        sendAdminNotification(application.applicants, application.propertyPreferences, application.signature)
      ]);

      if (confirmationSent) {
        toast({
          title: "Application Submitted Successfully!",
          description: `A confirmation email has been sent to ${application.applicants[0].email}`,
        });
      } else {
        toast({
          title: "Application Submitted",
          description: "Your application was submitted, but we couldn't send the confirmation email. Please contact us if you don't receive it shortly.",
          variant: "destructive",
        });
      }

      if (!adminNotified) {
        console.warn("Admin notification failed to send");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isSubmitted,
    submitApplication,
  };
};
