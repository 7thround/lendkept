import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from 'resend';
import prisma from "../../../lib/prisma";
import { EmailTemplates } from "../../../src/emails";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM = 'LendKEPT <contact@lendkept.com>';
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  console.log("sending email", user.email);
  try {
    const response = await resend.emails.send({
      from: FROM,
      to: user.email,
      subject: "Reset Password",
      react: EmailTemplates["ResetPassword"]({ payload: { user } }),
    });
    console.log("Email sent successfully:", response);
    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
}
