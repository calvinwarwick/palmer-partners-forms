
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";

interface ApplicationDetailsModalProps {
  application: {
    id: string;
    applicants: Applicant[];
    property_preferences: PropertyPreferences;
    additional_details: AdditionalDetails;
    data_sharing: { utilities: boolean; insurance: boolean };
    signature: string;
    status?: string;
    submitted_at: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationDetailsModal = ({ application, isOpen, onClose }: ApplicationDetailsModalProps) => {
  if (!application) return null;

  const primaryApplicant = application.applicants[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Application Details</span>
            {application.status && (
              <Badge className={`${getStatusColor(application.status)} text-white`}>
                {application.status.replace('_', ' ').toUpperCase()}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Primary Applicant */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Primary Applicant</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{primaryApplicant?.firstName} {primaryApplicant?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{primaryApplicant?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{primaryApplicant?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium">{primaryApplicant?.dateOfBirth}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Applicants */}
            {application.applicants.length > 1 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Additional Applicants ({application.applicants.length - 1})</h3>
                  {application.applicants.slice(1).map((applicant, index) => (
                    <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{applicant.firstName} {applicant.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{applicant.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
              </>
            )}

            {/* Property Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Property Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{application.property_preferences?.streetAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Postcode</p>
                  <p className="font-medium">{application.property_preferences?.postcode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Rent</p>
                  <p className="font-medium">£{application.property_preferences?.maxRent}/month</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Move-in Date</p>
                  <p className="font-medium">{application.property_preferences?.moveInDate}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Pets</p>
                  <p className="font-medium">{application.additional_details?.pets || 'None specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guarantor Required</p>
                  <p className="font-medium">{application.additional_details?.guarantorRequired || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">UK Passport</p>
                  <p className="font-medium">{application.additional_details?.ukPassport || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Adverse Credit</p>
                  <p className="font-medium">{application.additional_details?.adverseCredit || 'Not specified'}</p>
                </div>
                {application.additional_details?.adverseCreditDetails && (
                  <div>
                    <p className="text-sm text-gray-600">Adverse Credit Details</p>
                    <p className="font-medium">{application.additional_details.adverseCreditDetails}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Children Under 18</p>
                  <p className="font-medium">{application.additional_details?.under18Count || 'None'}</p>
                </div>
                {application.additional_details?.childrenAges && (
                  <div>
                    <p className="text-sm text-gray-600">Children Ages</p>
                    <p className="font-medium">{application.additional_details.childrenAges}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Data Sharing Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Sharing Consent</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Utilities:</span>
                  <Badge variant={application.data_sharing?.utilities ? "default" : "secondary"}>
                    {application.data_sharing?.utilities ? "Consented" : "Not Consented"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Insurance:</span>
                  <Badge variant={application.data_sharing?.insurance ? "default" : "secondary"}>
                    {application.data_sharing?.insurance ? "Consented" : "Not Consented"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Submission Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Submission Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Submitted At</p>
                  <p className="font-medium">{new Date(application.submitted_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Application ID</p>
                  <p className="font-medium font-mono text-xs">{application.id}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-orange-500';
    case 'approved': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    case 'under_review': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

export default ApplicationDetailsModal;
