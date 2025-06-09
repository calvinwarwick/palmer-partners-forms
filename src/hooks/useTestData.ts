
import { useCallback } from "react";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";

interface UseTestDataProps {
  currentStep: number;
  setPropertyPreferences: (preferences: PropertyPreferences) => void;
  setApplicants: (applicants: Applicant[]) => void;
  setAdditionalDetails: (details: any) => void;
  setSignature: (signature: string) => void;
  setFullName: (name: string) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setDataSharing: (sharing: any) => void;
}

export const useTestData = ({
  currentStep,
  setPropertyPreferences,
  setApplicants,
  setAdditionalDetails,
  setSignature,
  setFullName,
  setTermsAccepted,
  setDataSharing
}: UseTestDataProps) => {

  const fillAllTestData = useCallback(() => {
    // Fill property preferences with proper select values
    setPropertyPreferences({
      propertyType: "house",
      streetAddress: "123 Test Street",
      postcode: "AB12 3CD",
      maxRent: "1500",
      preferredLocation: "City Center",
      moveInDate: "2024-07-01",
      latestMoveInDate: "2024-07-15",
      initialTenancyTerm: "1 year",
      additionalRequests: "No smoking policy preferred"
    });

    // Fill first applicant data with proper select values
    setApplicants(prev => prev.map((applicant, index) => {
      if (index === 0) {
        return {
          ...applicant,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "07123456789",
          dateOfBirth: "1990-01-01",
          employment: "Full-time",
          employmentStatus: "full-time",
          companyName: "Tech Corp Ltd",
          jobTitle: "Software Developer",
          annualIncome: "45000",
          lengthOfService: "2-years",
          currentAddress: "456 Current Road",
          currentPostcode: "EF34 5GH",
          residencyStatus: "tenant",
          timeAtAddress: "2-years",
          landlordName: "Current Landlord",
          landlordPhone: "07987654321",
          moveInDate: "2024-07-01",
          vacateDate: "2024-06-30",
          currentPropertyStatus: "renting",
          currentRentalAmount: "1200",
          rentUpToDate: "yes",
          noticePeriod: "yes",
          noticePeriodLength: "1-month"
        };
      }
      return applicant;
    }));

    // Fill additional details
    setAdditionalDetails({
      moveInDate: "2024-07-01",
      tenancyLength: "1 year",
      pets: false,
      petDetails: "",
      smoking: false,
      parking: true,
      children: false,
      childrenDetails: "",
      additionalRequests: "",
      householdIncome: "45000",
      childrenCount: "None"
    });

    // Fill signature and terms
    setSignature("John Doe");
    setFullName("John Doe");
    setTermsAccepted(true);
  }, [setPropertyPreferences, setApplicants, setAdditionalDetails, setSignature, setFullName, setTermsAccepted]);

  const fillStepData = useCallback(() => {
    switch (currentStep) {
      case 1: // Property Details
        setPropertyPreferences({
          propertyType: "house",
          streetAddress: "123 Test Street",
          postcode: "AB12 3CD",
          maxRent: "1500",
          preferredLocation: "City Center",
          moveInDate: "2024-07-01",
          latestMoveInDate: "2024-07-15",
          initialTenancyTerm: "1 year",
          additionalRequests: "No smoking policy preferred"
        });
        break;
      case 2: // Personal Info
        setApplicants(prev => prev.map((applicant, index) => {
          if (index === 0) {
            return {
              ...applicant,
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              phone: "07123456789",
              dateOfBirth: "1990-01-01"
            };
          }
          return applicant;
        }));
        break;
      case 3: // Employment
        setApplicants(prev => prev.map((applicant, index) => {
          if (index === 0) {
            return {
              ...applicant,
              employmentStatus: "full-time",
              companyName: "Tech Corp Ltd",
              jobTitle: "Software Developer",
              annualIncome: "45000",
              lengthOfService: "2-years",
              contractType: "permanent",
              employmentStartDate: "2022-01-01"
            };
          }
          return applicant;
        }));
        break;
      case 4: // Current Address
        setApplicants(prev => prev.map((applicant, index) => {
          if (index === 0) {
            return {
              ...applicant,
              currentAddress: "456 Current Road",
              currentPostcode: "EF34 5GH",
              residencyStatus: "tenant",
              timeAtAddress: "2-years",
              landlordName: "Current Landlord",
              landlordPhone: "07987654321",
              rentUpToDate: "yes",
              noticePeriod: "yes",
              noticePeriodLength: "1-month"
            };
          }
          return applicant;
        }));
        break;
      case 5: // Additional Details
        setAdditionalDetails({
          moveInDate: "2024-07-01",
          tenancyLength: "1 year",
          pets: false,
          petDetails: "",
          smoking: false,
          parking: true,
          children: false,
          childrenDetails: "",
          additionalRequests: "",
          householdIncome: "45000",
          childrenCount: "None"
        });
        break;
      case 6: // Terms and Data
        setSignature("John Doe");
        setFullName("John Doe");
        setTermsAccepted(true);
        setDataSharing({
          utilities: false,
          insurance: true
        });
        break;
    }
  }, [currentStep, setPropertyPreferences, setApplicants, setAdditionalDetails, setSignature, setFullName, setTermsAccepted, setDataSharing]);

  return {
    fillAllTestData,
    fillStepData
  };
};
