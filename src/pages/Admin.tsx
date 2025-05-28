import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";
import { toast } from "sonner";
import { Download, RefreshCw } from "lucide-react";
import AdminStats from "@/components/admin/AdminStats";
import ApplicationFilters from "@/components/admin/ApplicationFilters";
import BulkActions from "@/components/admin/BulkActions";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import ApplicationDetailsModal from "@/components/admin/ApplicationDetailsModal";
import ApplicantsTab from "@/components/admin/ApplicantsTab";

interface TenancyApplication {
  id: string;
  applicants: Applicant[];
  property_preferences: PropertyPreferences;
  additional_details: AdditionalDetails;
  data_sharing: { utilities: boolean; insurance: boolean };
  signature: string;
  submitted_at: string;
}

const Admin = () => {
  const [applications, setApplications] = useState<TenancyApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TenancyApplication[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<TenancyApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  // Filter states (removed statusFilter)
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, dateFilter]);

  // Auto-refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          fetchApplications(true);
          setProgress(0);
          return 15;
        }
        const newTimeLeft = prev - 1;
        setProgress((15 - newTimeLeft) / 15 * 100);
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('tenancy_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const typedData = data.map(app => ({
        ...app,
        applicants: app.applicants as unknown as Applicant[],
        property_preferences: app.property_preferences as unknown as PropertyPreferences,
        additional_details: app.additional_details as unknown as AdditionalDetails,
        data_sharing: app.data_sharing as unknown as { utilities: boolean; insurance: boolean }
      }));

      setApplications(typedData);
      if (showRefreshing) {
        toast.success('Applications refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setTimeLeft(15);
    setProgress(0);
    fetchApplications(true);
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicants.some(applicant => 
          applicant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.email?.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        app.property_preferences.streetAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.property_preferences.postcode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(app => {
        const submitDate = new Date(app.submitted_at);
        switch (dateFilter) {
          case "today":
            return submitDate.toDateString() === now.toDateString();
          case "this_week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return submitDate >= weekAgo;
          case "this_month":
            return submitDate.getMonth() === now.getMonth() && submitDate.getFullYear() === now.getFullYear();
          case "last_month":
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return submitDate >= lastMonth && submitDate < thisMonth;
          default:
            return true;
        }
      });
    }

    setFilteredApplications(filtered);
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
      setSelectedApplications(filteredApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleViewDetails = (application: TenancyApplication) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const handleBulkExport = () => {
    const selectedData = applications.filter(app => selectedApplications.includes(app.id));
    const csvContent = generateCSV(selectedData);
    downloadCSV(csvContent, 'selected-applications.csv');
    toast.success('Applications exported successfully');
  };

  const generateCSV = (data: TenancyApplication[]) => {
    const headers = [
      'First name',
      'Last name', 
      'Date of birth',
      'Mobile number',
      'Email address',
      'Postcode',
      'Street address',
      'Is rented?',
      'Vacate date'
    ];
    
    const rows = data.map(app => {
      const primaryApplicant = app.applicants[0];
      return [
        primaryApplicant?.firstName || '',
        primaryApplicant?.lastName || '',
        primaryApplicant?.dateOfBirth || '',
        primaryApplicant?.phone || '',
        primaryApplicant?.email || '',
        primaryApplicant?.previousPostcode || app.property_preferences?.postcode || '',
        primaryApplicant?.previousAddress || app.property_preferences?.streetAddress || '',
        primaryApplicant?.currentPropertyStatus === 'renting' ? 'Yes' : 'No',
        primaryApplicant?.vacateDate || ''
      ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("all");
    setSelectedApplications([]);
  };

  const hasActiveFilters = searchTerm !== "" || dateFilter !== "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg">Manage tenancy applications and track performance</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <style>{`
                  .progress-button {
                    position: relative;
                    overflow: hidden;
                    border: 2px solid transparent;
                  }
                  
                  .progress-button::before {
                    content: "";
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    width: ${progress}%;
                    height: calc(100% + 4px);
                    border: 2px solid #f97316;
                    border-radius: 8px;
                    box-sizing: border-box;
                    z-index: 0;
                    transition: width 1s linear;
                  }
                `}</style>
                <Button 
                  variant="outline" 
                  onClick={handleManualRefresh} 
                  disabled={refreshing} 
                  className="progress-button shadow-sm hover:shadow-md transition-shadow flex items-center gap-2 relative"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''} relative z-10`} />
                  <span className="text-xs font-medium opacity-50 relative z-10">{timeLeft}s</span>
                  <span className="relative z-10">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
              </div>
              <Button variant="outline" onClick={() => downloadCSV(generateCSV(filteredApplications), 'all-applications.csv')} className="shadow-sm hover:shadow-md transition-shadow">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <AdminStats applications={applications} />

        {/* Tabs */}
        <Tabs defaultValue="applications" className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-lg p-1 m-1">
              <TabsTrigger 
                value="applications" 
                className="text-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
              >
                Applications
              </TabsTrigger>
              <TabsTrigger 
                value="applicants" 
                className="text-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 data-[state=active]:border-orange-200"
              >
                Applicants
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="applications" className="space-y-6">
            {/* Filters Section */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <ApplicationFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  dateFilter={dateFilter}
                  onDateFilterChange={setDateFilter}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </CardContent>
            </Card>

            {/* Bulk Actions Section */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-0">
                <BulkActions
                  selectedApplications={selectedApplications}
                  onSelectAll={handleSelectAll}
                  onBulkExport={handleBulkExport}
                  totalApplications={filteredApplications.length}
                />
              </CardContent>
            </Card>

            {/* Applications Table */}
            <Card className="shadow-sm border border-gray-200 overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-200 py-6">
                <CardTitle className="flex items-center justify-between text-xl font-semibold text-gray-900">
                  <div className="flex items-center gap-4">
                    <span>Applications ({filteredApplications.length})</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-normal text-gray-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                        {selectedApplications.length} of {filteredApplications.length} selected
                      </span>
                      <ApplicationFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        dateFilter={dateFilter}
                        onDateFilterChange={setDateFilter}
                        onClearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                        compact={true}
                      />
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <span className="text-sm font-normal text-gray-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                      Showing {filteredApplications.length} of {applications.length} applications
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filteredApplications.length > 0 ? (
                  <ApplicationsTable
                    applications={filteredApplications}
                    selectedApplications={selectedApplications}
                    onSelectApplication={handleSelectApplication}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <div className="text-center py-16 bg-white">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4 text-lg">
                      {hasActiveFilters ? 'No applications match your current filters.' : 'No applications found.'}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters} className="shadow-sm hover:shadow-md transition-shadow">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applicants">
            <ApplicantsTab />
          </TabsContent>
        </Tabs>

        {/* Application Details Modal */}
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Admin;
