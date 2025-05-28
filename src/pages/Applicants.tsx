
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";
import { toast } from "sonner";
import { ArrowLeft, User, FileText, Shield, Building } from "lucide-react";
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

const Applicants = () => {
  const navigate = useNavigate();
  
  const [applicants, setApplicants] = useState<ApplicantWithApplication[]>([]);
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

  const handleAddGuarantor = (applicant: ApplicantWithApplication) => {
    setSelectedApplicant(applicant);
    setShowGuarantorForm(true);
  };

  const handleGuarantorSaved = () => {
    setShowGuarantorForm(false);
    setSelectedApplicant(null);
    toast.success('Guarantor information saved successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading all applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Error Loading Applicants
              </h1>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <Button onClick={() => navigate('/admin')} className="bg-orange-500 hover:bg-orange-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                No Applicants Found
              </h1>
              <p className="text-gray-600 mb-6">
                There are no applicants in the system yet. Applicants will appear here once tenancy applications are submitted.
              </p>
              <Button onClick={() => navigate('/admin')} className="bg-orange-500 hover:bg-orange-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/admin')} className="shadow-sm hover:shadow-md transition-shadow">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">All Applicants</h1>
                <p className="text-gray-600 text-lg">Complete list of all applicants from all applications</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm border-orange-200 text-orange-700 bg-orange-50">
              {applicants.length} {applicants.length === 1 ? 'Applicant' : 'Applicants'}
            </Badge>
          </div>
        </div>

        {/* Applicants */}
        <div className="space-y-6">
          {applicants.map((applicant, index) => (
            <Card key={`${applicant.applicationId}-${index}`} className="shadow-sm border border-gray-200 overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-600" />
                    <div>
                      <span className="text-xl font-semibold text-gray-900">{applicant.firstName} {applicant.lastName}</span>
                      {applicant.isPrimary && (
                        <Badge variant="outline" className="ml-2 text-xs border-orange-200 text-orange-700 bg-orange-50">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/applicants?application=${applicant.applicationId}`)}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      View Application
                    </Button>
                    {applicant.guarantorRequired === 'yes' && (
                      <Button
                        size="sm"
                        onClick={() => handleAddGuarantor(applicant)}
                        className="bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Add Guarantor
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Application Info */}
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Application Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Property Address</p>
                      <p className="font-medium text-gray-900">{applicant.propertyAddress || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Postcode</p>
                      <p className="font-medium text-gray-900">{applicant.propertyPostcode || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Submitted</p>
                      <p className="font-medium text-gray-900">{new Date(applicant.submittedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">Personal Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium text-gray-900">{applicant.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{applicant.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{applicant.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">Employment</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Employment Status</p>
                        <p className="font-medium text-gray-900">{applicant.employment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium text-gray-900">{applicant.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Annual Income</p>
                        <p className="font-medium text-gray-900">£{applicant.annualIncome}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">Current Address</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">{applicant.previousAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Postcode</p>
                        <p className="font-medium text-gray-900">{applicant.previousPostcode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Property Status</p>
                        <p className="font-medium text-gray-900">{applicant.currentPropertyStatus}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guarantor Required Badge */}
                {applicant.guarantorRequired === 'yes' && (
                  <div className="mt-6">
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                      <Shield className="h-3 w-3 mr-1" />
                      Guarantor Required
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

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
    </div>
  );
};

export default Applicants;
