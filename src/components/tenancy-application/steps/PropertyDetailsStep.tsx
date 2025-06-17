import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Home } from "lucide-react";
import { PropertyPreferences } from "@/domain/types/Applicant";
interface PropertyDetailsStepProps {
  propertyPreferences: PropertyPreferences;
  onUpdatePreferences: (field: keyof PropertyPreferences, value: string) => void;
  onFillAllTestData?: () => void;
}
const PropertyDetailsStep = ({
  propertyPreferences,
  onUpdatePreferences,
  onFillAllTestData
}: PropertyDetailsStepProps) => {
  const handleDateChange = (field: keyof PropertyPreferences, value: string) => {
    // Extract parts and limit year to 4 digits
    const parts = value.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const limitedYear = year.slice(0, 4);
      const formattedDate = `${limitedYear}-${month}-${day}`;
      onUpdatePreferences(field, formattedDate);
    } else {
      onUpdatePreferences(field, value);
    }
  };
  return <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Proposed Rental Property Details</h3>
        <p className="text-light-grey mb-4">Please provide the details of the property you are applying for.</p>
      </div>

      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader className="">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Home className="h-5 w-5" />
            </div>
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="streetAddress" className="form-label text-gray-700 font-medium">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input id="streetAddress" name="streetAddress" value={propertyPreferences.streetAddress} onChange={e => onUpdatePreferences("streetAddress", e.target.value)} placeholder="Rental property address" className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode" className="form-label text-gray-700 font-medium">
                Postcode <span className="text-red-500">*</span>
              </Label>
              <Input id="postcode" name="postcode" value={propertyPreferences.postcode} onChange={e => onUpdatePreferences("postcode", e.target.value)} placeholder="Rental property postcode" className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxRent" className="form-label text-gray-700 font-medium">
                Rental amount <span className="text-red-500">*</span>
              </Label>
              <div className="currency-input-container">
                <span className="currency-input-icon text-orange-500">£</span>
                <Input id="maxRent" name="maxRent" type="number" value={propertyPreferences.maxRent} onChange={e => onUpdatePreferences("maxRent", e.target.value)} placeholder="" className="currency-input border-gray-200 focus:border-orange-500 focus:ring-orange-500" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="moveInDate" className="form-label text-gray-700 font-medium">
                Preferred move-in date <span className="text-red-500">*</span>
              </Label>
              <div className="date-input-container">
                <Calendar className="date-input-icon" />
                <Input id="moveInDate" name="moveInDate" type="date" value={propertyPreferences.moveInDate} onChange={e => handleDateChange("moveInDate", e.target.value)} className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" required max="9999-12-31" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="latestMoveInDate" className="form-label text-gray-700 font-medium">
                Latest move-in date <span className="text-red-500">*</span>
              </Label>
              <div className="date-input-container">
                <Calendar className="date-input-icon" />
                <Input id="latestMoveInDate" name="latestMoveInDate" type="date" value={propertyPreferences.latestMoveInDate} onChange={e => handleDateChange("latestMoveInDate", e.target.value)} className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" required max="9999-12-31" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialTenancyTerm" className="form-label text-gray-700 font-medium">
                Preferred initial tenancy term <span className="text-red-500">*</span>
              </Label>
              <Select value={propertyPreferences.initialTenancyTerm} onValueChange={value => onUpdatePreferences("initialTenancyTerm", value)}>
                <SelectTrigger id="initialTenancyTerm" name="initialTenancyTerm" className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 px-4">
                  <SelectValue placeholder="Please select an option" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  <SelectItem value="1 year">1 year</SelectItem>
                  <SelectItem value="2 years">2 years</SelectItem>
                  <SelectItem value="3 years">3 years</SelectItem>
                  <SelectItem value="4+ years">4+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default PropertyDetailsStep;