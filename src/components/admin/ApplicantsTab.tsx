import { useState, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Eye, Download, MoreHorizontal, Search, Calendar as CalendarIcon, Trash2, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";
import { format, formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

interface Applicant {
  id: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  postcode: string;
  createdAt: string;
}

interface TenancyApplicationData {
  id: string;
  applicants: any[];
  submitted_at: string;
}

const ApplicantsTab = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { generatePdf, isGenerating } = usePdfGeneration();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const checkboxRef = useRef<HTMLButtonElement>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const isAllSelected = selectedApplicants.length === filteredApplicants.length && filteredApplicants.length > 0;
  const isIndeterminate = selectedApplicants.length > 0 && selectedApplicants.length < filteredApplicants.length;

  useEffect(() => {
    if (checkboxRef.current) {
      (checkboxRef.current as any).indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [applicants, searchTerm, dateFilter]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      // Fetch applicants from Supabase
      const applicationId = searchParams.get('application');
      let query = supabase.from('tenancy_applications').select('*');
      
      if (applicationId) {
        query = query.eq('id', applicationId);
      }
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Extract applicants from the response
      const fetchedApplicants: Applicant[] = [];
      if (data) {
        data.forEach((item) => {
          const applicantsData = item.applicants as any[];
          if (Array.isArray(applicantsData)) {
            applicantsData.forEach(applicant => {
              fetchedApplicants.push({
                ...applicant,
                applicationId: item.id,
                createdAt: item.submitted_at
              });
            });
          }
        });
      }

      setApplicants(fetchedApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = applicants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(applicant =>
        applicant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let filterDate: Date;

      switch (dateFilter) {
        case "today":
          filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          filtered = filtered.filter(applicant => new Date(applicant.createdAt) >= filterDate);
          break;
        case "this_week":
          filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(applicant => new Date(applicant.createdAt) >= filterDate);
          break;
        case "this_month":
          filterDate = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(applicant => new Date(applicant.createdAt) >= filterDate);
          break;
        case "last_month":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(applicant => {
            const appDate = new Date(applicant.createdAt);
            return appDate >= lastMonth && appDate < thisMonth;
          });
          break;
        case "custom":
          if (dateRange?.from && dateRange?.to) {
            filtered = filtered.filter(applicant => {
              const appDate = new Date(applicant.createdAt);
              return appDate >= dateRange.from && appDate <= dateRange.to;
            });
          }
          break;
      }
    }

    setFilteredApplicants(filtered);
  };

  const handleSelectApplicant = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedApplicants(prev => [...prev, id]);
    } else {
      setSelectedApplicants(prev => prev.filter(applicantId => applicantId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicants(filteredApplicants.map(applicant => `${applicant.applicationId}-${applicant.firstName}-${applicant.lastName}`));
    } else {
      setSelectedApplicants([]);
    }
  };

  const handleBulkExport = () => {
    const selectedData = filteredApplicants.filter(applicant =>
      selectedApplicants.includes(`${applicant.applicationId}-${applicant.firstName}-${applicant.lastName}`)
    );
    const csvContent = generateCSV(selectedData);
    downloadCSV(csvContent, 'selected-applicants.csv');
    toast.success('Applicants exported successfully');
  };

  const generateCSV = (data: Applicant[]) => {
    const headers = [
      'First name',
      'Last name',
      'Date of birth',
      'Mobile number',
      'Email address',
      'Postcode',
      'Street address',
    ];

    const rows = data.map(applicant => [
      applicant?.firstName || '',
      applicant?.lastName || '',
      applicant?.dateOfBirth || '',
      applicant?.phone || '',
      applicant?.email || '',
      applicant?.postcode || '',
      applicant?.address || '',
    ]);

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

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getSiteBadge = (applicant: Applicant) => {
    const postcode = applicant?.postcode?.toLowerCase() || '';

    // Determine site based on postcode
    if (postcode.startsWith('co') || postcode.includes('colchester')) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Colchester</Badge>;
    } else if (postcode.startsWith('ip') || postcode.includes('ipswich')) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Ipswich</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">Other</Badge>;
    }
  };

  const handleViewApplicant = (applicant: Applicant) => {
    // Navigate to the application preview page for this applicant's application
    navigate(`/application-preview/${applicant.applicationId}`);
  };

  const handleGenerateApplicantPdf = async (applicant: Applicant) => {
    // Generate PDF for applicant
    console.log('Generate PDF for applicant:', applicant);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      // Apply custom date range filter
      setDateFilter('custom');
      setIsDatePickerOpen(false);
    }
  };

  const getDateRangeDisplay = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`;
    }
    return "Custom range";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Always Visible Table Header with Filters */}
      <div className="bg-gray-50 border-b px-4 py-4">
        <div className="space-y-4">
          {/* Title and Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-semibold text-gray-900">
                Applicants ({filteredApplicants.length})
              </span>
            </div>

            {/* Bulk Actions */}
            {selectedApplicants.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  {selectedApplicants.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkExport}
                  className="h-8 text-xs border-green-500 hover:bg-green-50 text-green-600 hover:text-green-700"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 shadow-sm border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex gap-2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="flex-1 shadow-sm border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This week</SelectItem>
                    <SelectItem value="this_month">This month</SelectItem>
                    <SelectItem value="last_month">Last month</SelectItem>
                    <SelectItem value="custom">{getDateRangeDisplay()}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Custom Date Range Picker */}
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="shadow-sm border-gray-300 hover:bg-gray-50"
                      onClick={() => setIsDatePickerOpen(true)}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                    {dateRange?.from && dateRange?.to && (
                      <div className="p-3 border-t bg-gray-50">
                        <div className="text-sm text-gray-700 text-center">
                          {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Select All Checkbox */}
          {filteredApplicants.length > 0 && (
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <Checkbox
                ref={checkboxRef}
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                className="h-4 w-4 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <span className="text-sm font-medium text-gray-900">
                Select all applicants
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Applicants Content */}
      {filteredApplicants.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="space-y-3 p-4">
              {filteredApplicants.map((applicant) => (
                <div key={`${applicant.applicationId}-${applicant.firstName}-${applicant.lastName}`} className="bg-gray-50 border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedApplicants.includes(`${applicant.applicationId}-${applicant.firstName}-${applicant.lastName}`)}
                        onCheckedChange={(checked) => handleSelectApplicant(`${applicant.applicationId}-${applicant.firstName}-${applicant.lastName}`, !!checked)}
                        className="h-4 w-4 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {applicant.firstName} {applicant.lastName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {applicant.email}
                        </p>
                        <p className="text-xs text-gray-600">
                          {applicant.phone}
                        </p>
                      </div>
                    </div>
                    {getSiteBadge(applicant)}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <p>DOB: {applicant.dateOfBirth}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(applicant.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplicant(applicant)}
                        className="h-7 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white shadow-lg border z-50">
                          <DropdownMenuItem onClick={() => handleViewApplicant(applicant)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Application
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateApplicantPdf(applicant)}>
                            <Download className="h-4 w-4 mr-2" />
                            Generate PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b-0">
                  <TableHead className="w-12">
                    <span className="sr-only">Select</span>
                  </TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Date of Birth</TableHead>
                  <TableHead className="font-semibold">Submitted</TableHead>
                  <TableHead className="font-semibold">Site</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={`${applicant.applicationId}-${applicant.firstName}-${applicant.lastName}`} className="hover:bg-gray-50 border-b">
                    <TableCell>
                      <Checkbox
                        checked={selectedApplicants.includes(`${applicant.applicationId}-${applicant.firstName}-${applicant.lastName}`)}
                        onCheckedChange={(checked) => handleSelectApplicant(`${applicant.applicationId}-${applicant.firstName}-${applicant.lastName}`, !!checked)}
                        className="h-4 w-4 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {applicant.firstName} {applicant.lastName}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-600">
                          {applicant.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {applicant.phone}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <p className="text-sm text-gray-900">
                        {applicant.dateOfBirth}
                      </p>
                    </TableCell>
                    
                    <TableCell>
                      <p className="text-sm text-gray-900">
                        {formatTimeAgo(applicant.createdAt)}
                      </p>
                    </TableCell>
                    
                    <TableCell>
                      {getSiteBadge(applicant)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewApplicant(applicant)}
                          className="h-8"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white shadow-lg border z-50">
                            <DropdownMenuItem onClick={() => handleViewApplicant(applicant)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Application
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGenerateApplicantPdf(applicant)}>
                              <Download className="h-4 w-4 mr-2" />
                              Generate PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4 text-lg">
            {searchTerm || dateFilter !== "all" ? "No applicants found matching your search." : "No applicants found."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicantsTab;
