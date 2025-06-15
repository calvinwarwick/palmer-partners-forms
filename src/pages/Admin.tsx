import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Users, FileText, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import AdminStats from "@/components/admin/AdminStats";
import ApplicantsTab from "@/components/admin/ApplicantsTab";
import ApplicationHeader from "@/components/shared/ApplicationHeader";

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  additional_details: any;
  data_sharing: any;
  signature: string;
  submitted_at: string;
}

const Admin = () => {
  const { user, signOut } = useAuth();
  const [applications, setApplications] = useState<TenancyApplication[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('tenancy_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to fetch applications');
      } else {
        // Cast the Supabase data to match our TenancyApplication interface
        const typedApplications = (data || []).map(app => ({
          ...app,
          applicants: app.applicants as any[],
          property_preferences: app.property_preferences as any,
          additional_details: app.additional_details as any,
          data_sharing: app.data_sharing as any,
        })) as TenancyApplication[];
        
        setApplications(typedApplications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplication = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, id]);
    } else {
      setSelectedApplications(prev => prev.filter(appId => appId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(applications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleBulkExport = () => {
    toast.info("Bulk export functionality will be implemented soon");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const filterApplications = () => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => {
        const primaryApplicant = app.applicants?.[0];
        const searchLower = searchTerm.toLowerCase();
        
        return (
          primaryApplicant?.firstName?.toLowerCase().includes(searchLower) ||
          primaryApplicant?.lastName?.toLowerCase().includes(searchLower) ||
          primaryApplicant?.email?.toLowerCase().includes(searchLower) ||
          app.property_preferences?.streetAddress?.toLowerCase().includes(searchLower) ||
          app.property_preferences?.postcode?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let filterDate: Date;

      switch (dateFilter) {
        case "today":
          filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          filtered = filtered.filter(app => new Date(app.submitted_at) >= filterDate);
          break;
        case "this_week":
          filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(app => new Date(app.submitted_at) >= filterDate);
          break;
        case "this_month":
          filterDate = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(app => new Date(app.submitted_at) >= filterDate);
          break;
        case "last_month":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(app => {
            const appDate = new Date(app.submitted_at);
            return appDate >= lastMonth && appDate < thisMonth;
          });
          break;
        case "custom":
          if (customDateRange?.from && customDateRange?.to) {
            filtered = filtered.filter(app => {
              const appDate = new Date(app.submitted_at);
              return appDate >= customDateRange.from && appDate <= customDateRange.to;
            });
          }
          break;
      }
    }

    return filtered;
  };

  const filteredApplications = filterApplications();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
        <ApplicationHeader title="Admin Dashboard" />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader title="Admin Dashboard" />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Welcome Card */}
        <Card className="mb-4 sm:mb-8 border-0 bg-white/95 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-dark-grey mb-2">Welcome back!</h1>
                <p className="text-sm sm:text-base text-light-grey break-all sm:break-normal">
                  Logged in as: <span className="font-medium text-dark-grey">{user?.email}</span>
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-orange-300 text-orange-600 hover:bg-orange-50 w-full sm:w-auto"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="stats" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/95 backdrop-blur-sm h-auto p-1">
            <TabsTrigger value="stats" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Applications</span>
              <span className="sm:hidden">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="applicants" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Applicants</span>
              <span className="sm:hidden">People</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-4 sm:mt-6">
            <AdminStats applications={applications} />
          </TabsContent>

          <TabsContent value="applications" className="mt-4 sm:mt-6">
            <ApplicationsTable
              applications={filteredApplications}
              selectedApplications={selectedApplications}
              onSelectApplication={handleSelectApplication}
              onSelectAll={handleSelectAll}
              onBulkExport={handleBulkExport}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              customDateRange={customDateRange}
              onCustomDateRangeChange={setCustomDateRange}
            />
          </TabsContent>

          <TabsContent value="applicants" className="mt-4 sm:mt-6">
            <ApplicantsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
