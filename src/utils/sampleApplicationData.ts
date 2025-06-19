
export const generateSampleApplicationData = (testEmail: string) => {
  return {
    applicants: [{
      id: "test-applicant-1",
      firstName: "John",
      lastName: "Doe", 
      email: testEmail,
      phone: "07123456789",
      dateOfBirth: "1990-01-01",
      employment: "Full-time Employment",
      companyName: "Test Company Ltd",
      jobTitle: "Software Developer",
      annualIncome: "50000",
      lengthOfService: "2 years",
      currentAddress: "123 Test Street",
      currentPostcode: "SW1A 1AA",
      timeAtAddress: "2 years",
      landlordName: "Test Landlord",
      landlordPhone: "07987654321",
      rentUpToDate: "yes",
      noticePeriod: "1 month",
      currentPropertyStatus: "Renting",
      currentRentalAmount: "1200",
      previousAddress: "456 Previous Road",
      previousPostcode: "SW1A 2BB",
      moveInDate: "2022-01-01",
      vacateDate: "2024-01-01",
      previousLandlordName: "Previous Landlord",
      previousLandlordPhone: "07111222333"
    }],
    propertyPreferences: {
      propertyType: "apartment",
      streetAddress: "789 Demo Property Lane, London",
      postcode: "SW1A 3CC",
      maxRent: "1500",
      preferredLocation: "Central London",
      moveInDate: "2024-02-01",
      latestMoveInDate: "2024-02-15",
      initialTenancyTerm: "12 months",
      additionalRequests: "Test additional requests"
    },
    additionalDetails: {
      pets: false,
      under18Count: "0",
      additionalRequests: "Test additional requests",
      depositType: "Traditional Deposit",
      ukPassport: "yes",
      adverseCredit: "no",
      guarantorRequired: "no",
      moveInDate: "2024-02-01",
      tenancyLength: "12",
      petDetails: "",
      smoking: "no",
      previousEvictions: "no",
      bankruptcy: "no",
      ccj: "no"
    },
    dataSharing: {
      utilities: true,
      insurance: false
    },
    signature: "Test Digital Signature",
    submittedAt: new Date().toISOString(),
    applicationId: "TEST-" + Date.now()
  };
};
