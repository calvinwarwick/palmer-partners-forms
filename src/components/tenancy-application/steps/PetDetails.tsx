
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Applicant } from "@/domain/types/Applicant";

interface PetDetailsProps {
  applicants: Applicant[];
  onUpdateApplicant: (index: number, field: string, value: any) => void;
}

const PetDetails = ({ applicants, onUpdateApplicant }: PetDetailsProps) => {
  return (
    <Card className="border-0 bg-white/95 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-dark-grey">Pet Information</CardTitle>
        <CardDescription>
          Please provide details about any pets you plan to bring to the property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {applicants.map((applicant, index) => (
          <div key={applicant.id} className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-semibold text-dark-grey">
              {applicant.firstName || `Applicant ${index + 1}`} - Pet Details
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor={`pets-${index}`} className="text-sm font-medium text-dark-grey">
                Do you have any pets?
              </Label>
              <Select
                value={applicant.pets || ""}
                onValueChange={(value) => onUpdateApplicant(index, "pets", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pet status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No pets</SelectItem>
                  <SelectItem value="dog">Dog(s)</SelectItem>
                  <SelectItem value="cat">Cat(s)</SelectItem>
                  <SelectItem value="other">Other pet(s)</SelectItem>
                  <SelectItem value="multiple">Multiple pets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {applicant.pets && applicant.pets !== "none" && (
              <div className="space-y-2">
                <Label htmlFor={`petDetails-${index}`} className="text-sm font-medium text-dark-grey">
                  Pet Details
                </Label>
                <Textarea
                  id={`petDetails-${index}`}
                  placeholder="Please provide details about your pets (breed, age, size, etc.)"
                  value={applicant.petDetails || ""}
                  onChange={(e) => onUpdateApplicant(index, "petDetails", e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PetDetails;
