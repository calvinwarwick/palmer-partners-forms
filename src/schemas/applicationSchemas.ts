
import { z } from "zod";

// Property Preferences Schema (Step 1)
export const PropertyPreferencesSchema = z.object({
  propertyType: z.string().optional(),
  streetAddress: z.string().min(1, "Address is required"),
  postcode: z.string().min(1, "Postcode is required"),
  maxRent: z.string().min(1, "Rental amount is required"),
  preferredLocation: z.string().optional(),
  moveInDate: z.string().min(1, "Preferred move-in date is required"),
  latestMoveInDate: z.string().optional(),
  initialTenancyTerm: z.string().min(1, "Initial tenancy term is required"),
  additionalRequests: z.string().optional()
});

// Personal Info Schema (Step 2)
export const PersonalInfoSchema = z.object({
  applicants: z.array(z.object({
    id: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    adverseCreditDetails: z.string().optional(),
    // Employment fields
    employmentStatus: z.string().optional(),
    employer: z.string().optional(),
    companyName: z.string().optional(),
    jobTitle: z.string().optional(),
    annualIncome: z.string().optional(),
    lengthOfService: z.string().optional(),
    employmentStartDate: z.string().optional(),
    contractType: z.string().optional(),
    probationPeriod: z.string().optional(),
    probationEndDate: z.string().optional(),
    // Current address fields
    currentAddress: z.string().optional(),
    currentPostcode: z.string().optional(),
    residencyStatus: z.string().optional(),
    timeAtAddress: z.string().optional(),
    landlordName: z.string().optional(),
    landlordPhone: z.string().optional(),
    rentUpToDate: z.string().optional(),
    rentArrearsDetails: z.string().optional(),
    noticePeriod: z.string().optional(),
    noticePeriodLength: z.string().optional(),
    previousLandlordName: z.string().optional(),
    previousLandlordPhone: z.string().optional(),
    moveInDate: z.string().optional(),
    vacateDate: z.string().optional(),
    // Legacy fields
    employment: z.string().optional(),
    previousAddress: z.string().optional(),
    previousPostcode: z.string().optional(),
    currentPropertyStatus: z.string().optional(),
    currentRentalAmount: z.string().optional(),
    reference1Name: z.string().optional(),
    reference1Contact: z.string().optional(),
    pets: z.string().optional(),
    petDetails: z.string().optional()
  })).min(1, "At least one applicant is required")
});

// Employment Schema (Step 3)
export const EmploymentSchema = z.object({
  applicants: z.array(z.object({
    id: z.string(),
    employmentStatus: z.string().min(1, "Employment status is required"),
    companyName: z.string().optional(),
    jobTitle: z.string().optional(),
    annualIncome: z.string().optional(),
    lengthOfService: z.string().optional()
  }))
});

// Current Address Schema (Step 4)
export const CurrentAddressSchema = z.object({
  applicants: z.array(z.object({
    id: z.string(),
    currentAddress: z.string().min(1, "Current address is required"),
    currentPostcode: z.string().min(1, "Postcode is required"),
    residencyStatus: z.string().min(1, "Residency status is required"),
    timeAtAddress: z.string().optional(),
    moveInDate: z.string().min(1, "Move in date is required"),
    vacateDate: z.string().min(1, "Vacate date is required")
  }))
});

// Additional Details Schema (Step 5)
export const AdditionalDetailsSchema = z.object({
  children: z.boolean(),
  childrenCount: z.string().optional(),
  childrenDetails: z.string().optional(),
  pets: z.boolean(),
  petDetails: z.string().optional(),
  smoking: z.boolean().optional(),
  parking: z.boolean().optional(),
  additionalRequests: z.string().optional(),
  householdIncome: z.string().optional(),
  moveInDate: z.string().optional(),
  tenancyLength: z.string().optional()
}).refine((data) => {
  if (data.children && data.childrenCount !== "None" && !data.childrenDetails?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Children details are required when children are present",
  path: ["childrenDetails"]
}).refine((data) => {
  if (data.pets && !data.petDetails?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Pet details are required when pets are present",
  path: ["petDetails"]
});

// Terms and Data Schema (Step 6)
export const TermsAndDataSchema = z.object({
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  signature: z.string().min(1, "Signature is required"),
  fullName: z.string().optional(),
  dataSharing: z.object({
    utilities: z.boolean(),
    insurance: z.boolean()
  })
});

// Combined Application Schema
export const ApplicationSchema = z.object({
  propertyPreferences: PropertyPreferencesSchema,
  personalInfo: PersonalInfoSchema,
  employment: EmploymentSchema,
  currentAddress: CurrentAddressSchema,
  additionalDetails: AdditionalDetailsSchema,
  termsAndData: TermsAndDataSchema
});

export type ApplicationFormData = z.infer<typeof ApplicationSchema>;
