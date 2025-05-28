import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePDFInWorker } from "@/services/pdfWorker";
import { FileText, Download } from "lucide-react";

const PdfDemo = () => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
        annualIncome: "50000",
        previousAddress: "Orchard House, New Cut",
        reference1Name: "John Smith",
        reference1Contact: "john@example.com"
      }
    ],
    propertyPreferences: {
      propertyType: "house",
      maxRent: "123",
      preferredLocation: "Central London",
      moveInDate: "1st December 2026",
      additionalRequests: ""
    },
    propertyDetails: {
      streetAddress: "Orchard House, New Cut",
      postcode: "IP7 5DA",
      rentalAmount: "£123.00",
      preferredMoveInDate: "1st December 2026",
      latestMoveInDate: "1st January 2027",
      initialTenancyTerm: "1 year",
      hasPets: "No",
      under18s: "None",
      conditionsOfOffer: "-",
      depositType: "Traditional deposit"
    },
    signature: "Calvin Warwick",
    submittedAt: "2025-02-10T12:38:00.000Z"
  };

  const generatePdf = useCallback(async () => {
    setIsGenerating(true);
    try {
      const pdfContent = await generatePDFInWorker(demoData);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadPdf = useCallback(() => {
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
  }, [pdfBlob]);

  const viewPdf = useCallback(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    }
  }, [pdfBlob]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            PDF Demo - Tenancy Application
          </h1>
          <p className="text-gray-600">
            Test the new PDF format with demo data matching the provided template.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Demo Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Applicant:</h4>
                <p className="text-sm text-gray-600">
                  {demoData.applicants[0].firstName} {demoData.applicants[0].lastName}
                </p>
                <p className="text-sm text-gray-600">{demoData.applicants[0].email}</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Property:</h4>
                <p className="text-sm text-gray-600">
                  {demoData.propertyDetails.streetAddress}
                </p>
                <p className="text-sm text-gray-600">
                  {demoData.propertyDetails.postcode}
                </p>
                <p className="text-sm text-gray-600">
                  Rent: {demoData.propertyDetails.rentalAmount}
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Dates:</h4>
                <p className="text-sm text-gray-600">
                  Preferred Move-in: {demoData.propertyDetails.preferredMoveInDate}
                </p>
                <p className="text-sm text-gray-600">
                  Latest Move-in: {demoData.propertyDetails.latestMoveInDate}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate & View PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generatePdf} 
                className="w-full"
                disabled={isGenerating}
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate PDF'}
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
            <CardTitle>PDF Preview Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Layout Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Orange header bar with Palmer & Partners branding</li>
                  <li>• Dark grey section headers</li>
                  <li>• Alternating row colors for easy reading</li>
                  <li>• Professional table layout</li>
                  <li>• Multi-page support with page numbers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content Sections:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Property Details</li>
                  <li>• Applicant Details</li>
                  <li>• Employment Details</li>
                  <li>• Current Property Details</li>
                  <li>• Additional Information</li>
                  <li>• Digital Signature</li>
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
