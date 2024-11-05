import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { EmailTemplates } from '../../src/emails';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'LendKEPT <contact@lendkept.com>';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { to, subject, template, payload } = req.body;
  console.log("Sending Email", { to, subject, template, payload });

  if (!to || !subject || !template) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const recipients = Array.isArray(to) ? to : [to];

  try {
    console.log("Sending Email", { to, subject, template, payload });
    return res.status(200).json({ success: true, data: { to, subject, template, payload } });
    const results = await Promise.all(recipients.map(async (recipient) => {
      return await resend.emails.send({
        from: FROM,
        to: recipient,
        subject,
        react: EmailTemplates[template]({ payload }),
      });
    }));

    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error(errors);
      return res.status(400).json({ errors });
    }
    res.status(200).json({ success: true, data: results.map(result => result.data) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
