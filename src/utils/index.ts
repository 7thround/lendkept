import { EmailTemplatesInterface } from '../emails';
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const formatDateWithTime = (dateString: Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const sendEmail = async (
  to: string | string[],
  subject: string,
  template: keyof EmailTemplatesInterface,
  payload: { [key: string]: any }
) => {
  try {
    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, template, payload }),
    });
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};