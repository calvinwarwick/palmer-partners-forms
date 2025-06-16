
import { UseFormReturn } from "react-hook-form";
import { ApplicationFormData } from "@/schemas/applicationSchemas";

export const useRHFTestData = (form: UseFormReturn<ApplicationFormData>, currentStep: number) => {
  const fillAllTestData = () => {
    form.setValue("propertyPreferences", {
      propertyType: "apartment",
      streetAddress: "123 Test Street",
      postcode: "SW1A 1AA",
      maxRent: "2500",
      preferredLocation: "Central London",
      moveInDate: "2024-01-01",
      latestMoveInDate: "2024-02-01",
      initialTenancyTerm: "1 year",
      additionalRequests: "Near transport links"
    });

    form.setValue("personalInfo.applicants.0", {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "07123456789",
      dateOfBirth: "1990-01-01"
    });

    form.setValue("employment.applicants.0", {
      id: "1",
      employmentStatus: "full-time",
      companyName: "Test Company",
      jobTitle: "Software Developer",
      annualIncome: "50000",
      lengthOfService: "2-years"
    });

    form.setValue("currentAddress.applicants.0", {
      id: "1",
      currentAddress: "456 Current Street",
      currentPostcode: "SW1A 2BB",
      residencyStatus: "tenant",
      timeAtAddress: "1-2-years",
      moveInDate: "2022-01-01",
      vacateDate: "2024-01-01"
    });

    form.setValue("additionalDetails", {
      children: false,
      childrenCount: "None",
      childrenDetails: "",
      pets: false,
      petDetails: "",
      smoking: false,
      parking: false,
      additionalRequests: "",
      householdIncome: "50000"
    });

    form.setValue("termsAndData", {
      termsAccepted: true,
      signature: "John Doe",
      fullName: "John Doe",
      dataSharing: {
        utilities: false,
        insurance: true
      }
    });
  };

  const fillStepData = () => {
    switch (currentStep) {
      case 1:
        form.setValue("propertyPreferences", {
          propertyType: "apartment",
          streetAddress: "123 Test Street",
          postcode: "SW1A 1AA",
          maxRent: "2500",
          preferredLocation: "Central London",
          moveInDate: "2024-01-01",
          latestMoveInDate: "2024-02-01",
          initialTenancyTerm: "1 year",
          additionalRequests: "Near transport links"
        });
        break;
      case 2:
        form.setValue("personalInfo.applicants.0", {
          ...form.getValues("personalInfo.applicants.0"),
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "07123456789",
          dateOfBirth: "1990-01-01"
        });
        break;
    }
  };

  return {
    fillAllTestData,
    fillStepData
  };
};
