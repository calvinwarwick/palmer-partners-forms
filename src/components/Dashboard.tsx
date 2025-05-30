import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Users, FileText, Download, Plus, Settings, LogOut, Search, Filter, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";

interface DashboardProps {
  user: { username: string; role: string };
  onLogout: () => void;
}

interface TenancyApplication {
  id: string;
  applicants: Applicant[];
  property_preferences: PropertyPreferences;
  additional_details: AdditionalDetails;
  data_sharing: { utilities: boolean; insurance: boolean };
  signature: string;
  status: string;
  submitted_at: string;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [applications, setApplications] = useState<TenancyApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TenancyApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('tenancy_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Type cast the data properly to match our interface
      const typedData = (data || []).map(app => ({
        ...app,
        applicants: app.applicants as unknown as Applicant[],
        property_preferences: app.property_preferences as unknown as PropertyPreferences,
        additional_details: app.additional_details as unknown as AdditionalDetails,
        data_sharing: app.data_sharing as unknown as { utilities: boolean; insurance: boolean }
      }));

      setApplications(typedData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicants?.[0]?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicants?.[0]?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicants?.[0]?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.property_preferences?.streetAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tenancy_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "under_review":
        return "bg-blue-500 hover:bg-blue-600";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <Search className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const stats = [
    { 
      label: "Total Applications", 
      value: applications.length.toString(), 
      icon: FileText,
      color: "bg-blue-500",
      change: "+12%"
    },
    { 
      label: "Pending Review", 
      value: applications.filter(app => app.status === 'pending').length.toString(), 
      icon: Clock,
      color: "bg-yellow-500",
      change: "-8%"
    },
    { 
      label: "Approved", 
      value: applications.filter(app => app.status === 'approved').length.toString(), 
      icon: CheckCircle2,
      color: "bg-green-500",
      change: "+24%"
    },
    { 
      label: "This Month", 
      value: applications.filter(app => {
        const submitDate = new Date(app.submitted_at);
        const now = new Date();
        return submitDate.getMonth() === now.getMonth() && submitDate.getFullYear() === now.getFullYear();
      }).length.toString(), 
      icon: TrendingUp,
      color: "bg-purple-500",
      change: "+16%"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Estate Agent Dashboard</h1>
                <p className="text-gray-600">Manage applications and track performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-medium px-3 py-1">
                {user.role}
              </Badge>
              <span className="text-gray-700 font-medium">Welcome, {authUser?.email || user.username}</span>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-4 rounded-xl shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-white/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Applications Management</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  View and manage all tenancy applications
                </CardDescription>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Enhanced Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search applications by name, email, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 shadow-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 shadow-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enhanced Applications List */}
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-bold text-lg text-gray-900">
                            {app.applicants?.[0]?.firstName} {app.applicants?.[0]?.lastName}
                            {app.applicants?.length > 1 && (
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                                +{app.applicants.length - 1} more
                              </Badge>
                            )}
                          </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">Email:</span> {app.applicants?.[0]?.email}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Phone:</span> {app.applicants?.[0]?.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">Property:</span> {app.property_preferences?.streetAddress || 'N/A'}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Submitted:</span> {new Date(app.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Select 
                          value={app.status} 
                          onValueChange={(value) => updateApplicationStatus(app.id, value)}
                        >
                          <SelectTrigger className="w-40 bg-white border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge className={`text-white ${getStatusColor(app.status)} shadow-sm`}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">{app.status.replace('_', ' ')}</span>
                        </Badge>
                        <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-gray-200">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredApplications.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium mb-2">No applications found</p>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria" 
                      : "New applications will appear here"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
