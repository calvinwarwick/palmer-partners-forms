
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar as CalendarIcon, Activity, FileText, Eye, Download } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: 'form_opened' | 'form_submitted' | 'application_viewed' | 'pdf_generated';
  applicationId?: string;
  applicantName?: string;
  ipAddress: string;
  userAgent?: string;
  details?: string;
}

const ActivityLog = () => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLog();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, actionFilter]);

  const fetchActivityLog = async () => {
    // Mock data for now - in real implementation, this would fetch from database
    const mockActivities: ActivityLogEntry[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        action: 'form_opened',
        applicantName: 'John Doe',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Form opened for property at 123 Main St'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'form_submitted',
        applicationId: 'app-123',
        applicantName: 'Jane Smith',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        details: 'Application submitted successfully'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        action: 'application_viewed',
        applicationId: 'app-123',
        applicantName: 'Admin User',
        ipAddress: '10.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Application preview accessed by admin'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        action: 'pdf_generated',
        applicationId: 'app-123',
        applicantName: 'Admin User',
        ipAddress: '10.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'PDF report generated for Jane Smith application'
      }
    ];

    setActivities(mockActivities);
    setLoading(false);
  };

  const filterActivities = () => {
    let filtered = activities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.ipAddress.includes(searchTerm) ||
        activity.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== "all") {
      filtered = filtered.filter(activity => activity.action === actionFilter);
    }

    setFilteredActivities(filtered);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'form_opened':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Eye className="h-3 w-3 mr-1" />
          Form Opened
        </Badge>;
      case 'form_submitted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <FileText className="h-3 w-3 mr-1" />
          Form Submitted
        </Badge>;
      case 'application_viewed':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <Eye className="h-3 w-3 mr-1" />
          Application Viewed
        </Badge>;
      case 'pdf_generated':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Download className="h-3 w-3 mr-1" />
          PDF Generated
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">
                Activity Log ({filteredActivities.length})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input w-64 h-9 text-sm pl-10"
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="form_opened">Form Opened</SelectItem>
                <SelectItem value="form_submitted">Form Submitted</SelectItem>
                <SelectItem value="application_viewed">Application Viewed</SelectItem>
                <SelectItem value="pdf_generated">PDF Generated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      {filteredActivities.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Timestamp</TableHead>
                <TableHead className="font-semibold">Action</TableHead>
                <TableHead className="font-semibold">User/Applicant</TableHead>
                <TableHead className="font-semibold">IP Address</TableHead>
                <TableHead className="font-semibold">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900">
                        {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getActionBadge(activity.action)}
                  </TableCell>
                  
                  <TableCell>
                    <p className="font-medium text-gray-900">
                      {activity.applicantName || 'Unknown'}
                    </p>
                  </TableCell>
                  
                  <TableCell>
                    <p className="text-sm font-mono text-gray-600">
                      {activity.ipAddress}
                    </p>
                  </TableCell>
                  
                  <TableCell>
                    <p className="text-sm text-gray-600">
                      {activity.details}
                    </p>
                    {activity.applicationId && (
                      <p className="text-xs text-gray-400 mt-1">
                        App ID: {activity.applicationId}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border rounded-lg">
          <div className="text-gray-400 mb-4">
            <Activity className="mx-auto h-16 w-16" />
          </div>
          <p className="text-gray-500 mb-4 text-lg">
            {searchTerm || actionFilter !== "all" ? "No activities found matching your search." : "No activity logs found."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
