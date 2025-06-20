import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SwitchField } from '@/components/ui/switch-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { FormInput } from '@/components/ui/form-input';
import { FormSwitch } from '@/components/ui/form-switch';
import { FormSelect } from '@/components/ui/form-select';
import { FormRadio } from '@/components/ui/form-radio';
import { FormCheckbox } from '@/components/ui/form-checkbox';
import { Label } from '@/components/ui/label';
import { Eye, Smartphone, Monitor, Tablet } from 'lucide-react';

const FormDemo: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bio: '',
    
    // Switches
    newsletter: false,
    notifications: true,
    marketingEmails: false,
    
    // Select
    country: '',
    
    // Radio
    contactMethod: '',
    
    // Checkboxes
    terms: false,
    privacy: false,
    cookies: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [viewportDemo, setViewportDemo] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const countryOptions = [
    { value: 'uk', label: 'United Kingdom' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];

  const contactMethodOptions = [
    { 
      value: 'email', 
      label: 'Email', 
      description: 'We\'ll contact you via email for all communications' 
    },
    { 
      value: 'phone', 
      label: 'Phone', 
      description: 'We\'ll call you during business hours' 
    },
    { 
      value: 'sms', 
      label: 'SMS', 
      description: 'We\'ll send you text messages' 
    },
  ];

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.terms) newErrors.terms = 'You must accept the terms';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  const viewportClasses = {
    mobile: 'max-w-sm mx-auto',
    tablet: 'max-w-2xl mx-auto',
    desktop: 'max-w-4xl mx-auto'
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Components Demo</h1>
          <p className="text-gray-600 mb-6">
            Comprehensive showcase of all form components with mobile-first design
          </p>
          
          {/* Viewport Simulator */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setViewportDemo('mobile')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${viewportDemo === 'mobile' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </button>
            <button
              onClick={() => setViewportDemo('tablet')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${viewportDemo === 'tablet' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Tablet className="h-4 w-4" />
              Tablet
            </button>
            <button
              onClick={() => setViewportDemo('desktop')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${viewportDemo === 'desktop' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </button>
          </div>
        </div>

        {/* Form Demo */}
        <div className={viewportClasses[viewportDemo]}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Interactive Form Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Text Inputs */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Text Inputs</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    required
                    htmlFor="firstName"
                    error={errors.firstName}
                  >
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </FormField>
                  
                  <FormField
                    label="Last Name"
                    htmlFor="lastName"
                  >
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </FormField>
                </div>
                
                <FormField
                  label="Email Address"
                  required
                  htmlFor="email"
                  error={errors.email}
                >
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </FormField>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    id="phone"
                    type="tel"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                    placeholder="Enter your phone number"
                  />
                  
                  <FormInput
                    id="dateOfBirth"
                    type="date"
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(value) => setFormData(prev => ({ ...prev, dateOfBirth: value }))}
                  />
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Textarea</h3>
                
                <FormField
                  label="Biography"
                  htmlFor="bio"
                >
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    maxLength={500}
                  />
                  {formData.bio && (
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {formData.bio.length}/500
                    </div>
                  )}
                </FormField>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Switches</h3>
                
                <SwitchField
                  id="newsletter"
                  label="Subscribe to Newsletter"
                  description="Receive weekly updates about new features and content"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
                />
                
                <FormSwitch
                  id="notifications"
                  label="Enable Push Notifications"
                  description="Get notified about important updates instantly"
                  checked={formData.notifications}
                  onChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked }))}
                />
                
                <FormSwitch
                  id="marketingEmails"
                  label="Marketing Emails"
                  description="Receive promotional offers and marketing content"
                  checked={formData.marketingEmails}
                  onChange={(checked) => setFormData(prev => ({ ...prev, marketingEmails: checked }))}
                />
              </div>

              {/* Select */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Select Dropdown</h3>
                
                <FormSelect
                  id="country"
                  label="Country"
                  required
                  value={formData.country}
                  onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                  options={countryOptions}
                  placeholder="Select your country"
                />
              </div>

              {/* Radio Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Radio Buttons</h3>
                
                <FormRadio
                  id="contactMethod"
                  label="Preferred Contact Method"
                  required
                  value={formData.contactMethod}
                  onChange={(value) => setFormData(prev => ({ ...prev, contactMethod: value }))}
                  options={contactMethodOptions}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Checkboxes</h3>
                
                <FormCheckbox
                  id="terms"
                  label="I accept the Terms and Conditions"
                  description="Please read our terms and conditions before proceeding"
                  required
                  checked={formData.terms}
                  onChange={(checked) => setFormData(prev => ({ ...prev, terms: checked }))}
                  error={errors.terms}
                />
                
                <FormCheckbox
                  id="privacy"
                  label="I accept the Privacy Policy"
                  description="We value your privacy and protect your personal data"
                  checked={formData.privacy}
                  onChange={(checked) => setFormData(prev => ({ ...prev, privacy: checked }))}
                />
                
                <FormCheckbox
                  id="cookies"
                  label="Accept Cookies"
                  description="Allow us to use cookies to improve your experience"
                  checked={formData.cookies}
                  onChange={(checked) => setFormData(prev => ({ ...prev, cookies: checked }))}
                />
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Buttons</h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleSubmit}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Submit Form
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      dateOfBirth: '',
                      bio: '',
                      newsletter: false,
                      notifications: true,
                      marketingEmails: false,
                      country: '',
                      contactMethod: '',
                      terms: false,
                      privacy: false,
                      cookies: false,
                    })}
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    Reset Form
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    Save Draft
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Form State Debug */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Form State (Debug)</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormDemo;
