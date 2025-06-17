
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Applicant } from "@/domain/types/Applicant";

interface GuarantorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guarantorData: Partial<Applicant>) => void;
  applicant: Applicant;
}

const GuarantorForm = ({ isOpen, onClose, onSave, applicant }: GuarantorFormProps) => {
  const [formData, setFormData] = useState({
    guarantorName: applicant.guarantorName || "",
    guarantorLastName: applicant.guarantorLastName || "",
    guarantorDateOfBirth: applicant.guarantorDateOfBirth || "",
    guarantorEmail: applicant.guarantorEmail || "",
    guarantorPhone: applicant.guarantorPhone || "",
    guarantorEmploymentStatus: applicant.guarantorEmploymentStatus || "",
    guarantorCompanyName: applicant.guarantorCompanyName || "",
    guarantorJobTitle: applicant.guarantorJobTitle || "",
    guarantorIncome: applicant.guarantorIncome || "",
    guarantorLengthOfService: applicant.guarantorLengthOfService || "",
    guarantorAddress: applicant.guarantorAddress || "",
    guarantorPostcode: applicant.guarantorPostcode || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for required fields
    if (!formData.guarantorName || !formData.guarantorLastName || !formData.guarantorDateOfBirth || 
        !formData.guarantorEmail || !formData.guarantorEmploymentStatus || !formData.guarantorAddress || 
        !formData.guarantorPostcode) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    onSave({
      guarantorAdded: true,
      guarantorName: formData.guarantorName,
      guarantorLastName: formData.guarantorLastName,
      guarantorDateOfBirth: formData.guarantorDateOfBirth,
      guarantorEmail: formData.guarantorEmail,
      guarantorPhone: formData.guarantorPhone,
      guarantorEmploymentStatus: formData.guarantorEmploymentStatus,
      guarantorCompanyName: formData.guarantorCompanyName,
      guarantorJobTitle: formData.guarantorJobTitle,
      guarantorIncome: formData.guarantorIncome,
      guarantorLengthOfService: formData.guarantorLengthOfService,
      guarantorAddress: formData.guarantorAddress,
      guarantorPostcode: formData.guarantorPostcode,
    });
    onClose();
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (value: string) => {
    // Convert DD/MM/YYYY to YYYY-MM-DD for storage
    const parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, guarantorDateOfBirth: isoDate }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto font-lexend">
        <DialogHeader>
          <DialogTitle>Add Guarantor Details</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-grey">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guarantorName">First Name *</Label>
                <Input
                  id="guarantorName"
                  value={formData.guarantorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, guarantorName: e.target.value }))}
                  placeholder="Enter first name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="guarantorLastName">Last Name *</Label>
                <Input
                  id="guarantorLastName"
                  value={formData.guarantorLastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, guarantorLastName: e.target.value }))}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guarantorDateOfBirth">Date of Birth *</Label>
              <Input
                id="guarantorDateOfBirth"
                value={formatDateForDisplay(formData.guarantorDateOfBirth)}
                onChange={(e) => handleDateChange(e.target.value)}
                placeholder="DD/MM/YYYY"
                required
              />
            </div>

            <div>
              <Label htmlFor="guarantorEmail">Email Address *</Label>
              <Input
                id="guarantorEmail"
                type="email"
                value={formData.guarantorEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, guarantorEmail: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <Label htmlFor="guarantorPhone">Mobile Number</Label>
              <Input
                id="guarantorPhone"
                type="tel"
                value={formData.guarantorPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, guarantorPhone: e.target.value }))}
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-grey">Guarantor Employment Details</h3>
            
            <div>
              <Label htmlFor="guarantorEmploymentStatus">Employment Status *</Label>
              <Select
                value={formData.guarantorEmploymentStatus}
                onValueChange={(value) => setFormData(prev => ({ ...prev, guarantorEmploymentStatus: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent-full-time">Permanent Full-time</SelectItem>
                  <SelectItem value="permanent-part-time">Permanent Part-time</SelectItem>
                  <SelectItem value="fixed-term-contract">Fixed-term Contract</SelectItem>
                  <SelectItem value="temporary-contract">Temporary Contract</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="guarantorCompanyName">Company Name</Label>
              <Input
                id="guarantorCompanyName"
                value={formData.guarantorCompanyName}
                onChange={(e) => setFormData(prev => ({ ...prev, guarantorCompanyName: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <Label htmlFor="guarantorJobTitle">Job Title</Label>
              <Input
                id="guarantorJobTitle"
                value={formData.guarantorJobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, guarantorJobTitle: e.target.value }))}
                placeholder="Enter job title"
              />
            </div>

            <div>
              <Label htmlFor="guarantorIncome">Annual Salary</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="guarantorIncome"
                  type="number"
                  value={formData.guarantorIncome}
                  onChange={(e) => setFormData(prev => ({ ...prev, guarantorIncome: e.target.value }))}
                  placeholder="0"
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guarantorLengthOfService">Length of Service</Label>
              <Select
                value={formData.guarantorLengthOfService}
                onValueChange={(value) => setFormData(prev => ({ ...prev, guarantorLengthOfService: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                  <SelectItem value="6-months-to-1-year">6 months to 1 year</SelectItem>
                  <SelectItem value="1-2-years">1-2 years</SelectItem>
                  <SelectItem value="2-5-years">2-5 years</SelectItem>
                  <SelectItem value="5-10-years">5-10 years</SelectItem>
                  <SelectItem value="more-than-10-years">More than 10 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-grey">Guarantor Address</h3>
            
            <div>
              <Label htmlFor="guarantorAddress">Street Address *</Label>
              <Input
                id="guarantorAddress"
                value={formData.guarantorAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, guarantorAddress: e.target.value }))}
                placeholder="Enter street address"
                required
              />
            </div>

            <div>
              <Label htmlFor="guarantorPostcode">Postcode *</Label>
              <Input
                id="guarantorPostcode"
                value={formData.guarantorPostcode}
                onChange={(e) => setFormData(prev => ({ ...prev, guarantorPostcode: e.target.value }))}
                placeholder="Enter postcode"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-orange hover:bg-primary-orange/90">
              Save Guarantor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuarantorForm;
