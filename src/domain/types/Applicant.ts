

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
  // Employment fields
  employmentStatus?: string;
  employer?: string;
  employmentStartDate?: string;
  contractType?: string;
  probationPeriod?: string;
  probationEndDate?: string;
  // Current address fields
  currentAddress?: string;
  currentPostcode?: string;
  residencyStatus?: string;
  timeAtAddress?: string;
  landlordName?: string;
  landlordPhone?: string;
  rentUpToDate?: string;
  rentArrearsDetails?: string;
  noticePeriod?: string;
  noticePeriodLength?: string;
  previousLandlordName?: string;
  previousLandlordPhone?: string;
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
  moveInDate: string;
  tenancyLength: string;
  pets: boolean;
  petDetails: string;
  smoking: boolean;
  parking: boolean;
  children: boolean;
  childrenDetails: string;
  additionalRequests: string;
  householdIncome: string;
  ukPassport?: string;
  adverseCredit?: string;
  adverseCreditDetails?: string;
  guarantorRequired?: string;
  under18Count?: string;
  childrenAges?: string;
  conditionsOfOffer?: string;
  depositType?: string;
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

