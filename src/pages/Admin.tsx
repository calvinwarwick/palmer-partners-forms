import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";
import { toast } from "sonner";
import AdminStats from "@/components/admin/AdminStats";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import ApplicationDetailsModal from "@/components/admin/ApplicationDetailsModal";
import ApplicantsTab from "@/components/admin/ApplicantsTab";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

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

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, dateFilter, customDateRange]);

  const fetchApplications = async () => {
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
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
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
          case "custom":
            if (customDateRange?.from && customDateRange?.to) {
              return isWithinInterval(submitDate, {
                start: startOfDay(customDateRange.from),
                end: endOfDay(customDateRange.to)
              });
            }
            return true;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 max-w-7xl">
        {/* Header - Mobile optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-2 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Manage tenancy applications and track performance</p>
            </div>
          </div>
        </div>

        {/* Statistics - Mobile responsive */}
        <div className="mb-4 sm:mb-6">
          <AdminStats applications={applications} />
        </div>

        {/* Tabs - Mobile optimized */}
        <Tabs defaultValue="applications" className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
            <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12 bg-gray-50 rounded-lg p-1">
              <TabsTrigger 
                value="applications" 
                className="text-sm sm:text-base lg:text-lg font-medium h-8 sm:h-10 rounded-md data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Applications
              </TabsTrigger>
              <TabsTrigger 
                value="applicants" 
                className="text-sm sm:text-base lg:text-lg font-medium h-8 sm:h-10 rounded-md data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Applicants
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="applications" className="space-y-4 sm:space-y-6">
            {/* Applications Table */}
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

          <TabsContent value="applicants">
            <Card className="shadow-sm border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <ApplicantsTab />
              </CardContent>
            </Card>
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
