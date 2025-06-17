
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Eye, Download, MoreHorizontal, Search, Calendar as CalendarIcon, Trash2, Clock, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";
import { useState, useRef, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import type { DateRange } from "react-day-picker";
import ApplicationActivityModal from "./ApplicationActivityModal";
import ApplicationPreviewContent from "./ApplicationPreviewContent";

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  additional_details: any;
  data_sharing: any;
  signature: string;
  submitted_at: string;
}

interface ApplicationsTableProps {
  applications: TenancyApplication[];
  selectedApplications: string[];
  onSelectApplication: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onBulkExport: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  customDateRange?: { from: Date; to: Date } | null;
  onCustomDateRangeChange?: (range: { from: Date; to: Date } | null) => void;
}

const ApplicationsTable = ({
  applications,
  selectedApplications,
  onSelectApplication,
  onSelectAll,
  onBulkExport,
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  customDateRange,
  onCustomDateRangeChange
}: ApplicationsTableProps) => {
  const navigate = useNavigate();
  const { generatePdf, isGenerating } = usePdfGeneration();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    customDateRange ? { from: customDateRange.from, to: customDateRange.to } : undefined
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedApplicationForActivity, setSelectedApplicationForActivity] = useState<TenancyApplication | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedApplicationForPreview, setSelectedApplicationForPreview] = useState<TenancyApplication | null>(null);
  const [isPreviewSheetOpen, setIsPreviewSheetOpen] = useState(false);
  const checkboxRef = useRef<HTMLButtonElement>(null);
  
  const isAllSelected = selectedApplications.length === applications.length && applications.length > 0;
  const isIndeterminate = selectedApplications.length > 0 && selectedApplications.length < applications.length;

  useEffect(() => {
    if (checkboxRef.current) {
      (checkboxRef.current as any).indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getSiteBadge = (application: TenancyApplication) => {
    const postcode = application.property_preferences?.postcode?.toLowerCase() || '';
    
    if (postcode.startsWith('co') || postcode.includes('colchester')) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Colchester</Badge>;
    } else if (postcode.startsWith('ip') || postcode.includes('ipswich')) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Ipswich</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">Other</Badge>;
    }
  };

  const handlePreviewApplication = (application: TenancyApplication) => {
    setSelectedApplicationForPreview(application);
    setIsPreviewSheetOpen(true);
  };

  const handleGeneratePdf = async (application: TenancyApplication) => {
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

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to && onCustomDateRangeChange) {
      onCustomDateRangeChange({ from: range.from, to: range.to });
      onDateFilterChange('custom');
      setIsDatePickerOpen(false);
    }
  };

  const getDateRangeDisplay = () => {
    if (customDateRange?.from && customDateRange?.to) {
      return `${format(customDateRange.from, "MMM dd")} - ${format(customDateRange.to, "MMM dd")}`;
    }
    return "Custom range";
  };

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
                Applications ({applications.length})
              </span>
            </div>

            {/* Bulk Actions */}
            {selectedApplications.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  {selectedApplications.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkExport}
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
                  placeholder="Search by name, email, or address..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-14 shadow-sm border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex gap-2">
                <Select value={dateFilter} onValueChange={onDateFilterChange}>
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
          {applications.length > 0 && (
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <Checkbox
                ref={checkboxRef}
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                className="h-4 w-4 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <span className="text-sm font-medium text-gray-900">
                Select all applications
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Applications Content */}
      {applications.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="space-y-3 p-4">
              {applications.map((application) => (
                <div key={application.id} className="bg-gray-50 border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedApplications.includes(application.id)}
                        onCheckedChange={(checked) => onSelectApplication(application.id, !!checked)}
                        className="h-4 w-4 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {application.applicants?.[0]?.firstName} {application.applicants?.[0]?.lastName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {application.applicants?.[0]?.email}
                        </p>
                      </div>
                    </div>
                    {getSiteBadge(application)}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <p className="font-medium">{application.property_preferences?.streetAddress || 'N/A'}</p>
                    <p>{application.property_preferences?.postcode}</p>
                    <p>£{application.property_preferences?.maxRent}/month</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(application.submitted_at)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewApplication(application)}
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
                          <DropdownMenuItem onClick={() => handleViewActivity(application)}>
                            <Clock className="h-4 w-4 mr-2" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGeneratePdf(application)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
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
                  <TableHead className="font-semibold">Primary Applicant</TableHead>
                  <TableHead className="font-semibold">Property</TableHead>
                  <TableHead className="font-semibold">Submitted</TableHead>
                  <TableHead className="font-semibold">Site</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id} className="hover:bg-gray-50 border-b">
                    <TableCell>
                      <Checkbox
                        checked={selectedApplications.includes(application.id)}
                        onCheckedChange={(checked) => onSelectApplication(application.id, !!checked)}
                        className="h-4 w-4 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.applicants?.[0]?.firstName} {application.applicants?.[0]?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.applicants?.[0]?.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.applicants?.[0]?.phone}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.property_preferences?.streetAddress || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.property_preferences?.postcode}
                        </p>
                        <p className="text-sm text-gray-600">
                          £{application.property_preferences?.maxRent}/month
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <p className="text-sm text-gray-900">
                        {formatTimeAgo(application.submitted_at)}
                      </p>
                    </TableCell>
                    
                    <TableCell>
                      {getSiteBadge(application)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewApplication(application)}
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
                            <DropdownMenuItem onClick={() => handleViewActivity(application)}>
                              <Clock className="h-4 w-4 mr-2" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGeneratePdf(application)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4 text-lg">
            {searchTerm || dateFilter !== "all" ? "No applications found matching your search." : "No applications found."}
          </p>
        </div>
      )}

      {/* Preview Sheet */}
      <Sheet open={isPreviewSheetOpen} onOpenChange={setIsPreviewSheetOpen}>
        <SheetContent className="w-full sm:max-w-4xl h-full p-0">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Application Preview</h2>
            </div>
            <div className="flex-1 p-6 overflow-hidden">
              {selectedApplicationForPreview && (
                <ApplicationPreviewContent application={selectedApplicationForPreview} />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Activity Modal */}
      <ApplicationActivityModal
        application={selectedApplicationForActivity}
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />
    </div>
  );
};

export default ApplicationsTable;
