
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Eye, Mail, Download, MoreHorizontal, Search, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";
import { useState, useRef, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import type { DateRange } from "react-day-picker";

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
  onViewDetails: (application: TenancyApplication) => void;
  onSelectAll: (checked: boolean) => void;
  onBulkExport: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
}

const ApplicationsTable = ({
  applications,
  selectedApplications,
  onSelectApplication,
  onViewDetails,
  onSelectAll,
  onBulkExport,
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange
}: ApplicationsTableProps) => {
  const navigate = useNavigate();
  const { generatePdf, isGenerating } = usePdfGeneration();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
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
    
    // Determine site based on postcode
    if (postcode.startsWith('co') || postcode.includes('colchester')) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Colchester</Badge>;
    } else if (postcode.startsWith('ip') || postcode.includes('ipswich')) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ipswich</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Other</Badge>;
    }
  };

  const handleViewApplicants = (applicationId: string) => {
    navigate(`/applicants?application=${applicationId}`);
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

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      // Apply custom date range filter
      onDateFilterChange('custom');
      setIsDatePickerOpen(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table Header with Controls */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left side - Selection and title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                ref={checkboxRef}
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-gray-400"
              />
              <span className="text-sm font-semibold text-gray-900">
                Applications ({applications.length})
              </span>
            </div>
            {selectedApplications.length > 0 && (
              <span className="text-sm text-gray-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                {selectedApplications.length} selected
              </span>
            )}
          </div>

          {/* Center - Search and Date Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64 h-9 text-sm"
              />
            </div>
            
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger className="w-36 h-9 text-sm">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This week</SelectItem>
                <SelectItem value="this_month">This month</SelectItem>
                <SelectItem value="last_month">Last month</SelectItem>
                <SelectItem value="custom">
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start text-sm font-normal p-0 h-auto">
                        Custom range
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleDateRangeSelect}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                      <div className="p-3 border-t">
                        <div className="text-sm text-gray-600">
                          {dateRange?.from && dateRange?.to ? (
                            `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                          ) : (
                            "Select date range"
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right side - Bulk Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport}
              disabled={selectedApplications.length === 0}
              className="h-9 border-green-500 hover:bg-green-50 text-green-600 hover:text-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={selectedApplications.length === 0}
              className="h-9 border-blue-500 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={selectedApplications.length === 0}
              className="h-9 border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
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
            <TableRow key={application.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedApplications.includes(application.id)}
                  onCheckedChange={(checked) => onSelectApplication(application.id, !!checked)}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
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
                    onClick={() => handleGeneratePdf(application)}
                    disabled={isGenerating}
                    className="h-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white shadow-lg border z-50">
                      <DropdownMenuItem onClick={() => onViewDetails(application)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGeneratePdf(application)}>
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
  );
};

export default ApplicationsTable;
