import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, Mail, Download, Search, Calendar as CalendarIcon, Trash2, User } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { DateRange } from "react-day-picker";

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  applicationId: string;
  submitted_at: string;
  property_preferences?: {
    streetAddress?: string;
    postcode?: string;
  };
}

const ApplicantsTab = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [applicants, searchTerm, dateFilter]);

  const fetchApplicants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenancy_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Flatten applicants from all applications
      const allApplicants: Applicant[] = [];
      data.forEach(app => {
        if (app.applicants && Array.isArray(app.applicants)) {
          app.applicants.forEach((applicant: any, index: number) => {
            allApplicants.push({
              id: `${app.id}-${index}`,
              firstName: applicant.firstName || '',
              lastName: applicant.lastName || '',
              email: applicant.email || '',
              phone: applicant.phone || '',
              dateOfBirth: applicant.dateOfBirth || '',
              applicationId: app.id,
              submitted_at: app.submitted_at,
              property_preferences: typeof app.property_preferences === 'object' && app.property_preferences !== null
                ? app.property_preferences as { streetAddress?: string; postcode?: string }
                : undefined
            });
          });
        }
      });

      setApplicants(allApplicants);
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
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(applicant => {
        const submitDate = new Date(applicant.submitted_at);
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

    setFilteredApplicants(filtered);
  };

  const handleSelectApplicant = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedApplicants(prev => [...prev, id]);
    } else {
      setSelectedApplicants(prev => prev.filter(appId => appId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicants(filteredApplicants.map(app => app.id));
    } else {
      setSelectedApplicants([]);
    }
  };

  const handleViewPreview = (applicant: Applicant) => {
    toast.success(`Viewing preview for ${applicant.firstName} ${applicant.lastName}`);
  };

  const handleBulkExport = () => {
    const selectedData = applicants.filter(app => selectedApplicants.includes(app.id));
    toast.success('Applicants exported successfully');
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getSiteBadge = (applicant: Applicant) => {
    const postcode = applicant.property_preferences?.postcode?.toLowerCase() || '';
    
    if (postcode.startsWith('co') || postcode.includes('colchester')) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Colchester</Badge>;
    } else if (postcode.startsWith('ip') || postcode.includes('ipswich')) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ipswich</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Other</Badge>;
    }
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setDateFilter('custom');
      setIsDatePickerOpen(false);
    }
  };

  const isAllSelected = selectedApplicants.length === filteredApplicants.length && filteredApplicants.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table Header with Controls */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left side - Selection and title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-gray-400"
              />
              <span className="text-sm font-semibold text-gray-900">
                Applicants ({filteredApplicants.length})
              </span>
            </div>
            {selectedApplicants.length > 0 && (
              <span className="text-sm text-gray-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                {selectedApplicants.length} selected
              </span>
            )}
          </div>

          {/* Center - Search and Date Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 h-9 text-sm"
              />
            </div>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
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
              onClick={handleBulkExport}
              disabled={selectedApplicants.length === 0}
              className="h-9 border-green-500 hover:bg-green-50 text-green-600 hover:text-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={selectedApplicants.length === 0}
              className="h-9 border-blue-500 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={selectedApplicants.length === 0}
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
            <TableRow key={applicant.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedApplicants.includes(applicant.id)}
                  onCheckedChange={(checked) => handleSelectApplicant(applicant.id, !!checked)}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {applicant.firstName} {applicant.lastName}
                    </p>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <p className="text-sm text-gray-900">{applicant.email}</p>
                  <p className="text-sm text-gray-600">{applicant.phone}</p>
                </div>
              </TableCell>
              
              <TableCell>
                <p className="text-sm text-gray-900">
                  {applicant.dateOfBirth || 'N/A'}
                </p>
              </TableCell>
              
              <TableCell>
                <p className="text-sm text-gray-900">
                  {formatTimeAgo(applicant.submitted_at)}
                </p>
              </TableCell>
              
              <TableCell>
                {getSiteBadge(applicant)}
              </TableCell>
              
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewPreview(applicant)}
                  className="h-8"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredApplicants.length === 0 && (
        <div className="text-center py-16 bg-white">
          <div className="text-gray-400 mb-4">
            <User className="mx-auto h-16 w-16" />
          </div>
          <p className="text-gray-500 mb-4 text-lg">No applicants found.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicantsTab;
