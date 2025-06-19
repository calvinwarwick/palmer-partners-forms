
import { supabase } from '@/integrations/supabase/client';

export interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  bcc?: string;
  attachment?: {
    filename: string;
    content: string;
    type: string;
  };
}

export const sendEmail = async (emailRequest: EmailRequest): Promise<boolean> => {
  try {
    console.log('Sending email to:', emailRequest.to);
    console.log('Email subject:', emailRequest.subject);
    console.log('Email has attachment:', !!emailRequest.attachment);
    console.log('Email BCC:', emailRequest.bcc);
    
    if (emailRequest.attachment) {
      console.log('Attachment filename:', emailRequest.attachment.filename);
      console.log('Attachment content length:', emailRequest.attachment.content.length);
      console.log('Attachment type:', emailRequest.attachment.type);
    }

    console.log('Invoking send-application-email function...');
    const { data, error } = await supabase.functions.invoke('send-application-email', {
      body: emailRequest,
    });

    if (error) {
      console.error('Email sending error details:', error);
      console.error('Error message:', error.message);
      return false;
    }

    console.log('Email sent successfully with response:', data);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
};
