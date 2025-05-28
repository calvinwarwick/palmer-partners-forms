
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateApplicationPDF } from "@/services/pdfService";
import { FileText, Download } from "lucide-react";

const PdfDemo = () => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const demoData = {
    applicants: [
      {
        id: "1",
        firstName: "Calvin",
        lastName: "Warwick",
        email: "calvinwarwick@gmail.com",
        phone: "+447549912062",
        dateOfBirth: "2024-12-31",
        employment: "Employed Full-time",
        companyName: "Tech Solutions Ltd",
        jobTitle: "Software Developer",
        annualIncome: "50000",
        lengthOfService: "2 years",
        previousAddress: "Orchard House, New Cut",
        previousPostcode: "IP7 5DA",
        moveInDate: "2025-02-10",
        vacateDate: "2025-02-10",
        currentPropertyStatus: "Rented Privately",
        currentRentalAmount: "1000",
        reference1Name: "John Smith",
        reference1Contact: "john@example.com",
        ukPassport: "No",
        adverseCredit: "No",
        requiresGuarantor: "No",
        guarantorAddress: "",
        guarantorPostcode: ""
      }
    ],
    propertyDetails: {
      streetAddress: "Orchard House, New Cut",
      postcode: "IP7 5DA",
      rentalAmount: "123",
      preferredMoveInDate: "2026-12-01",
      latestMoveInDate: "2027-01-01",
      initialTenancyTerm: "1 year",
      hasPets: "No",
      under18s: "None",
      conditionsOfOffer: "-",
      depositType: "Traditional deposit"
    },
    dataSharing: {
      acceptUtilities: "Yes",
      acceptInsurance: "Yes"
    },
    signature: "Calvin Warwick",
    submittedAt: "2025-02-10T12:38:00.000Z"
  };

  const generatePdf = () => {
    try {
      const pdfContent = generateApplicationPDF(demoData);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const downloadPdf = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tenancy-application-demo.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const viewPdf = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg mb-6">
            <h1 className="text-3xl font-bold mb-2">Palmer & Partners</h1>
            <p className="text-orange-100">Property Management & Lettings</p>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            PDF Demo - Tenancy Application
          </h2>
          <p className="text-gray-600">
            Test the new PDF format with demo data matching the provided template. Features Palmer & Partners branding and professional layout.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Demo Data Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-orange-600">Property Details:</h4>
                <p className="text-sm text-gray-600">
                  {demoData.propertyDetails.streetAddress}
                </p>
                <p className="text-sm text-gray-600">
                  {demoData.propertyDetails.postcode}
                </p>
                <p className="text-sm text-gray-600">
                  Rent: £{demoData.propertyDetails.rentalAmount}.00
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-600">Applicant:</h4>
                <p className="text-sm text-gray-600">
                  {demoData.applicants[0].firstName} {demoData.applicants[0].lastName}
                </p>
                <p className="text-sm text-gray-600">{demoData.applicants[0].email}</p>
                <p className="text-sm text-gray-600">{demoData.applicants[0].phone}</p>
              </div>

              <div>
                <h4 className="font-semibold text-orange-600">Employment:</h4>
                <p className="text-sm text-gray-600">
                  {demoData.applicants[0].employment} at {demoData.applicants[0].companyName}
                </p>
                <p className="text-sm text-gray-600">
                  {demoData.applicants[0].jobTitle}
                </p>
                <p className="text-sm text-gray-600">
                  Annual Salary: £{demoData.applicants[0].annualIncome}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-orange-600">Move-in Dates:</h4>
                <p className="text-sm text-gray-600">
                  Preferred: 1st December 2026
                </p>
                <p className="text-sm text-gray-600">
                  Latest: 1st January 2027
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate & View PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generatePdf} className="w-full bg-orange-500 hover:bg-orange-600">
                <FileText className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
              
              {pdfBlob && (
                <div className="space-y-2">
                  <Button onClick={viewPdf} variant="outline" className="w-full">
                    View PDF
                  </Button>
                  <Button onClick={downloadPdf} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              )}
              
              {pdfBlob && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ PDF generated successfully! You can now view or download it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Enhanced PDF Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2 text-orange-600">Design Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Palmer & Partners branded header</li>
                  <li>• Orange color scheme matching brand</li>
                  <li>• Professional typography and spacing</li>
                  <li>• Clean table layout with alternating rows</li>
                  <li>• Multi-page support with consistent headers</li>
                  <li>• Page numbers and footer branding</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-600">Complete Data Sections:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Property Details (all fields)</li>
                  <li>• Applicant Personal Information</li>
                  <li>• Employment Details (company, job title, salary)</li>
                  <li>• Current Property Details</li>
                  <li>• Additional Information (passport, credit, guarantor)</li>
                  <li>• Guarantor Address (when applicable)</li>
                  <li>• Data Sharing Preferences</li>
                  <li>• Digital Signature & Timestamp</li>
                  <li>• Terms & Conditions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PdfDemo;
