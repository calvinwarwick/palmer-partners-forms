
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      </CardContent>
    </Card>
  );
};

export default DemoDataForm;
