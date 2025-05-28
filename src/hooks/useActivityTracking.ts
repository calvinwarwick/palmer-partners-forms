
import { supabase } from "@/integrations/supabase/client";

interface ActivityLogData {
  applicationId?: string;
  action: string;
  userIdentifier?: string;
  details?: any;
}

export const useActivityTracking = () => {
  const logActivity = async (data: ActivityLogData) => {
    try {
      // Get IP address and user agent from browser
      const userAgent = navigator.userAgent;
      
      // For IP address, we'd need to use a service or get it from the server
      // For now, we'll leave it null and can implement later
      const ipAddress = null;

      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          application_id: data.applicationId,
          action: data.action,
          user_identifier: data.userIdentifier,
          ip_address: ipAddress,
          user_agent: userAgent,
          details: data.details
        }]);

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { logActivity };
};
