import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Applicant } from "@/domain/types/Applicant";
import { Shield } from "lucide-react";
interface GuarantorFormProps {
  applicant: Applicant;
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (guarantorData: GuarantorData) => void;
}
interface GuarantorData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  relationship: string;
  address: string;
  postcode: string;
  employment: string;
  companyName: string;
  jobTitle: string;
  annualIncome: string;
  lengthOfService: string;
  notes: string;
}
const GuarantorForm = ({
  applicant,
  applicationId,
  isOpen,
  onClose,
  onSave
}: GuarantorFormProps) => {
  const [guarantorData, setGuarantorData] = useState<GuarantorData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    relationship: '',
    address: '',
    postcode: '',
    employment: '',
    companyName: '',
    jobTitle: '',
    annualIncome: '',
    lengthOfService: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const handleInputChange = (field: keyof GuarantorData, value: string) => {
    setGuarantorData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving guarantor data:', {
        applicationId,
        applicantId: applicant.id,
        guarantorData
      });
      onSave(guarantorData);
    } catch (error) {
      console.error('Error saving guarantor:', error);
    } finally {
      setSaving(false);
    }
  };
  const isFormValid = guarantorData.firstName && guarantorData.lastName && guarantorData.email && guarantorData.phone && guarantorData.relationship;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-lexend">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-orange-500" />
            Add Guarantor for {applicant.firstName} {applicant.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={guarantorData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} placeholder="Enter first name" className="form-control" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={guarantorData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} placeholder="Enter last name" className="form-control" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={guarantorData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="Enter email address" className="form-control" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={guarantorData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="Enter phone number" className="form-control" />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" value={guarantorData.dateOfBirth} onChange={e => handleInputChange('dateOfBirth', e.target.value)} className="form-control" />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship to Applicant</Label>
                <Select value={guarantorData.relationship} onValueChange={value => handleInputChange('relationship', value)}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="relative">Relative</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={guarantorData.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="Enter full address" className="form-control" />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input id="postcode" value={guarantorData.postcode} onChange={e => handleInputChange('postcode', e.target.value)} placeholder="Enter postcode" className="form-control" />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employment">Employment Status</Label>
                <Select value={guarantorData.employment} onValueChange={value => handleInputChange('employment', value)}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" value={guarantorData.companyName} onChange={e => handleInputChange('companyName', e.target.value)} placeholder="Enter company name" className="form-control" />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" value={guarantorData.jobTitle} onChange={e => handleInputChange('jobTitle', e.target.value)} placeholder="Enter job title" className="form-control" />
              </div>
              <div>
                <Label htmlFor="annualIncome">Annual Income</Label>
                <Input id="annualIncome" value={guarantorData.annualIncome} onChange={e => handleInputChange('annualIncome', e.target.value)} placeholder="Enter annual income" className="form-control" />
              </div>
              <div>
                <Label htmlFor="lengthOfService">Length of Service</Label>
                <Input id="lengthOfService" value={guarantorData.lengthOfService} onChange={e => handleInputChange('lengthOfService', e.target.value)} placeholder="e.g., 2 years 3 months" className="form-control" />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" value={guarantorData.notes} onChange={e => handleInputChange('notes', e.target.value)} placeholder="Enter any additional notes about the guarantor" rows={3} className="form-control h-12 " />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid || saving} className="bg-orange-500 hover:bg-orange-600">
            {saving ? 'Saving...' : 'Save Guarantor'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};
export default GuarantorForm;