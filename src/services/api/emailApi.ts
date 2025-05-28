
import { supabase } from '@/integrations/supabase/client';

export interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  attachment?: {
    filename: string;
    content: string;
    type: string;
  };
}

export const sendEmail = async (emailRequest: EmailRequest): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-application-email', {
      body: emailRequest,
    });

    if (error) {
      console.error('Email sending error:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};
