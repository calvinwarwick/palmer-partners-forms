
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface PetDetailsProps {
  pets: string;
  petDetails?: string;
  onPetsChange: (value: string) => void;
  onPetDetailsChange: (value: string) => void;
}

export const PetDetails = ({ pets, petDetails, onPetsChange, onPetDetailsChange }: PetDetailsProps) => {
  const handlePetYesChange = (checked: boolean) => {
    if (checked) {
      onPetsChange('yes');
    } else if (pets === 'yes') {
      onPetsChange('no');
    }
  };

  const handlePetNoChange = (checked: boolean) => {
    if (checked) {
      onPetsChange('no');
    } else if (pets === 'no') {
      onPetsChange('yes');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Do you have any pets?</Label>
          <div className="flex flex-row space-x-6 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pets-yes" 
                checked={pets === 'yes'}
                onCheckedChange={handlePetYesChange}
              />
              <Label htmlFor="pets-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pets-no" 
                checked={pets === 'no'}
                onCheckedChange={handlePetNoChange}
              />
              <Label htmlFor="pets-no">No</Label>
            </div>
          </div>
        </div>

        {pets === 'yes' && (
          <div>
            <Label htmlFor="petDetails">Please provide details about your pets</Label>
            <Textarea
              id="petDetails"
              value={petDetails || ''}
              onChange={(e) => onPetDetailsChange(e.target.value)}
              placeholder="e.g., 1 cat, 2 dogs..."
              rows={3}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
