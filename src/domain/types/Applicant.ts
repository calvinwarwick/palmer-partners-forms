
export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  employment: string;
  companyName: string;
  jobTitle: string;
  annualIncome: string;
  lengthOfService: string;
  previousAddress: string;
  previousPostcode: string;
  currentPropertyStatus: string;
  moveInDate: string;
  vacateDate: string;
  currentRentalAmount: string;
  reference1Name: string;
  reference1Contact: string;
}

export interface PropertyPreferences {
  propertyType: string;
  streetAddress: string;
  postcode: string;
  maxRent: string;
  preferredLocation: string;
  moveInDate: string;
  latestMoveInDate: string;
  initialTenancyTerm: string;
  additionalRequests: string;
}

export interface AdditionalDetails {
  ukPassport: string;
  adverseCredit: string;
  adverseCreditDetails: string;
  guarantorRequired: string;
  pets: string;
  under18Count: string;
  childrenAges: string;
  conditionsOfOffer: string;
  depositType: string;
}

export interface Application {
  applicants: Applicant[];
  propertyPreferences: PropertyPreferences;
  additionalDetails: AdditionalDetails;
  dataSharing: {
    utilities: boolean;
    insurance: boolean;
  };
  signature: string;
}
