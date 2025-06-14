
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";
import { toast } from "sonner";
import AdminStats from "@/components/admin/AdminStats";
import ApplicationDetailsModal from "@/components/admin/ApplicationDetailsModal";
import ApplicantsTab from "@/components/admin/ApplicantsTab";
import ApplicationHeader from "@/components/shared/ApplicationHeader";
import AdminSearchFilters from "@/components/admin/AdminSearchFilters";
import BulkActions from "@/components/admin/BulkActions";
import AdminTableRow from "@/components/admin/AdminTableRow";
import ApplicationActivityModal from "@/components/admin/ApplicationActivityModal";
import ApplicationPreviewContent from "@/components/admin/ApplicationPreviewContent";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";
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
  const { generatePdf } = usePdfGeneration();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);

  // Activity and preview modals
  const [selectedApplicationForActivity, setSelectedApplicationForActivity] = useState<TenancyApplication | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedApplicationForPreview, setSelectedApplicationForPreview] = useState<TenancyApplication | null>(null);
  const [isPreviewSheetOpen, setIsPreviewSheetOpen] = useState(false);

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

  const handleViewApplication = (application: TenancyApplication) => {
    setSelectedApplicationForPreview(application);
    setIsPreviewSheetOpen(true);
  };

  const handleDownloadPdf = async (application: TenancyApplication) => {
    const pdfData = {
      applicants: application.applicants,
      propertyPreferences: application.property_preferences,
      additionalDetails: application.additional_details,
      dataSharing: application.data_sharing,
      signature: application.signature,
      submittedAt: application.submitted_at
    };

    const primaryApplicant = application.applicants[0];
    const filename = `${primaryApplicant?.firstName || 'Unknown'}_${primaryApplicant?.lastName || 'Applicant'}_Application.pdf`;
    
    await generatePdf(pdfData, filename);
  };

  const handleViewActivity = (application: TenancyApplication) => {
    setSelectedApplicationForActivity(application);
    setIsActivityModalOpen(true);
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
      <ApplicationHeader title="Admin Dashboard" />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 max-w-7xl">
        {/* Statistics */}
        <div className="mb-6">
          <AdminStats applications={applications} />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <AdminSearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            customDateRange={customDateRange}
            onCustomDateRangeChange={setCustomDateRange}
            totalApplications={applications.length}
            filteredCount={filteredApplications.length}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-50 rounded-lg p-1">
              <TabsTrigger 
                value="applications" 
                className="text-base font-medium h-10 rounded-md data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Applications
              </TabsTrigger>
              <TabsTrigger 
                value="applicants" 
                className="text-base font-medium h-10 rounded-md data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Applicants
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="applications" className="space-y-6">
            {/* Bulk Actions */}
            <BulkActions
              selectedApplications={selectedApplications}
              onSelectAll={handleSelectAll}
              onBulkExport={handleBulkExport}
              totalApplications={filteredApplications.length}
            />

            {/* Applications Table */}
            <Card className="shadow-sm border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                {filteredApplications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b">
                          <TableHead className="w-12"></TableHead>
                          <TableHead className="font-semibold text-gray-900">Applicant</TableHead>
                          <TableHead className="font-semibold text-gray-900">Property</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-center">Submitted</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-center">Site</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.map((application) => (
                          <AdminTableRow
                            key={application.id}
                            application={application}
                            isSelected={selectedApplications.includes(application.id)}
                            onSelect={handleSelectApplication}
                            onView={handleViewApplication}
                            onDownload={handleDownloadPdf}
                            onViewActivity={handleViewActivity}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4 text-lg">
                      {searchTerm || dateFilter !== "all" ? "No applications found matching your search." : "No applications found."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applicants">
            <Card className="shadow-sm border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <ApplicantsTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals and Sheets */}
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />

        <Sheet open={isPreviewSheetOpen} onOpenChange={setIsPreviewSheetOpen}>
          <SheetContent className="w-full sm:max-w-4xl h-full p-0">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b bg-white">
                <h2 className="text-xl font-semibold text-gray-900">Application Preview</h2>
              </div>
              <div className="flex-1 p-6 overflow-auto bg-gray-50">
                {selectedApplicationForPreview && (
                  <ApplicationPreviewContent application={selectedApplicationForPreview} />
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <ApplicationActivityModal
          application={selectedApplicationForActivity}
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Admin;
