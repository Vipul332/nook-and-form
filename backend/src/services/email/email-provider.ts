
import { Resend } from "resend";
import env from "../../config/env";

const resend = new Resend(env.email.apiKey);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(
  options: SendEmailOptions
): Promise<void> {
  if (!env.email.apiKey) {
    throw new Error("EMAIL_API_KEY is not configured");
  }

  if (!env.business.email) {
    throw new Error("BUSINESS_EMAIL is not configured");
  }

  const fromEmail = "onboarding@resend.dev";

  const { error } = await resend.emails.send({
    from: `${env.business.name || "Interior Design"} <${fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    ...(options.replyTo
      ? { replyTo: options.replyTo }
      : {}),
  });

  if (error) {
    throw new Error(error.message);
  }
}
