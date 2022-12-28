import { SMTP_USERNAME, SMTP_PASSWORD } from '../../utils/secrets'
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
type Data = {
  success: boolean
  message?: string
}

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const mail = req.body;
    if (!mail) {
      return res.status(400).send({ success: false, message: "Bad request" });
    }
    try {
      await transporter.sendMail(mail)

      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: "Transporter failed to send email" });
    }
  }
  return res.status(400).json({ success: false, message: "Bad request" });
}