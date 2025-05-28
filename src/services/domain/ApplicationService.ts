
import { Applicant, PropertyPreferences } from '@/domain/types/Applicant';
import { sendEmail } from '../api/emailApi';

export const formatApplicationForEmail = (
  applicants: Applicant[],
  propertyPreferences: PropertyPreferences,
  signature: string
): string => {
  const applicantsList = applicants.map((applicant, index) => `
    <h3>Applicant ${index + 1}:</h3>
    <p><strong>Name:</strong> ${applicant.firstName} ${applicant.lastName}</p>
    <p><strong>Email:</strong> ${applicant.email}</p>
    <p><strong>Phone:</strong> ${applicant.phone}</p>
    <p><strong>Date of Birth:</strong> ${applicant.dateOfBirth}</p>
    <p><strong>Employment:</strong> ${applicant.employment}</p>
    <p><strong>Annual Income:</strong> £${applicant.annualIncome}</p>
    <p><strong>Previous Address:</strong> ${applicant.previousAddress}</p>
    <p><strong>Reference:</strong> ${applicant.reference1Name} (${applicant.reference1Contact})</p>
  `).join('<br>');

  return `
    <h1>New Tenancy Application</h1>
    <h2>Applicant Information:</h2>
    ${applicantsList}
    
    <h2>Property Preferences:</h2>
    <p><strong>Property Type:</strong> ${propertyPreferences.propertyType}</p>
    <p><strong>Maximum Rent:</strong> £${propertyPreferences.maxRent}/month</p>
    <p><strong>Preferred Location:</strong> ${propertyPreferences.preferredLocation}</p>
    <p><strong>Move-in Date:</strong> ${propertyPreferences.moveInDate}</p>
    <p><strong>Additional Requests:</strong> ${propertyPreferences.additionalRequests}</p>
    
    <h2>Digital Signature:</h2>
    <p>${signature}</p>
    
    <p><em>Application submitted on ${new Date().toLocaleString()}</em></p>
  `;
};

export const sendApplicationConfirmation = async (
  applicants: Applicant[],
  propertyPreferences: PropertyPreferences,
  signature: string
): Promise<boolean> => {
  const primaryApplicant = applicants[0];
  const html = `
    <h1>Thank you for your tenancy application!</h1>
    <p>Dear ${primaryApplicant.firstName} ${primaryApplicant.lastName},</p>
    <p>We have received your tenancy application and will review it within 2-3 business days.</p>
    <p>We will contact you at ${primaryApplicant.email} or ${primaryApplicant.phone} with an update soon.</p>
    <p>Best regards,<br>Palmer & Partners</p>
  `;

  return sendEmail({
    to: primaryApplicant.email,
    subject: "Tenancy Application Confirmation - Palmer & Partners",
    html
  });
};

export const sendAdminNotification = async (
  applicants: Applicant[],
  propertyPreferences: PropertyPreferences,
  signature: string
): Promise<boolean> => {
  const html = formatApplicationForEmail(applicants, propertyPreferences, signature);

  return sendEmail({
    to: "admin@palmerpartners.com",
    subject: `New Tenancy Application - ${applicants[0].firstName} ${applicants[0].lastName}`,
    html
  });
};
