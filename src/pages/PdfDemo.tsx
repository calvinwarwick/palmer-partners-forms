
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
        dateOfBirth: "31st December 2024",
        employment: "employed",
        companyName: "Tech Solutions Ltd",
        jobTitle: "Software Engineer",
        annualIncome: "50000",
        lengthOfService: "3 years",
        previousAddress: "Orchard House, New Cut",
        previousPostcode: "IP7 5DA",
        currentPropertyStatus: "Rented Privately",
        moveInDate: "2022-01-15",
        vacateDate: "2024-05-30",
        currentRentalAmount: "1800",
        ukPassport: "yes",
        adverseCredit: "no",
        guarantorRequired: "no"
      }
    ],
    propertyPreferences: {
      streetAddress: "Orchard House, New Cut",
      postcode: "IP7 5DA",
      maxRent: "123",
      moveInDate: "1st December 2026",
      latestMoveInDate: "1st January 2027",
      initialTenancyTerm: "1 year"
    },
    additionalDetails: {
      pets: false,
      children: false,
      additionalRequests: ""
    },
    dataSharing: {
      utilities: false,
      insurance: true
    },
    signature: "Calvin Warwick",
    submittedAt: "2025-02-10T12:38:00.000Z"
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-dark-grey text-white py-3 px-4 font-bold text-center mb-0">
      {title}
    </div>
  );

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <TableRow>
      <TableCell className="bg-gray-100 font-medium border border-gray-300 p-3">
        {label}
      </TableCell>
      <TableCell className="bg-white border border-gray-300 p-3">
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
                <DataRow label="Street Address" value={demoData.propertyPreferences.streetAddress} />
                <DataRow label="Postcode" value={demoData.propertyPreferences.postcode} />
                <DataRow label="Rental Amount" value={`£${demoData.propertyPreferences.maxRent}`} />
                <DataRow label="Preferred Move-in Date" value={demoData.propertyPreferences.moveInDate} />
                <DataRow label="Latest Move-in Date" value={demoData.propertyPreferences.latestMoveInDate} />
                <DataRow label="Initial Tenancy Term" value={demoData.propertyPreferences.initialTenancyTerm} />
                <DataRow label="Has Pets" value={demoData.additionalDetails.pets ? 'Yes' : 'No'} />
                <DataRow label="Under 18s" value={demoData.additionalDetails.children ? 'Yes' : 'No'} />
                <DataRow label="Additional Requests" value={demoData.additionalDetails.additionalRequests} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Applicant Section */}
        {demoData.applicants.map((applicant, index) => (
          <Card key={applicant.id} className="mb-6 border-0 shadow-none">
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
                  <DataRow label="UK/ROI Passport" value={applicant.ukPassport === 'yes' ? 'Yes' : 'No'} />
                  <DataRow label="Adverse Credit" value={applicant.adverseCredit === 'yes' ? 'Yes' : 'No'} />
                  <DataRow label="Requires Guarantor" value={applicant.guarantorRequired === 'yes' ? 'Yes' : 'No'} />
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
                  <TableCell className="bg-gray-100 font-medium border border-gray-300 p-3">
                    Signature
                  </TableCell>
                  <TableCell className="bg-white border border-gray-300 p-3">
                    <div className="bg-gray-100 border border-gray-200 p-4 text-center text-gray-600">
                      Digital Signature Applied
                    </div>
                  </TableCell>
                </TableRow>
                <DataRow label="Submitted At" value={new Date(demoData.submittedAt).toLocaleString()} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer note */}
        <div className="text-center text-sm text-gray-600 mt-8">
          <p>This is a live web version of the tenancy application format sent to customers.</p>
        </div>
      </div>
    </div>
  );
};

export default PdfDemo;
