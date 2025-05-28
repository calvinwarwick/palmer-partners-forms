import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Applicant } from "@/domain/types/Applicant";
import { toast } from "sonner";
import { ArrowLeft, User, FileText, Shield } from "lucide-react";
import GuarantorForm from "@/components/applicants/GuarantorForm";

interface TenancyApplication {
  id: string;
  applicants: Applicant[];
  property_preferences: any;
  submitted_at: string;
}

const Applicants = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const applicationId = searchParams.get('application');
  
  const [application, setApplication] = useState<TenancyApplication | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showGuarantorForm, setShowGuarantorForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    } else {
      setLoading(false);
      setError('No application ID provided');
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching application with ID:', applicationId);
      
      const { data, error: fetchError } = await supabase
        .from('tenancy_applications')
        .select('*')
        .eq('id', applicationId)
        .maybeSingle();

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      if (!data) {
        setError('Application not found');
        return;
      }

      console.log('Application data:', data);

      const typedData = {
        ...data,
        applicants: data.applicants as unknown as Applicant[]
      };

      setApplication(typedData);
    } catch (error) {
      console.error('Error fetching application:', error);
      setError('Failed to fetch application details');
      toast.error('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuarantor = (applicant: Applicant) => {
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
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Application Not Found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {applicationId 
                ? `We couldn't find the application with ID: ${applicationId}`
                : 'Please provide an application ID in the URL parameters.'
              }
            </p>
            <Button onClick={() => navigate('/admin')} className="bg-orange-500 hover:bg-orange-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
                <p className="text-gray-600">
                  Application submitted on {new Date(application.submitted_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm border-orange-200 text-orange-700">
              {application.applicants.length} {application.applicants.length === 1 ? 'Applicant' : 'Applicants'}
            </Badge>
          </div>
        </div>

        {/* Property Info */}
        <Card className="mb-8 border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <FileText className="h-5 w-5 mr-2" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{application.property_preferences?.streetAddress || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Postcode</p>
                <p className="font-medium">{application.property_preferences?.postcode || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Max Rent</p>
                <p className="font-medium">
                  {application.property_preferences?.maxRent 
                    ? `£${application.property_preferences.maxRent}/month`
                    : 'Not specified'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants */}
        <div className="space-y-6">
          {application.applicants.map((applicant, index) => (
            <Card key={index} className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {index === 0 ? 'Primary Applicant' : `Applicant ${index + 1}`}
                  </div>
                  {applicant.guarantorRequired === 'yes' && (
                    <Button
                      size="sm"
                      onClick={() => handleAddGuarantor(applicant)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Add Guarantor
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Personal Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{applicant.firstName} {applicant.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium">{applicant.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{applicant.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{applicant.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Employment</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Employment Status</p>
                        <p className="font-medium">{applicant.employment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium">{applicant.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Job Title</p>
                        <p className="font-medium">{applicant.jobTitle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Annual Income</p>
                        <p className="font-medium">£{applicant.annualIncome}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Length of Service</p>
                        <p className="font-medium">{applicant.lengthOfService}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Current Address</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{applicant.previousAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Postcode</p>
                        <p className="font-medium">{applicant.previousPostcode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Property Status</p>
                        <p className="font-medium">{applicant.currentPropertyStatus}</p>
                      </div>
                      {applicant.currentRentalAmount && (
                        <div>
                          <p className="text-sm text-gray-600">Current Rent</p>
                          <p className="font-medium">£{applicant.currentRentalAmount}/month</p>
                        </div>
                      )}
                      {applicant.vacateDate && (
                        <div>
                          <p className="text-sm text-gray-600">Vacate Date</p>
                          <p className="font-medium">{applicant.vacateDate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* References */}
                {(applicant.reference1Name || applicant.reference1Contact) && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">References</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Reference Name</p>
                        <p className="font-medium">{applicant.reference1Name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reference Contact</p>
                        <p className="font-medium">{applicant.reference1Contact}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guarantor Required Badge */}
                {applicant.guarantorRequired === 'yes' && (
                  <div className="mt-4">
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
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
            applicationId={application.id}
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
