
import { useState } from "react";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";

export const useFormState = () => {
  const [propertyPreferences, setPropertyPreferences] = useState<PropertyPreferences>({
    propertyType: "",
    streetAddress: "",
    postcode: "",
    maxRent: "",
    preferredLocation: "",
    moveInDate: "",
    latestMoveInDate: "",
    initialTenancyTerm: "",
    additionalRequests: ""
  });

  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      employment: "",
      companyName: "",
      jobTitle: "",
      annualIncome: "",
      lengthOfService: "",
      previousAddress: "",
      previousPostcode: "",
      currentPropertyStatus: "",
      moveInDate: "",
      vacateDate: "",
      currentRentalAmount: "",
      reference1Name: "",
      reference1Contact: "",
      pets: "",
      petDetails: "",
      adverseCreditDetails: "",
      // Employment fields
      employmentStatus: "",
      employer: "",
      employmentStartDate: "",
      contractType: "",
      probationPeriod: "",
      probationEndDate: "",
      // Current address fields
      currentAddress: "",
      currentPostcode: "",
      residencyStatus: "",
      timeAtAddress: "",
      landlordName: "",
      landlordPhone: "",
      rentUpToDate: "",
      rentArrearsDetails: "",
      noticePeriod: "",
      noticePeriodLength: "",
      previousLandlordName: "",
      previousLandlordPhone: ""
    }
  ]);

  const [additionalDetails, setAdditionalDetails] = useState({
    moveInDate: "",
    tenancyLength: "",
    pets: false,
    petDetails: "",
    smoking: false,
    parking: false,
    children: false,
    childrenDetails: "",
    additionalRequests: "",
    householdIncome: "",
    childrenCount: ""
  });

  const [dataSharing, setDataSharing] = useState({
    utilities: true,
    insurance: true
  });

  const [signature, setSignature] = useState("");
  const [fullName, setFullName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [guarantorFormOpen, setGuarantorFormOpen] = useState(false);
  const [selectedApplicantForGuarantor, setSelectedApplicantForGuarantor] = useState<Applicant | null>(null);

  return {
    propertyPreferences,
    setPropertyPreferences,
    applicants,
    setApplicants,
    additionalDetails,
    setAdditionalDetails,
    dataSharing,
    setDataSharing,
    signature,
    setSignature,
    fullName,
    setFullName,
    termsAccepted,
    setTermsAccepted,
    guarantorFormOpen,
    setGuarantorFormOpen,
    selectedApplicantForGuarantor,
    setSelectedApplicantForGuarantor
  };
};
