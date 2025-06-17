
export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ukPassport?: string;
  adverseCredit?: string;
  adverseCreditDetails?: string;
  guarantorRequired?: string;
  guarantorAdded?: boolean;
  guarantorName?: string;
  guarantorRelationship?: string;
  guarantorEmail?: string;
  guarantorPhone?: string;
  guarantorDateOfBirth?: string;
  guarantorAddress?: string;
  guarantorPostcode?: string;
  guarantorEmployment?: string;
  guarantorCompanyName?: string;
  guarantorJobTitle?: string;
  guarantorIncome?: string;
  guarantorLengthOfService?: string;
  
  // Employment Information
  employment?: string;
  employmentStatus?: string;
  companyName?: string;
  jobTitle?: string;
  annualIncome?: string;
  lengthOfService?: string;
  employmentStartDate?: string;
  contractType?: string;
  employer?: string;
  probationPeriod?: string;
  probationEndDate?: string;
  
  // Current Address Information
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
  
  // Previous Address Information
  previousAddress?: string;
  previousPostcode?: string;
  previousLandlordName?: string;
  previousLandlordPhone?: string;
  currentPropertyStatus?: string;
  moveInDate?: string;
  vacateDate?: string;
  currentRentalAmount?: string;
  reference1Name?: string;
  reference1Contact?: string;
  pets?: string;
  petDetails?: string;
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
  
  // Legacy fields for compatibility
  address?: string;
  bedrooms?: string;
  tenancyLength?: string;
  
  // Current Address
  currentAddress?: string;
  currentPostcode?: string;
  currentLandlordName?: string;
  currentLandlordPhone?: string;
  currentLandlordEmail?: string;
  currentTenancyStartDate?: string;
  reasonForLeaving?: string;
  
  // Previous Address (if current tenancy < 3 years)
  previousAddress?: string;
  previousPostcode?: string;
  previousLandlordName?: string;
  previousLandlordPhone?: string;
  previousLandlordEmail?: string;
  previousTenancyStartDate?: string;
  previousTenancyEndDate?: string;
  previousReasonForLeaving?: string;
}

export interface AdditionalDetails {
  // Core fields
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
  
  // Additional fields used in validation and forms
  hasPets?: boolean;
  petDetailsArray?: {
    petType: string;
    petBreed: string;
    petAge: string;
    petWeight: string;
    petNeutered: string;
    petVaccinated: string;
    petDescription: string;
  }[];
  smokingPolicy?: string;
  additionalOccupants?: string;
  specialRequests?: string;
  ukPassport?: string;
  adverseCredit?: string;
  adverseCreditDetails?: string;
  guarantorRequired?: string;
  under18Count?: string;
  childrenAges?: string;
  depositType?: string;
}

export interface Application {
  applicants: Applicant[];
  propertyPreferences: PropertyPreferences;
  additionalDetails: AdditionalDetails;
  dataSharing: { utilities: boolean; insurance: boolean };
  signature: string;
  submittedAt?: string;
}
