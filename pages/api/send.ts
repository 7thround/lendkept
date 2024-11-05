import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { EmailTemplates } from '../../src/emails';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'LendKEPT <contact@lendkept.com>';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { to, subject, template, payload } = req.body;

  if (!to || !subject || !template) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log("Sending Email", { to, subject, template, payload });

    await resend.emails.send({
      from: FROM,
      to,
      subject,
      react: EmailTemplates[template]({ payload }),
    });

    console.log('Successfully sent email to:', to);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending email to: ", to, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
