
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";
import { toast } from "sonner";
import { User, FileText, Shield, Building, Eye, Mail, Download, MoreHorizontal, Search, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import GuarantorForm from "@/components/applicants/GuarantorForm";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

interface TenancyApplication {
  id: string;
  applicants: Applicant[];
  property_preferences: PropertyPreferences;
  submitted_at: string;
}

interface ApplicantWithApplication extends Applicant {
  applicationId: string;
  submittedAt: string;
  propertyAddress?: string;
  propertyPostcode?: string;
  isPrimary: boolean;
}

const ApplicantsTab = () => {
  const navigate = useNavigate();
  
  const [applicants, setApplicants] = useState<ApplicantWithApplication[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicantWithApplication[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showGuarantorForm, setShowGuarantorForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    fetchAllApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [applicants, searchTerm, dateFilter]);

  const filterApplicants = () => {
    let filtered = applicants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(applicant => 
        applicant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.propertyPostcode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(applicant => {
        const submitDate = new Date(applicant.submittedAt);
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

  const fetchAllApplicants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching all applications and applicants');
      
      const { data, error: fetchError } = await supabase
        .from('tenancy_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      if (!data || data.length === 0) {
        setApplicants([]);
        setFilteredApplicants([]);
        return;
      }

      console.log('Applications data:', data);

      // Flatten all applicants from all applications
      const allApplicants: ApplicantWithApplication[] = [];
      
      data.forEach((application) => {
        const typedApplication = {
          ...application,
          applicants: application.applicants as unknown as Applicant[],
          property_preferences: application.property_preferences as unknown as PropertyPreferences
        };

        typedApplication.applicants.forEach((applicant, index) => {
          allApplicants.push({
            ...applicant,
            applicationId: application.id,
            submittedAt: application.submitted_at,
            propertyAddress: typedApplication.property_preferences?.streetAddress,
            propertyPostcode: typedApplication.property_preferences?.postcode,
            isPrimary: index === 0
          });
        });
      });

      setApplicants(allApplicants);
      setFilteredApplicants(allApplicants);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to fetch applicant details');
      toast.error('Failed to fetch applicant details');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplicant = (applicantKey: string, checked: boolean) => {
    if (checked) {
      setSelectedApplicants(prev => [...prev, applicantKey]);
    } else {
      setSelectedApplicants(prev => prev.filter(key => key !== applicantKey));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicants(filteredApplicants.map((_, index) => `${_.applicationId}-${index}`));
    } else {
      setSelectedApplicants([]);
    }
  };

  const handleAddGuarantor = (applicant: ApplicantWithApplication) => {
    setSelectedApplicant(applicant);
    setShowGuarantorForm(true);
  };

  const handleGuarantorSaved = () => {
    setShowGuarantorForm(false);
    setSelectedApplicant(null);
    toast.success('Guarantor information saved successfully');
  };

  const handleViewApplicant = (applicant: ApplicantWithApplication) => {
    // Show a preview modal or navigate to a detailed view
    console.log('Viewing applicant:', applicant);
    toast.info('Applicant preview feature coming soon');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAllSelected = selectedApplicants.length === filteredApplicants.length && filteredApplicants.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="text-gray-400 mb-4">
          <FileText className="mx-auto h-16 w-16" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Error Loading Applicants
        </h1>
        <p className="text-gray-600 mb-6">
          {error}
        </p>
      </div>
    );
  }

  if (filteredApplicants.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="text-gray-400 mb-4">
          <User className="mx-auto h-16 w-16" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          No Applicants Found
        </h1>
        <p className="text-gray-600 mb-6">
          There are no applicants matching your current filters.
        </p>
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
                <div className="px-2 py-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                        Custom range
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
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
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Right side - Bulk Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
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
            <TableHead className="font-semibold">Applicant</TableHead>
            <TableHead className="font-semibold">Property</TableHead>
            <TableHead className="font-semibold">Employment</TableHead>
            <TableHead className="font-semibold">Income</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplicants.map((applicant, index) => {
            const applicantKey = `${applicant.applicationId}-${index}`;
            return (
              <TableRow key={applicantKey} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedApplicants.includes(applicantKey)}
                    onCheckedChange={(checked) => handleSelectApplicant(applicantKey, !!checked)}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                </TableCell>
                
                <TableCell>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">
                        {applicant.firstName} {applicant.lastName}
                      </p>
                      {applicant.isPrimary && (
                        <Badge variant="outline" className="ml-2 text-xs border-orange-200 text-orange-700 bg-orange-50">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    <p className="text-sm text-gray-600">{applicant.phone}</p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {applicant.propertyAddress || 'Not provided'}
                    </p>
                    <p className="text-sm text-gray-600">{applicant.propertyPostcode}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(applicant.submittedAt)}
                    </p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{applicant.employment}</p>
                    <p className="text-sm text-gray-600">{applicant.companyName}</p>
                    <p className="text-sm text-gray-600">{applicant.jobTitle}</p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <p className="font-medium text-gray-900">£{applicant.annualIncome}</p>
                  <p className="text-sm text-gray-600">{applicant.lengthOfService}</p>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">{applicant.currentPropertyStatus}</p>
                    {applicant.guarantorRequired === 'yes' && (
                      <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                        <Shield className="h-3 w-3 mr-1" />
                        Guarantor Required
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplicant(applicant)}
                      className="h-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {applicant.guarantorRequired === 'yes' && (
                      <Button
                        size="sm"
                        onClick={() => handleAddGuarantor(applicant)}
                        className="h-8 bg-orange-500 hover:bg-orange-600"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white shadow-lg border z-50">
                        <DropdownMenuItem onClick={() => handleViewApplicant(applicant)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Generate Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Guarantor Form Modal */}
      {showGuarantorForm && selectedApplicant && (
        <GuarantorForm
          applicant={selectedApplicant}
          applicationId={(selectedApplicant as ApplicantWithApplication).applicationId}
          isOpen={showGuarantorForm}
          onClose={() => setShowGuarantorForm(false)}
          onSave={handleGuarantorSaved}
        />
      )}
    </div>
  );
};

export default ApplicantsTab;
