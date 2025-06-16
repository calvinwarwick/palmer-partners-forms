
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export const sendApplicationConfirmation = async (application: any): Promise<boolean> => {
  try {
    const primaryApplicant = application.applicants[0];
    
    const emailResponse = await resend.emails.send({
      from: "Palmer & Partners <noreply@palmerandpartners.com.au>",
      to: [primaryApplicant.email],
      subject: "Tenancy Application Received - Palmer & Partners",
      html: `
        <div style="font-family: 'Lexend', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #FF6F00; padding: 30px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Application Received</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #212121; margin-bottom: 20px;">Dear ${primaryApplicant.firstName} ${primaryApplicant.lastName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for submitting your tenancy application for <strong>${application.propertyPreferences.streetAddress}</strong>.
            </p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #212121; margin-top: 0;">Application Summary:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>Property: ${application.propertyPreferences.streetAddress}</li>
                <li>Number of Applicants: ${application.applicants.length}</li>
                <li>Preferred Move-in Date: ${application.propertyPreferences.moveInDate}</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We'll review your application and get back to you within <strong style="color: #FF6F00;">2-3 business days</strong>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #FF6F00; color: white; padding: 15px 30px; border-radius: 6px; font-weight: bold;">
                Application Status: Processing
              </div>
            </div>
            
            <p style="color: #888; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>Palmer & Partners Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent:", emailResponse);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
};

export const sendAdminNotification = async (application: any): Promise<boolean> => {
  try {
    const primaryApplicant = application.applicants[0];
    
    const emailResponse = await resend.emails.send({
      from: "Palmer & Partners System <system@palmerandpartners.com.au>",
      to: ["calvinwarwick+admin@gmail.com"],
      subject: `New Tenancy Application - ${application.propertyPreferences.streetAddress}`,
      html: `
        <div style="font-family: 'Lexend', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #212121; padding: 30px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">New Application</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #212121; margin-bottom: 20px;">Application Details</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #212121; margin-top: 0;">Property Information:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li><strong>Address:</strong> ${application.propertyPreferences.streetAddress}</li>
                <li><strong>Postcode:</strong> ${application.propertyPreferences.postcode}</li>
                <li><strong>Max Rent:</strong> $${application.propertyPreferences.maxRent}</li>
                <li><strong>Move-in Date:</strong> ${application.propertyPreferences.moveInDate}</li>
              </ul>
            </div>
            
            <div style="background: #fff5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #212121; margin-top: 0;">Primary Applicant:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li><strong>Name:</strong> ${primaryApplicant.firstName} ${primaryApplicant.lastName}</li>
                <li><strong>Email:</strong> ${primaryApplicant.email}</li>
                <li><strong>Phone:</strong> ${primaryApplicant.phone}</li>
                <li><strong>Employment:</strong> ${primaryApplicant.employmentStatus}</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              <strong>Total Applicants:</strong> ${application.applicants.length}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleString()}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="display: inline-block; background: #FF6F00; color: white; padding: 15px 30px; border-radius: 6px; font-weight: bold; text-decoration: none;">
                Review Application
              </a>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Admin notification sent:", emailResponse);
    return true;
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return false;
  }
};
