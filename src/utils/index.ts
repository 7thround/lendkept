import { EmailTemplatesInterface } from '../emails';
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const formatDateWithTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  if (isToday) {
    return `Today at ${formattedHours}:${minutes} ${ampm}`;
  }
  if (isYesterday) {
    return `Yesterday at ${formattedHours}:${minutes} ${ampm}`;
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`;
};

interface SendEmailProps {
  to: string | string[],
  subject: string,
  template: keyof EmailTemplatesInterface,
  payload: { [key: string]: any }
}

export const sendEmail = async ({ to, subject, template, payload }: SendEmailProps) => {
  const response = await fetch("/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, subject, template, payload }),
  });

  if (!response.ok) {
    console.error(`Failed to send email to: ${to}`, await response.json());
    return;
  }

  console.log("Email sent successfully:", await response.json());
};

export const resizeImage = (file, maxWidth, maxHeight, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      callback(canvas.toDataURL("image/jpeg").split(",")[1]); // Get base64 string
    };
    if (typeof e.target?.result === "string") {
      img.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
};