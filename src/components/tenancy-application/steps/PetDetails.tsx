
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface PetDetailsProps {
  pets: boolean;
  petDetails?: string;
  onPetsChange: (value: boolean) => void;
  onPetDetailsChange: (value: string) => void;
}

export const PetDetails = ({ pets, petDetails, onPetsChange, onPetDetailsChange }: PetDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Do you have any pets?</Label>
          <RadioGroup
            value={pets ? "yes" : "no"}
            onValueChange={(value) => onPetsChange(value === "yes")}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="pets-yes" />
              <Label htmlFor="pets-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="pets-no" />
              <Label htmlFor="pets-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {pets && (
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
