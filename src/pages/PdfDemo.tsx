import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ApplicationHeader from "@/components/shared/ApplicationHeader";

const PdfDemo = () => {
  const demoData = {
    applicants: [
      {
        id: "1",
        firstName: "Calvin",
        lastName: "Warwick",
        email: "calvinwarwick@gmail.com",
        phone: "+447549912062",
        dateOfBirth: "1990-12-31",
        employment: "Full-time Employment",
        companyName: "Tech Solutions Ltd",
        jobTitle: "Software Engineer",
        annualIncome: "50000",
        lengthOfService: "3 years",
        previousAddress: "123 Previous Street, London",
        previousPostcode: "SW1A 1AA",
        currentPropertyStatus: "Rented Privately",
        moveInDate: "2022-01-15",
        vacateDate: "2024-05-30",
        currentRentalAmount: "1800",
        currentAddress: "45 Current Road, London",
        currentPostcode: "SW2B 2BB",
        timeAtAddress: "2 years 6 months",
        landlordName: "John Smith",
        landlordPhone: "+447700900123",
        rentUpToDate: "yes",
        noticePeriod: "1 month",
        previousLandlordName: "Sarah Johnson",
        previousLandlordPhone: "+447700900456",
        guarantorAdded: true,
        guarantorName: "Robert Warwick",
        guarantorRelationship: "Father"
      },
      {
        id: "2",
        firstName: "Emma",
        lastName: "Thompson",
        email: "emma.thompson@email.com",
        phone: "+447549912063",
        dateOfBirth: "1988-07-15",
        employment: "Full-time Employment",
        companyName: "Creative Design Agency",
        jobTitle: "Senior Designer",
        annualIncome: "48000",
        lengthOfService: "4 years 2 months",
        previousAddress: "789 Old Avenue, Manchester",
        previousPostcode: "M1 3CD",
        currentPropertyStatus: "Rented Privately",
        moveInDate: "2021-03-10",
        vacateDate: "2024-06-15",
        currentRentalAmount: "1650",
        currentAddress: "22 Modern Street, Manchester",
        currentPostcode: "M2 4EF",
        timeAtAddress: "3 years 3 months",
        landlordName: "Michael Brown",
        landlordPhone: "+447700900789",
        rentUpToDate: "yes",
        noticePeriod: "2 months",
        previousLandlordName: "Lisa Wilson",
        previousLandlordPhone: "+447700900012",
        guarantorAdded: false,
        guarantorName: "",
        guarantorRelationship: ""
      }
    ],
    propertyPreferences: {
      streetAddress: "Orchard House, New Cut, Hadleigh",
      postcode: "IP7 5DA",
      maxRent: "2500",
      moveInDate: "2024-12-01",
      latestMoveInDate: "2025-01-01",
      initialTenancyTerm: "12 months"
    },
    additionalDetails: {
      pets: true,
      petDetails: "1 small dog (Jack Russell, 5 years old, neutered, vaccinated)",
      under18Count: "1",
      childrenAges: "One child aged 8 years old",
      additionalRequests: "Parking space preferred, garden access required for pet",
      ukPassport: "yes",
      adverseCredit: "no",
      adverseCreditDetails: "",
      guarantorRequired: "no",
      depositType: "Standard Deposit"
    },
    dataSharing: {
      utilities: true,
      insurance: false
    },
    signature: "Calvin Warwick",
    submittedAt: "2024-12-10T12:38:00.000Z"
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'long' });
      const year = date.getFullYear();
      
      const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    } catch {
      return dateString;
    }
  };

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
    <div className="min-h-screen bg-white font-lexend">
      <ApplicationHeader />
      
      <div className="max-w-4xl mx-auto p-8">
        {/* Updated header message */}
        <div className="text-center mb-8 p-6 bg-orange-50 border border-orange-200 rounded-lg">
          <h1 className="text-3xl font-bold text-dark-grey mb-4">Your Tenancy Application</h1>
          <p className="text-gray-600">
            This is how your submitted tenancy application appears. You can bookmark this page for your records.
            The same format is sent to you as a PDF attachment via email.
          </p>
        </div>

        {/* Header with logo placeholder */}
        <div className="bg-dark-grey text-white py-6 px-4 mb-4 relative">
          <div className="bg-white text-dark-grey py-2 px-4 mx-auto w-fit rounded font-bold text-lg">
            Palmer & Partners
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark-grey">Tenancy Application</h2>
        </div>

        {/* Property Details Section */}
        <Card className="mb-6 border-0 shadow-none">
          <SectionHeader title="Property Details" />
          <CardContent className="p-0">
            <Table>
              <TableBody>
                <DataRow label="Street Address" value={demoData.propertyPreferences.streetAddress} />
                <DataRow label="Postcode" value={demoData.propertyPreferences.postcode} />
                <DataRow label="Rental Amount" value={`£${demoData.propertyPreferences.maxRent}`} />
                <DataRow label="Preferred Move-in Date" value={formatDate(demoData.propertyPreferences.moveInDate)} />
                <DataRow label="Latest Move-in Date" value={formatDate(demoData.propertyPreferences.latestMoveInDate)} />
                <DataRow label="Initial Tenancy Term" value={demoData.propertyPreferences.initialTenancyTerm} />
                <DataRow label="Has Pets" value={demoData.additionalDetails.pets ? 'Yes' : 'No'} />
                <DataRow label="Under 18s" value={demoData.additionalDetails.under18Count} />
                {demoData.additionalDetails.under18Count && parseInt(demoData.additionalDetails.under18Count) > 0 && demoData.additionalDetails.childrenAges && (
                  <DataRow label="Under 18s Details" value={demoData.additionalDetails.childrenAges} />
                )}
                <DataRow label="Additional Requests" value={demoData.additionalDetails.additionalRequests} />
                <DataRow label="Deposit Type" value={demoData.additionalDetails.depositType} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Applicant Sections */}
        {demoData.applicants.map((applicant, index) => (
          <Card key={applicant.id} className="mb-6 border-0 shadow-none">
            <SectionHeader title={`Applicant - #${index + 1}`} />
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {/* Personal Details */}
                  <DataRow label="First Name" value={applicant.firstName} />
                  <DataRow label="Last Name" value={applicant.lastName} />
                  <DataRow label="Date of Birth" value={formatDate(applicant.dateOfBirth)} />
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
                  <DataRow label="Postcode" value={applicant.currentPostcode || applicant.previousPostcode} />
                  <DataRow label="Street Address" value={applicant.currentAddress || applicant.previousAddress} />
                  <DataRow label="Time at Address" value={applicant.timeAtAddress || 'N/A'} />
                  <DataRow label="Landlord Name" value={applicant.landlordName || 'N/A'} />
                  <DataRow label="Landlord Phone" value={applicant.landlordPhone || 'N/A'} />
                  <DataRow label="Rent Up to Date" value={applicant.rentUpToDate === 'yes' ? 'Yes' : 'No'} />
                  <DataRow label="Notice Period" value={applicant.noticePeriod || 'N/A'} />
                  <DataRow label="Current Property Status" value={applicant.currentPropertyStatus} />
                  <DataRow label="Current Rental Amount" value={applicant.currentRentalAmount ? `£${applicant.currentRentalAmount}` : ''} />

                  {/* Previous Property Details */}
                  <SubsectionHeader title="Previous Property Details" />
                  <DataRow label="Previous Address" value={applicant.previousAddress} />
                  <DataRow label="Previous Postcode" value={applicant.previousPostcode} />
                  <DataRow label="Move In Date" value={formatDate(applicant.moveInDate)} />
                  <DataRow label="Vacate Date" value={formatDate(applicant.vacateDate)} />
                  <DataRow label="Previous Landlord Name" value={applicant.previousLandlordName || 'N/A'} />
                  <DataRow label="Previous Landlord Phone" value={applicant.previousLandlordPhone || 'N/A'} />

                  {/* Additional Information */}
                  <SubsectionHeader title="Additional Information" />
                  <DataRow label="UK/ROI Passport" value={demoData.additionalDetails.ukPassport === 'yes' ? 'Yes' : 'No'} />
                  <DataRow label="Adverse Credit" value={demoData.additionalDetails.adverseCredit === 'yes' ? 'Yes' : 'No'} />
                  {demoData.additionalDetails.adverseCredit === 'yes' && demoData.additionalDetails.adverseCreditDetails && (
                    <DataRow label="Adverse Credit Details" value={demoData.additionalDetails.adverseCreditDetails} />
                  )}
                  <DataRow label="Requires Guarantor" value={demoData.additionalDetails.guarantorRequired === 'yes' ? 'Yes' : 'No'} />
                  {demoData.additionalDetails.pets && demoData.additionalDetails.petDetails && (
                    <DataRow label="Pet Details" value={demoData.additionalDetails.petDetails} />
                  )}

                  {/* Guarantor Details - NEW SECTION */}
                  {applicant.guarantorAdded && applicant.guarantorName && (
                    <>
                      <SubsectionHeader title="Guarantor Details" />
                      <DataRow label="Guarantor Name" value={applicant.guarantorName} />
                      <DataRow label="Relationship" value={applicant.guarantorRelationship} />
                    </>
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
                <DataRow label="Accept Utilities" value={demoData.dataSharing.utilities ? 'Yes' : 'No'} />
                <DataRow label="Accept Insurance" value={demoData.dataSharing.insurance ? 'Yes' : 'No'} />
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
                <DataRow label="Full Name" value={`${demoData.applicants[0]?.firstName || ''} ${demoData.applicants[0]?.lastName || ''}`} />
                <TableRow>
                  <TableCell className="bg-gray-100 font-medium border border-gray-300 p-3 w-[35%]">
                    Signature
                  </TableCell>
                  <TableCell className="bg-white border border-gray-300 p-3 w-[65%]">
                    {demoData.signature && demoData.signature.startsWith('data:image/') ? (
                      <img 
                        src={demoData.signature} 
                        alt="Digital Signature" 
                        className="max-w-xs"
                        style={{ maxWidth: '100%', maxHeight: '40px' }}
                      />
                    ) : (
                      <div className="text-lg italic">
                        {demoData.signature || 'Digital Signature Applied'}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                <DataRow label="Submitted At" value={new Date(demoData.submittedAt).toLocaleString()} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer note */}
        <div className="text-center text-sm text-gray-600 mt-8">
          <p>This is a live web version of the tenancy application format sent to customers via email as a PDF attachment.</p>
        </div>
      </div>
    </div>
  );
};

export default PdfDemo;
