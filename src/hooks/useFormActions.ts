
import { useCallback } from "react";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";

interface UseFormActionsProps {
  applicants: Applicant[];
  setApplicants: (applicants: Applicant[]) => void;
  setPropertyPreferences: (update: (prev: PropertyPreferences) => PropertyPreferences) => void;
  setAdditionalDetails: (update: (prev: any) => any) => void;
  setDataSharing: (update: (prev: any) => any) => void;
  setSelectedApplicantForGuarantor: (applicant: Applicant | null) => void;
  setGuarantorFormOpen: (open: boolean) => void;
  selectedApplicantForGuarantor: Applicant | null;
}

export const useFormActions = ({
  applicants,
  setApplicants,
  setPropertyPreferences,
  setAdditionalDetails,
  setDataSharing,
  setSelectedApplicantForGuarantor,
  setGuarantorFormOpen,
  selectedApplicantForGuarantor
}: UseFormActionsProps) => {
  
  const createEmptyApplicant = (id: string): Applicant => ({
    id,
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
    previousLandlordPhone: "",
    // Guarantor fields
    guarantorAdded: false,
    guarantorName: "",
    guarantorLastName: "",
    guarantorRelationship: "",
    guarantorEmail: "",
    guarantorPhone: "",
    guarantorDateOfBirth: "",
    guarantorAddress: "",
    guarantorPostcode: "",
    guarantorEmploymentStatus: "",
    guarantorCompanyName: "",
    guarantorJobTitle: "",
    guarantorIncome: "",
    guarantorLengthOfService: ""
  });

  const addApplicant = useCallback(() => {
    if (applicants.length < 5) {
      const newApplicant = createEmptyApplicant(Date.now().toString());
      setApplicants([...applicants, newApplicant]);
    }
  }, [applicants, setApplicants]);

  const removeApplicant = useCallback((id: string) => {
    if (applicants.length > 1) {
      setApplicants(applicants.filter(applicant => applicant.id !== id));
    }
  }, [applicants, setApplicants]);

  const handleApplicantCountChange = useCallback((count: number) => {
    const currentCount = applicants.length;
    
    if (count > currentCount) {
      const newApplicants = [...applicants];
      for (let i = currentCount; i < count; i++) {
        newApplicants.push(createEmptyApplicant(Date.now().toString() + i));
      }
      setApplicants(newApplicants);
    } else if (count < currentCount) {
      setApplicants(applicants.slice(0, count));
    }
  }, [applicants, setApplicants]);

  const updateApplicant = useCallback((id: string, field: keyof Applicant, value: string) => {
    setApplicants(applicants.map(applicant => 
      applicant.id === id ? { ...applicant, [field]: value } : applicant
    ));
  }, [applicants, setApplicants]);

  const updatePropertyPreferences = useCallback((field: keyof PropertyPreferences, value: string) => {
    setPropertyPreferences(prev => ({ ...prev, [field]: value }));
  }, [setPropertyPreferences]);

  const updateAdditionalDetails = useCallback((field: string, value: string | boolean) => {
    setAdditionalDetails(prev => ({ ...prev, [field]: value }));
  }, [setAdditionalDetails]);

  const updateDataSharing = useCallback((field: 'utilities' | 'insurance', value: boolean) => {
    setDataSharing(prev => ({ ...prev, [field]: value }));
  }, [setDataSharing]);

  const handleGuarantorOpen = useCallback((applicant: Applicant) => {
    setSelectedApplicantForGuarantor(applicant);
    setGuarantorFormOpen(true);
  }, [setSelectedApplicantForGuarantor, setGuarantorFormOpen]);

  const handleGuarantorSave = useCallback((guarantorData?: any) => {
    if (guarantorData && selectedApplicantForGuarantor) {
      // Update the applicant with guarantor information
      const updatedApplicants = applicants.map(applicant => 
        applicant.id === selectedApplicantForGuarantor.id 
          ? { 
              ...applicant, 
              guarantorAdded: true,
              guarantorName: guarantorData.guarantorName,
              guarantorLastName: guarantorData.guarantorLastName,
              guarantorEmail: guarantorData.guarantorEmail,
              guarantorPhone: guarantorData.guarantorPhone,
              guarantorDateOfBirth: guarantorData.guarantorDateOfBirth,
              guarantorAddress: guarantorData.guarantorAddress,
              guarantorPostcode: guarantorData.guarantorPostcode,
              guarantorEmploymentStatus: guarantorData.guarantorEmploymentStatus,
              guarantorCompanyName: guarantorData.guarantorCompanyName,
              guarantorJobTitle: guarantorData.guarantorJobTitle,
              guarantorIncome: guarantorData.guarantorIncome,
              guarantorLengthOfService: guarantorData.guarantorLengthOfService
            }
          : applicant
      );
      setApplicants(updatedApplicants);
    }
    setGuarantorFormOpen(false);
    setSelectedApplicantForGuarantor(null);
  }, [applicants, setApplicants, setGuarantorFormOpen, setSelectedApplicantForGuarantor, selectedApplicantForGuarantor]);

  return {
    addApplicant,
    removeApplicant,
    handleApplicantCountChange,
    updateApplicant,
    updatePropertyPreferences,
    updateAdditionalDetails,
    updateDataSharing,
    handleGuarantorOpen,
    handleGuarantorSave
  };
};
