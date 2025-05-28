
export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  employment: string;
  annualIncome: string;
  previousAddress: string;
  reference1Name: string;
  reference1Contact: string;
}

export interface PropertyPreferences {
  propertyType: string;
  maxRent: string;
  preferredLocation: string;
  moveInDate: string;
  additionalRequests: string;
}

export interface Application {
  applicants: Applicant[];
  propertyPreferences: PropertyPreferences;
  signature: string;
}
