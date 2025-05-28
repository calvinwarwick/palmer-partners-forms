
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";
import { toast } from "sonner";
import { User, FileText, Shield, Building, Eye, Mail, Download, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import GuarantorForm from "@/components/applicants/GuarantorForm";

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
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showGuarantorForm, setShowGuarantorForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllApplicants();
  }, []);

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
      setSelectedApplicants(applicants.map((_, index) => `${_.applicationId}-${index}`));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (applicants.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="text-gray-400 mb-4">
          <User className="mx-auto h-16 w-16" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          No Applicants Found
        </h1>
        <p className="text-gray-600 mb-6">
          There are no applicants in the system yet. Applicants will appear here once tenancy applications are submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Applicants</h2>
          <p className="text-gray-600">Complete list of all applicants from all applications</p>
        </div>
        <Badge variant="outline" className="text-sm border-orange-200 text-orange-700 bg-orange-50">
          {applicants.length} {applicants.length === 1 ? 'Applicant' : 'Applicants'}
        </Badge>
      </div>

      {/* Bulk Actions */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedApplicants.length === applicants.length && applicants.length > 0}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <span className="text-sm text-gray-600">
                {selectedApplicants.length} of {applicants.length} applicants selected
              </span>
            </div>
            {selectedApplicants.length > 0 && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200 py-6">
          <CardTitle className="flex items-center justify-between text-xl font-semibold text-gray-900">
            <span>Applicants ({applicants.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
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
                {applicants.map((applicant, index) => {
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
                            onClick={() => navigate(`/applicants?application=${applicant.applicationId}`)}
                            className="h-8"
                          >
                            <Building className="h-4 w-4" />
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
                              <DropdownMenuItem>
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
          </div>
        </CardContent>
      </Card>

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
