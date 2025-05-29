
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
  };

  const TableRow = ({ label, value, isSubsection = false }: { label: string; value: string; isSubsection?: boolean }) => {
    if (isSubsection) {
      return (
        <tr className="section-header">
          <td 
            colSpan={2} 
            className="text-center font-bold text-xs bg-gray-300 p-1 border border-gray-300"
            style={{
              fontSize: '10px',
              backgroundColor: 'rgb(216, 216, 216)',
              fontWeight: 'bold',
              padding: '4px',
              textAlign: 'center'
            }}
          >
            {label}
          </td>
        </tr>
      );
    }
    
    return (
      <tr>
        <th 
          className="w-1/4 text-left p-2 border border-gray-300"
          style={{
            backgroundColor: '#f2f2f2',
            padding: '8px 10px',
            textAlign: 'left'
          }}
        >
          {label}
        </th>
        <td 
          className="p-2 border border-gray-300"
          style={{
            padding: '8px 10px'
          }}
        >
          {value || '-'}
        </td>
      </tr>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h4 
      className="text-white text-center text-xs p-2 rounded-t-md"
      style={{
        margin: 0,
        marginBottom: 0, // Explicitly no bottom margin
        color: 'white',
        background: '#202020',
        padding: '5px 10px',
        borderBottom: '2px solid black',
        fontSize: '12px',
        borderRadius: '5px 5px 0 0',
        textAlign: 'center'
      }}
    >
      {title}
    </h4>
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
          {/* Logo Header with grey background */}
          <div className="text-center py-6 bg-gray-200">
            <div className="inline-block bg-orange-500 px-8 py-4 rounded">
              <img 
                src="/lovable-uploads/6428db9d-5582-4e09-970d-e10b1b3afe27.png" 
                alt="Company Logo" 
                className="h-12"
              />
            </div>
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
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <TableRow label="Street Address" value={application.property_preferences?.streetAddress} />
                <TableRow label="Postcode" value={application.property_preferences?.postcode} />
                <TableRow label="Rental Amount" value={application.property_preferences?.maxRent ? `£${application.property_preferences.maxRent}` : ''} />
                <TableRow label="Preferred Move-in Date" value={application.property_preferences?.moveInDate} />
                <TableRow label="Latest Move-in Date" value={application.property_preferences?.latestMoveInDate} />
                <TableRow label="Initial Tenancy Term" value={application.property_preferences?.initialTenancyTerm} />
                <TableRow label="Has Pets" value={application.additional_details?.pets === 'yes' ? 'Yes' : 'No'} />
                <TableRow label="Under 18s" value={application.additional_details?.under18Count || '0'} />
                {application.additional_details?.under18Count && parseInt(application.additional_details.under18Count) > 1 && application.additional_details?.childrenAges && (
                  <TableRow label="Under 18s Details" value={application.additional_details.childrenAges} />
                )}
                <TableRow label="Conditions of Offer" value={application.additional_details?.conditionsOfOffer} />
                <TableRow label="Deposit Type" value={application.additional_details?.depositType} />
              </tbody>
            </table>
          </div>

          {/* Applicants */}
          {application.applicants.map((applicant, index) => (
            <div key={index} className="border-t">
              <SectionHeader title={`Applicant - #${index + 1}`} />
              
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  {/* Personal Details */}
                  <TableRow label="First Name" value={applicant.firstName} />
                  <TableRow label="Last Name" value={applicant.lastName} />
                  <TableRow label="Date of Birth" value={applicant.dateOfBirth} />
                  <TableRow label="Email Address" value={applicant.email} />
                  <TableRow label="Mobile Number" value={applicant.phone} />

                  {/* Employment Details */}
                  <TableRow label="Employment Details" value="" isSubsection={true} />
                  <TableRow label="Contract Type" value={applicant.employment} />
                  <TableRow label="Company Name" value={applicant.companyName} />
                  <TableRow label="Job Title" value={applicant.jobTitle} />
                  <TableRow label="Annual Salary" value={applicant.annualIncome ? `£${applicant.annualIncome}` : ''} />
                  <TableRow label="Length of Service" value={applicant.lengthOfService} />

                  {/* Current Property Details */}
                  <TableRow label="Current Property Details" value="" isSubsection={true} />
                  <TableRow label="Postcode" value={applicant.previousPostcode} />
                  <TableRow label="Street Address" value={applicant.previousAddress} />
                  <TableRow label="Move In Date" value={applicant.moveInDate} />
                  <TableRow label="Vacate Date" value={applicant.vacateDate} />
                  <TableRow label="Current Property Status" value={applicant.currentPropertyStatus} />
                  <TableRow label="Current Rental Amount" value={applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : ''} />

                  {/* Additional Information */}
                  <TableRow label="Additional Information" value="" isSubsection={true} />
                  <TableRow label="UK/ROI Passport" value={application.additional_details?.ukPassport === 'yes' ? 'Yes' : 'No'} />
                  <TableRow label="Adverse Credit" value={application.additional_details?.adverseCredit === 'yes' ? 'Yes' : 'No'} />
                  {application.additional_details?.adverseCredit === 'yes' && application.additional_details?.adverseCreditDetails && (
                    <TableRow label="Adverse Credit Details" value={application.additional_details.adverseCreditDetails} />
                  )}
                  <TableRow label="Requires Guarantor" value={application.additional_details?.guarantorRequired === 'yes' ? 'Yes' : 'No'} />
                  {application.additional_details?.pets === 'yes' && application.additional_details?.petDetails && (
                    <TableRow label="Pet Details" value={application.additional_details.petDetails} />
                  )}
                </tbody>
              </table>
            </div>
          ))}

          {/* Data Sharing */}
          <div className="border-t">
            <SectionHeader title="Data Sharing" />
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <TableRow label="Accept Utilities" value={application.data_sharing?.utilities ? 'Yes' : 'No'} />
                <TableRow label="Accept Insurance" value={application.data_sharing?.insurance ? 'Yes' : 'No'} />
              </tbody>
            </table>
          </div>

          {/* Signature */}
          <div className="border-t">
            <SectionHeader title="Signature" />
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                {application.signature && application.signature.startsWith('data:image/') ? (
                  <>
                    <TableRow label="Full Name" value={`${application.applicants[0]?.firstName || ''} ${application.applicants[0]?.lastName || ''}`} />
                    <tr>
                      <th 
                        className="w-1/4 text-left p-2 border border-gray-300"
                        style={{
                          backgroundColor: '#f2f2f2',
                          padding: '8px 10px',
                          textAlign: 'left'
                        }}
                      >
                        Signature
                      </th>
                      <td 
                        className="p-2 border border-gray-300"
                        style={{
                          padding: '8px 10px'
                        }}
                      >
                        <img 
                          src={application.signature} 
                          alt="Digital Signature" 
                          className="max-w-xs"
                          style={{ maxWidth: '100%', maxHeight: '40px' }}
                        />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <TableRow label="Full Name" value={application.signature} />
                    <TableRow label="Signature" value={application.signature} />
                  </>
                )}
                <TableRow 
                  label="Submitted At" 
                  value={format(new Date(application.submitted_at), 'do MMMM yyyy - h:mm aa')} 
                />
              </tbody>
            </table>
          </div>

          {/* Activity Log */}
          {activityLogs.length > 0 && (
            <div className="border-t">
              <SectionHeader title="History" />
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  {activityLogs.map((log, index) => (
                    <TableRow 
                      key={log.id} 
                      label={log.action} 
                      value={`${format(new Date(log.created_at), 'do-MMM-yyyy h:mm aa')}${log.ip_address ? ' - IP: ' + log.ip_address : ''}`} 
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationPreview;
