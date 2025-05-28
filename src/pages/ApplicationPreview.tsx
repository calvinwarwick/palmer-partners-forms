
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";
import { toast } from "sonner";

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  additional_details: any;
  data_sharing: any;
  signature: string;
  submitted_at: string;
}

const ApplicationPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<TenancyApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const { generatePdf, isGenerating } = usePdfGeneration();

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('tenancy_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!application) return;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <Button onClick={() => navigate('/admin')} className="bg-orange-500 hover:bg-orange-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <Button 
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md transition-shadow"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Application Preview - Styled like PDF */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Header */}
          <div className="bg-gray-800 text-white p-4 -m-8 mb-8 rounded-t-lg">
            <h1 className="text-xl font-bold">Palmer & Partners</h1>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tenancy Application</h2>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <div className="bg-gray-800 text-white p-3 -mx-8">
              <h3 className="font-semibold">Property Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Street Address', application.property_preferences?.streetAddress || 'Not specified'],
                ['Postcode', application.property_preferences?.postcode || 'Not specified'],
                ['Rental Amount', application.property_preferences?.maxRent ? `£${application.property_preferences.maxRent}` : 'Not specified'],
                ['Preferred Move-in Date', application.property_preferences?.moveInDate || 'Not specified'],
                ['Latest Move-in Date', application.property_preferences?.latestMoveInDate || 'Not specified'],
                ['Initial Tenancy Term', application.property_preferences?.initialTenancyTerm || 'Not specified'],
                ['Has Pets', application.additional_details?.pets || 'No'],
                ['Under 18s', application.additional_details?.under18Count || '0'],
                ['Under 18s Details', application.additional_details?.childrenAges || '-'],
                ['Conditions of Offer', application.additional_details?.conditionsOfOffer || '-'],
                ['Deposit Type', application.additional_details?.depositType || 'Not specified']
              ].map(([label, value], index) => (
                <div key={index} className={`p-2 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                  <div className="font-semibold text-gray-700">{label}</div>
                  <div className="text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Applicants */}
          {application.applicants.map((applicant, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-gray-800 text-white p-3 -mx-8">
                <h3 className="font-semibold">Applicant #{index + 1}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['First Name', applicant.firstName || 'Not specified'],
                  ['Last Name', applicant.lastName || 'Not specified'],
                  ['Date of Birth', applicant.dateOfBirth || 'Not specified'],
                  ['Email Address', applicant.email || 'Not specified'],
                  ['Mobile Number', applicant.phone || 'Not specified']
                ].map(([label, value], rowIndex) => (
                  <div key={rowIndex} className={`p-2 ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <div className="font-semibold text-gray-700">{label}</div>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ))}
              </div>

              {/* Employment Details */}
              <div className="bg-gray-200 p-2 -mx-8">
                <h4 className="font-semibold text-gray-800">Employment Details</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Contract Type', applicant.employment || 'Not specified'],
                  ['Company Name', applicant.companyName || '-'],
                  ['Job Title', applicant.jobTitle || 'Not specified'],
                  ['Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : '-'],
                  ['Length of Service', applicant.lengthOfService || '']
                ].map(([label, value], rowIndex) => (
                  <div key={rowIndex} className={`p-2 ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <div className="font-semibold text-gray-700">{label}</div>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ))}
              </div>

              {/* Current Property Details */}
              <div className="bg-gray-200 p-2 -mx-8">
                <h4 className="font-semibold text-gray-800">Current Property Details</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Postcode', applicant.previousPostcode || 'Not specified'],
                  ['Street Address', applicant.previousAddress || 'Not specified'],
                  ['Move In Date', applicant.moveInDate || 'Not specified'],
                  ['Vacate Date', applicant.vacateDate || 'Not specified'],
                  ['Current Property Status', applicant.currentPropertyStatus || 'Not specified'],
                  ['Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : 'Not specified']
                ].map(([label, value], rowIndex) => (
                  <div key={rowIndex} className={`p-2 ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <div className="font-semibold text-gray-700">{label}</div>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ))}
              </div>

              {/* Additional Information */}
              <div className="bg-gray-200 p-2 -mx-8">
                <h4 className="font-semibold text-gray-800">Additional Information</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['UK/ROI Passport', application.additional_details?.ukPassport || 'Not specified'],
                  ['Adverse Credit', application.additional_details?.adverseCredit || 'Not specified'],
                  ['Adverse Credit Details', application.additional_details?.adverseCreditDetails || 'n/a'],
                  ['Requires Guarantor', application.additional_details?.guarantorRequired || 'Not specified']
                ].map(([label, value], rowIndex) => (
                  <div key={rowIndex} className={`p-2 ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <div className="font-semibold text-gray-700">{label}</div>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Data Sharing */}
          <div className="space-y-4">
            <div className="bg-gray-800 text-white p-3 -mx-8">
              <h3 className="font-semibold">Data Sharing</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Accept Utilities', application.data_sharing?.utilities ? 'Yes' : 'No'],
                ['Accept Insurance', application.data_sharing?.insurance ? 'Yes' : 'No']
              ].map(([label, value], index) => (
                <div key={index} className={`p-2 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                  <div className="font-semibold text-gray-700">{label}</div>
                  <div className="text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-4">
            <div className="bg-gray-800 text-white p-3 -mx-8">
              <h3 className="font-semibold">Signature</h3>
            </div>
            <div className="space-y-4">
              {application.signature && application.signature.startsWith('data:image/') ? (
                <div>
                  <img 
                    src={application.signature} 
                    alt="Digital Signature" 
                    className="max-w-xs border border-gray-300 rounded"
                  />
                  <p className="text-sm font-semibold text-gray-700 mt-2">Digital Signature</p>
                </div>
              ) : (
                <div className="p-2 bg-gray-50">
                  <div className="font-semibold text-gray-700">Signature:</div>
                  <div className="text-gray-900">{application.signature || 'Not provided'}</div>
                </div>
              )}
              <div className="p-2">
                <div className="font-semibold text-gray-700">Submitted At:</div>
                <div className="text-gray-900">
                  {new Date(application.submitted_at).toLocaleDateString('en-GB')} - {new Date(application.submitted_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-sm text-gray-500">
            Palmer & Partners - Tenancy Application
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPreview;
