
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
  pets: string;
  petDetails: string;
  ukPassport?: string;
  adverseCredit?: string;
  adverseCreditDetails?: string;
  guarantorRequired?: string;
}

export interface PropertyPreferences {
  propertyType: string;
  bedrooms: string;
  streetAddress: string;
  postcode: string;
  maxRent: string;
  preferredLocation: string;
  preferredArea: string;
  moveInDate: string;
  latestMoveInDate: string;
  initialTenancyTerm: string;
  additionalRequests: string;
  additionalRequirements: string;
}

export interface AdditionalDetails {
  ukPassport: string;
  adverseCredit: string;
  adverseCreditDetails: string;
  guarantorRequired: string;
  pets: string;
  petDetails: string;
  under18Count: string;
  childrenAges: string;
  conditionsOfOffer: string;
  depositType: string;
  guarantorDetails?: string;
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
