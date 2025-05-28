
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";
import { toast } from "sonner";
import { format } from "date-fns";

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
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const { generatePdf, isGenerating } = usePdfGeneration();

  useEffect(() => {
    if (id) {
      fetchApplication();
      fetchActivityLogs();
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
      
      const typedApplication: TenancyApplication = {
        id: data.id,
        applicants: data.applicants as any[],
        property_preferences: data.property_preferences as any,
        additional_details: data.additional_details as any,
        data_sharing: data.data_sharing as any,
        signature: data.signature,
        submitted_at: data.submitted_at
      };
      
      setApplication(typedApplication);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setActivityLogs(data);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
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
      submittedAt: application.submitted_at,
      applicationId: application.id
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

  const TableRow = ({ label, value, isOdd = false }: { label: string; value: string; isOdd?: boolean }) => (
    <div className={`grid grid-cols-3 gap-4 py-2 px-4 text-sm ${isOdd ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="font-semibold text-gray-800">{label}</div>
      <div className="col-span-2 text-gray-900">{value || '-'}</div>
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-gray-800 text-white p-3 font-semibold">
      {title}
    </div>
  );

  const SubSectionHeader = ({ title }: { title: string }) => (
    <div className="bg-gray-200 text-gray-800 p-2 font-medium text-sm">
      {title}
    </div>
  );

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

        {/* Application Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Palmer & Partners Header */}
          <div className="bg-gray-800 text-white p-4">
            <h1 className="text-xl font-normal">Palmer & Partners</h1>
          </div>
          
          {/* Orange line */}
          <div className="h-0.5 bg-orange-500"></div>
          
          {/* Main Title */}
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-gray-900">Tenancy Application</h2>
          </div>

          {/* Property Details */}
          <div className="border-t">
            <SectionHeader title="Property Details" />
            {[
              ['Street Address', application.property_preferences?.streetAddress],
              ['Postcode', application.property_preferences?.postcode],
              ['Rental Amount', application.property_preferences?.maxRent ? `£${application.property_preferences.maxRent}` : ''],
              ['Preferred Move-in Date', application.property_preferences?.moveInDate],
              ['Latest Move-in Date', application.property_preferences?.latestMoveInDate],
              ['Initial Tenancy Term', application.property_preferences?.initialTenancyTerm],
              ['Has Pets', application.additional_details?.pets === 'yes' ? 'Yes' : 'No'],
              ['Under 18s', application.additional_details?.under18Count || '0'],
              ['Under 18s Details', application.additional_details?.childrenAges],
              ['Conditions of Offer', application.additional_details?.conditionsOfOffer],
              ['Deposit Type', application.additional_details?.depositType]
            ].map(([label, value], index) => (
              <TableRow key={index} label={label} value={value || ''} isOdd={index % 2 === 1} />
            ))}
          </div>

          {/* Applicants */}
          {application.applicants.map((applicant, index) => (
            <div key={index} className="border-t">
              <SectionHeader title={`Applicant - #${index + 1}`} />
              
              {/* Personal Details */}
              {[
                ['First Name', applicant.firstName],
                ['Last Name', applicant.lastName],
                ['Date of Birth', applicant.dateOfBirth],
                ['Email Address', applicant.email],
                ['Mobile Number', applicant.phone]
              ].map(([label, value], rowIndex) => (
                <TableRow key={rowIndex} label={label} value={value || ''} isOdd={rowIndex % 2 === 1} />
              ))}

              {/* Employment Details */}
              <SubSectionHeader title="Employment Details" />
              {[
                ['Contract Type', applicant.employment],
                ['Company Name', applicant.companyName],
                ['Job Title', applicant.jobTitle],
                ['Annual Salary', applicant.annualIncome ? `£${applicant.annualIncome}` : ''],
                ['Length of Service', applicant.lengthOfService]
              ].map(([label, value], rowIndex) => (
                <TableRow key={rowIndex} label={label} value={value || ''} isOdd={rowIndex % 2 === 1} />
              ))}

              {/* Current Property Details */}
              <SubSectionHeader title="Current Property Details" />
              {[
                ['Postcode', applicant.previousPostcode],
                ['Street Address', applicant.previousAddress],
                ['Move In Date', applicant.moveInDate],
                ['Vacate Date', applicant.vacateDate],
                ['Current Property Status', applicant.currentPropertyStatus],
                ['Current Rental Amount', applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : '']
              ].map(([label, value], rowIndex) => (
                <TableRow key={rowIndex} label={label} value={value || ''} isOdd={rowIndex % 2 === 1} />
              ))}

              {/* Additional Information */}
              <SubSectionHeader title="Additional Information" />
              {[
                ['UK/ROI Passport', application.additional_details?.ukPassport === 'yes' ? 'Yes' : 'No'],
                ['Adverse Credit', application.additional_details?.adverseCredit === 'yes' ? 'Yes' : 'No'],
                ['Adverse Credit Details', application.additional_details?.adverseCreditDetails],
                ['Requires Guarantor', application.additional_details?.guarantorRequired === 'yes' ? 'Yes' : 'No']
              ].map(([label, value], rowIndex) => (
                <TableRow key={rowIndex} label={label} value={value || ''} isOdd={rowIndex % 2 === 1} />
              ))}
            </div>
          ))}

          {/* Data Sharing */}
          <div className="border-t">
            <SectionHeader title="Data Sharing" />
            {[
              ['Accept Utilities', application.data_sharing?.utilities ? 'Yes' : 'No'],
              ['Accept Insurance', application.data_sharing?.insurance ? 'Yes' : 'No']
            ].map(([label, value], index) => (
              <TableRow key={index} label={label} value={value} isOdd={index % 2 === 1} />
            ))}
          </div>

          {/* Signature */}
          <div className="border-t">
            <SectionHeader title="Signature" />
            <div className="p-4 space-y-4">
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
                <>
                  <TableRow label="Full Name" value={application.signature} isOdd={false} />
                  <TableRow label="Signature" value={application.signature} isOdd={true} />
                </>
              )}
              <TableRow 
                label="Submitted At" 
                value={format(new Date(application.submitted_at), 'do MMMM yyyy - h:mm aa')} 
                isOdd={false} 
              />
            </div>
          </div>

          {/* Activity Log */}
          {activityLogs.length > 0 && (
            <div className="border-t">
              <SectionHeader title="History" />
              <div className="p-4">
                {activityLogs.map((log, index) => (
                  <div key={log.id} className={`p-3 text-sm ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100 last:border-b-0`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{log.action}</div>
                        {log.ip_address && (
                          <div className="text-gray-600 text-xs mt-1">IP Address: {log.ip_address}</div>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs ml-4">
                        {format(new Date(log.created_at), 'do-MMM-yyyy h:mm aa')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t bg-gray-50 p-4 text-center text-sm text-gray-500">
            Palmer & Partners - Tenancy Application
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPreview;
