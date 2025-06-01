
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  additional_details: any;
  data_sharing: any;
  signature: string;
  submitted_at: string;
}

interface ApplicationPreviewContentProps {
  application: TenancyApplication;
}

const ApplicationPreviewContent = ({ application }: ApplicationPreviewContentProps) => {
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-dark-grey text-white py-3 px-4 font-bold text-center mb-0">
      {title}
    </div>
  );

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <TableRow>
      <TableCell className="bg-gray-100 font-medium border border-gray-300 p-3 w-[35%]">
        {label}
      </TableCell>
      <TableCell className="bg-white border border-gray-300 p-3 w-[65%]">
        {value || '-'}
      </TableCell>
    </TableRow>
  );

  const SubsectionHeader = ({ title }: { title: string }) => (
    <TableRow>
      <TableCell colSpan={2} className="bg-gray-200 font-bold text-center border border-gray-300 p-2">
        {title}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="bg-white font-lexend h-full overflow-y-auto">
      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark-grey">Tenancy Application</h1>
      </div>

      {/* Property Details Section */}
      <Card className="mb-6 border-0 shadow-none">
        <SectionHeader title="Property Details" />
        <CardContent className="p-0">
          <Table>
            <TableBody>
              <DataRow label="Street Address" value={application.property_preferences?.streetAddress} />
              <DataRow label="Postcode" value={application.property_preferences?.postcode} />
              <DataRow label="Rental Amount" value={application.property_preferences?.maxRent ? `£${application.property_preferences.maxRent}` : ''} />
              <DataRow label="Preferred Move-in Date" value={application.property_preferences?.moveInDate} />
              <DataRow label="Latest Move-in Date" value={application.property_preferences?.latestMoveInDate} />
              <DataRow label="Initial Tenancy Term" value={application.property_preferences?.initialTenancyTerm} />
              <DataRow label="Has Pets" value={application.additional_details?.pets === 'yes' ? 'Yes' : 'No'} />
              <DataRow label="Under 18s" value={application.additional_details?.under18Count || '0'} />
              {application.additional_details?.under18Count && parseInt(application.additional_details.under18Count) > 1 && application.additional_details?.childrenAges && (
                <DataRow label="Under 18s Details" value={application.additional_details.childrenAges} />
              )}
              <DataRow label="Conditions of Offer" value={application.additional_details?.conditionsOfOffer} />
              <DataRow label="Deposit Type" value={application.additional_details?.depositType} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Applicant Section */}
      {application.applicants.map((applicant, index) => (
        <Card key={index} className="mb-6 border-0 shadow-none">
          <SectionHeader title={`Applicant - #${index + 1}`} />
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {/* Personal Details */}
                <DataRow label="First Name" value={applicant.firstName} />
                <DataRow label="Last Name" value={applicant.lastName} />
                <DataRow label="Date of Birth" value={applicant.dateOfBirth} />
                <DataRow label="Email Address" value={applicant.email} />
                <DataRow label="Mobile Number" value={applicant.phone} />

                {/* Employment Details */}
                <SubsectionHeader title="Employment Details" />
                <DataRow label="Contract Type" value={applicant.employment} />
                <DataRow label="Company Name" value={applicant.companyName} />
                <DataRow label="Job Title" value={applicant.jobTitle} />
                <DataRow label="Annual Salary" value={applicant.annualIncome ? `£${applicant.annualIncome}` : ''} />
                <DataRow label="Length of Service" value={applicant.lengthOfService} />

                {/* Current Property Details */}
                <SubsectionHeader title="Current Property Details" />
                <DataRow label="Postcode" value={applicant.previousPostcode} />
                <DataRow label="Street Address" value={applicant.previousAddress} />
                <DataRow label="Move In Date" value={applicant.moveInDate} />
                <DataRow label="Vacate Date" value={applicant.vacateDate} />
                <DataRow label="Current Property Status" value={applicant.currentPropertyStatus} />
                <DataRow label="Current Rental Amount" value={applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : ''} />

                {/* Additional Information */}
                <SubsectionHeader title="Additional Information" />
                <DataRow label="UK/ROI Passport" value={application.additional_details?.ukPassport === 'yes' ? 'Yes' : 'No'} />
                <DataRow label="Adverse Credit" value={application.additional_details?.adverseCredit === 'yes' ? 'Yes' : 'No'} />
                {application.additional_details?.adverseCredit === 'yes' && application.additional_details?.adverseCreditDetails && (
                  <DataRow label="Adverse Credit Details" value={application.additional_details.adverseCreditDetails} />
                )}
                <DataRow label="Requires Guarantor" value={application.additional_details?.guarantorRequired === 'yes' ? 'Yes' : 'No'} />
                {application.additional_details?.pets === 'yes' && application.additional_details?.petDetails && (
                  <DataRow label="Pet Details" value={application.additional_details.petDetails} />
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Data Sharing Section */}
      <Card className="mb-6 border-0 shadow-none">
        <SectionHeader title="Data Sharing" />
        <CardContent className="p-0">
          <Table>
            <TableBody>
              <DataRow label="Accept Utilities" value={application.data_sharing?.utilities ? 'Yes' : 'No'} />
              <DataRow label="Accept Insurance" value={application.data_sharing?.insurance ? 'Yes' : 'No'} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Signature Section */}
      <Card className="mb-6 border-0 shadow-none">
        <SectionHeader title="Signature" />
        <CardContent className="p-0">
          <Table>
            <TableBody>
              <DataRow label="Full Name" value={`${application.applicants[0]?.firstName || ''} ${application.applicants[0]?.lastName || ''}`} />
              <TableRow>
                <TableCell className="bg-gray-100 font-medium border border-gray-300 p-3 w-[35%]">
                  Signature
                </TableCell>
                <TableCell className="bg-white border border-gray-300 p-3 w-[65%]">
                  {application.signature && application.signature.startsWith('data:image/') ? (
                    <img 
                      src={application.signature} 
                      alt="Digital Signature" 
                      className="max-w-xs"
                      style={{ maxWidth: '100%', maxHeight: '40px' }}
                    />
                  ) : (
                    <div className="bg-gray-100 border border-gray-200 p-4 text-center text-gray-600">
                      Digital Signature Applied
                    </div>
                  )}
                </TableCell>
              </TableRow>
              <DataRow label="Submitted At" value={format(new Date(application.submitted_at), 'do MMMM yyyy - h:mm aa')} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationPreviewContent;
