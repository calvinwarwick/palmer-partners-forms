
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
  passportPhoto?: string;
  
  // Employment Information
  employmentStatus?: string;
  companyName?: string;
  jobTitle?: string;
  annualIncome?: string;
  lengthOfService?: string;
  employmentStartDate?: string;
  contractType?: string;
  
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
  previousLandlordName?: string;
  previousLandlordPhone?: string;
}

export interface PropertyPreferences {
  address: string;
  propertyType: string;
  bedrooms: string;
  maxRent: string;
  movingTimeframe: string;
  tenancyLength: string;
  moveInDate: string;
  
  // Current Address
  currentAddress: string;
  currentPostcode: string;
  currentLandlordName: string;
  currentLandlordPhone: string;
  currentLandlordEmail: string;
  currentTenancyStartDate: string;
  reasonForLeaving: string;
  
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
  hasPets: boolean;
  petDetails: {
    petType: string;
    petBreed: string;
    petAge: string;
    petWeight: string;
    petNeutered: string;
    petVaccinated: string;
    petDescription: string;
  }[];
  smokingPolicy: string;
  additionalOccupants: string;
  specialRequests: string;
}
