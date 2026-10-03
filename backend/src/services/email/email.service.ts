
import env from "../../config/env";
import { sendEmail } from "./email-provider";

export interface ConsultationEmailData {
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  message?: string;
}

export async function sendConsultationNotification(
  consultation: ConsultationEmailData
): Promise<void> {
  if (!env.business.email) {
    throw new Error("BUSINESS_EMAIL is not configured");
  }

  const subject = `New Consultation Request - ${consultation.name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2>New Consultation Request</h2>

      <p>A new consultation request has been submitted through your website.</p>

      <h3>Customer Details</h3>

      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
            Name
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${escapeHtml(consultation.name)}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
            Email
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${escapeHtml(consultation.email)}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
            Phone
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${escapeHtml(consultation.phone)}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
            Consultation Type
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${escapeHtml(consultation.consultationType)}
          </td>
        </tr>

        ${
          consultation.preferredDate
            ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                  Preferred Date
                </td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${escapeHtml(consultation.preferredDate)}
                </td>
              </tr>
            `
            : ""
        }

        ${
          consultation.preferredTime
            ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                  Preferred Time
                </td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${escapeHtml(consultation.preferredTime)}
                </td>
              </tr>
            `
            : ""
        }

        ${
          consultation.location
            ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                  Location
                </td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${escapeHtml(consultation.location)}
                </td>
              </tr>
            `
            : ""
        }
      </table>

      ${
        consultation.message
          ? `
            <h3>Project Message</h3>
            <p style="white-space: pre-wrap;">
              ${escapeHtml(consultation.message)}
            </p>
          `
          : ""
      }

      <p style="margin-top: 24px;">
        You can reply directly to this email to contact the customer.
      </p>
    </div>
  `;

  await sendEmail({
    to: env.business.email,
    subject,
    html,
    replyTo: consultation.email,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

