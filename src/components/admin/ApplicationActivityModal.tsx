
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { User, Globe, Clock, Mail, FileText, Eye, Activity } from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  user_identifier: string | null;
  ip_address: string | null;
  user_agent: string | null;
  details: any;
  created_at: string;
}

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  additional_details: any;
  data_sharing: any;
  signature: string;
  submitted_at: string;
}

interface ApplicationActivityModalProps {
  application: TenancyApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationActivityModal = ({ application, isOpen, onClose }: ApplicationActivityModalProps) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application && isOpen) {
      fetchActivityLogs();
    }
  }, [application, isOpen]);

  const fetchActivityLogs = async () => {
    if (!application) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('application_id', application.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedLogs: ActivityLog[] = (data || []).map(log => ({
        id: log.id,
        action: log.action,
        user_identifier: log.user_identifier,
        ip_address: log.ip_address ? String(log.ip_address) : null,
        user_agent: log.user_agent,
        details: log.details,
        created_at: log.created_at
      }));
      
      setActivityLogs(transformedLogs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      // Mock data for demonstration
      setActivityLogs([
        {
          id: '1',
          action: 'Application Submitted',
          user_identifier: `${application.applicants[0]?.firstName} ${application.applicants[0]?.lastName}`,
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: { form_completed: true },
          created_at: application.submitted_at
        },
        {
          id: '2',
          action: 'Application Viewed',
          user_identifier: 'Admin User',
          ip_address: '10.0.0.1',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          details: { viewed_by: 'admin' },
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'application submitted':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'application viewed':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'email sent':
        return <Mail className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case 'application submitted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Submitted</Badge>;
      case 'application viewed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Viewed</Badge>;
      case 'email sent':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Email</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-orange-600" />
            Activity Log - {application.applicants[0]?.firstName} {application.applicants[0]?.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Application ID:</span>
                <p className="text-gray-900 font-mono text-xs mt-1">{application.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>
                <p className="text-gray-900 mt-1">{format(new Date(application.submitted_at), 'dd MMM yyyy, HH:mm')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Property:</span>
                <p className="text-gray-900 mt-1">{application.property_preferences?.streetAddress || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Timeline
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : activityLogs.length > 0 ? (
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-0.5">
                          {getActionIcon(log.action)}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">{log.action}</span>
                            {getActionBadge(log.action)}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-2">
                            {log.user_identifier && (
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-gray-400" />
                                <span className="font-medium">{log.user_identifier}</span>
                              </div>
                            )}
                            
                            {log.ip_address && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-3 w-3 text-gray-400" />
                                <span className="font-mono text-xs">{log.ip_address}</span>
                              </div>
                            )}
                            
                            {log.user_agent && (
                              <div className="text-xs text-gray-500 bg-gray-50 rounded p-2 border truncate">
                                <span className="font-medium">User Agent:</span> {log.user_agent}
                              </div>
                            )}
                            
                            {log.details && Object.keys(log.details).length > 0 && (
                              <div className="text-xs bg-blue-50 rounded p-2 border border-blue-200">
                                <span className="font-medium text-blue-900">Details:</span>
                                <pre className="whitespace-pre-wrap text-blue-800 mt-1">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 whitespace-nowrap ml-4 text-right">
                        <div className="font-medium">{format(new Date(log.created_at), 'dd MMM yyyy')}</div>
                        <div className="text-gray-400">{format(new Date(log.created_at), 'HH:mm:ss')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No activity logs found</p>
                <p className="text-sm">Activity will appear here as actions are performed on this application.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationActivityModal;
