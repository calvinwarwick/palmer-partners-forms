
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";
import { sendApplicationConfirmation } from "@/services/domain/ApplicationService";
import { toast } from "sonner";

interface DemoData {
  name: string;
  email: string;
  phone: string;
  address: string;
  propertyType: string;
  rentAmount: string;
}

interface DemoDataFormProps {
  data: DemoData;
  onUpdate: (field: keyof DemoData, value: string) => void;
}

const DemoDataForm = ({ data, onUpdate }: DemoDataFormProps) => {
  const { generatePdf, isGenerating } = usePdfGeneration();

  const handleGeneratePdf = async () => {
    const demoApplicationData = {
      applicants: [{
        id: '1',
        firstName: data.name.split(' ')[0] || 'John',
        lastName: data.name.split(' ')[1] || 'Doe',
        email: data.email,
        phone: data.phone,
        dateOfBirth: '1990-01-01',
        employment: 'Full-time',
        companyName: 'Demo Company',
        jobTitle: 'Software Developer',
        annualIncome: '50000',
        lengthOfService: '2 years',
        previousAddress: data.address,
        previousPostcode: 'SW1A 1AA',
        moveInDate: '2024-01-01',
        vacateDate: '2024-06-01',
        currentPropertyStatus: 'Renting',
        currentRentalAmount: '1500'
      }],
      propertyPreferences: {
        streetAddress: data.address,
        postcode: 'SW1A 1AA',
        propertyType: data.propertyType,
        maxRent: data.rentAmount,
        preferredLocation: 'Central London',
        moveInDate: '2024-07-01',
        latestMoveInDate: '2024-08-01',
        initialTenancyTerm: '12 months',
        additionalRequests: 'None'
      },
      additionalDetails: {
        moveInDate: '2024-07-01',
        tenancyLength: '12 months',
        pets: false,
        petDetails: '',
        smoking: false,
        parking: false,
        children: false,
        childrenDetails: '',
        additionalRequests: 'None',
        householdIncome: '50000',
        under18Count: '0',
        conditionsOfOffer: 'Standard',
        depositType: 'Standard'
      },
      dataSharing: {
        utilities: true,
        insurance: false
      },
      signature: data.name,
      submittedAt: new Date().toISOString(),
      applicationId: 'DEMO-' + Date.now()
    };

    try {
      await generatePdf(demoApplicationData, `${data.name.replace(/\s+/g, '_')}_Demo_Application.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const handleTestEmail = async () => {
    if (!data.email) {
      toast.error('Please enter an email address to test email functionality');
      return;
    }

    const demoApplication = {
      applicants: [{
        id: '1',
        firstName: data.name.split(' ')[0] || 'John',
        lastName: data.name.split(' ')[1] || 'Doe',
        email: data.email,
        phone: data.phone,
        dateOfBirth: '1990-01-01',
        employment: 'Full-time',
        companyName: 'Demo Company',
        jobTitle: 'Software Developer',
        annualIncome: '50000',
        lengthOfService: '2 years',
        previousAddress: data.address,
        previousPostcode: 'SW1A 1AA',
        moveInDate: '2024-01-01',
        vacateDate: '2024-06-01',
        currentPropertyStatus: 'Renting',
        currentRentalAmount: '1500'
      }],
      propertyPreferences: {
        streetAddress: data.address,
        postcode: 'SW1A 1AA',
        propertyType: data.propertyType,
        maxRent: data.rentAmount,
        preferredLocation: 'Central London',
        moveInDate: '2024-07-01',
        latestMoveInDate: '2024-08-01',
        initialTenancyTerm: '12 months',
        additionalRequests: 'None'
      },
      additionalDetails: {
        moveInDate: '2024-07-01',
        tenancyLength: '12 months',
        pets: false,
        petDetails: '',
        smoking: false,
        parking: false,
        children: false,
        childrenDetails: '',
        additionalRequests: 'None',
        householdIncome: '50000',
        under18Count: '0',
        conditionsOfOffer: 'Standard',
        depositType: 'Standard'
      },
      dataSharing: {
        utilities: true,
        insurance: false
      },
      signature: data.name
    };

    try {
      toast.loading('Sending test email with PDF attachment...');
      const result = await sendApplicationConfirmation(demoApplication);
      
      if (result) {
        toast.success('Test email sent successfully! Check your inbox for the PDF attachment.');
      } else {
        toast.error('Failed to send test email. Please check the console for details.');
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast.error('Failed to send test email. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Application Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onUpdate("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onUpdate("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => onUpdate("phone", e.target.value)}
              placeholder="+44 123 456 7890"
            />
          </div>
          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Input
              id="propertyType"
              value={data.propertyType}
              onChange={(e) => onUpdate("propertyType", e.target.value)}
              placeholder="2-bedroom apartment"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => onUpdate("address", e.target.value)}
            placeholder="123 Main Street, London, SW1A 1AA"
          />
        </div>
        <div>
          <Label htmlFor="rentAmount">Monthly Rent (£)</Label>
          <Input
            id="rentAmount"
            type="number"
            value={data.rentAmount}
            onChange={(e) => onUpdate("rentAmount", e.target.value)}
            placeholder="2500"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </Button>
          <Button 
            onClick={handleTestEmail}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Test Email with PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoDataForm;
