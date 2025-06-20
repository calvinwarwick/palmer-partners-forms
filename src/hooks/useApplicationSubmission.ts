
import { useState } from 'react';
import { Application } from '@/domain/types/Applicant';
import { supabase } from '@/integrations/supabase/client';
import { useActivityTracking } from './useActivityTracking';

export const useApplicationSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { logActivity } = useActivityTracking();

  const submitApplication = async (application: Application) => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting instant application submission:', application);
      
      // Show immediate success to user
      setIsSubmitted(true);
      
      // Schedule background processing
      const { error } = await supabase.functions.invoke('process-application', {
        body: {
          application,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Background processing scheduling error:', error);
        // Log the error for admin review
        await logActivity({
          action: 'Background Processing Failed',
          userIdentifier: `${application.applicants[0]?.firstName} ${application.applicants[0]?.lastName}`,
          details: {
            error: error.message,
            email: application.applicants[0]?.email
          }
        });
      } else {
        console.log('Background processing scheduled successfully');
      }
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsSubmitted(false);
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
