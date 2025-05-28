import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";
import { toast } from "sonner";
import { Download, Plus, RefreshCw } from "lucide-react";
import AdminStats from "@/components/admin/AdminStats";
import ApplicationFilters from "@/components/admin/ApplicationFilters";
import BulkActions from "@/components/admin/BulkActions";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import ApplicationDetailsModal from "@/components/admin/ApplicationDetailsModal";

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

  // Filter states (removed statusFilter)
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, dateFilter]);

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
      toast.success('Applications refreshed successfully');
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage tenancy applications and track performance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => fetchApplications(true)} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => downloadCSV(generateCSV(filteredApplications), 'all-applications.csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <AdminStats applications={applications} />

      {/* Filters */}
      <ApplicationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedApplications={selectedApplications}
        onSelectAll={handleSelectAll}
        onBulkExport={handleBulkExport}
        totalApplications={filteredApplications.length}
      />

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Applications ({filteredApplications.length})</span>
            {hasActiveFilters && (
              <span className="text-sm font-normal text-gray-500">
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
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {hasActiveFilters ? 'No applications match your current filters.' : 'No applications found.'}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
};

export default Admin;
