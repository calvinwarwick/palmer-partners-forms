
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
    console.log('Sending email to:', emailRequest.to);
    console.log('Email has attachment:', !!emailRequest.attachment);
    if (emailRequest.attachment) {
      console.log('Attachment filename:', emailRequest.attachment.filename);
      console.log('Attachment content length:', emailRequest.attachment.content.length);
      console.log('Attachment type:', emailRequest.attachment.type);
    }

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
