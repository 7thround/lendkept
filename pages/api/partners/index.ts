// src/pages/api/partners/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getPartners(req, res);
    case "POST":
      return createPartner(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getPartners(req: NextApiRequest, res: NextApiResponse) {
  const partners = await prisma.partner.findMany();
  res.status(200).json(partners);
}

async function createPartner(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, phone, companyId, referralCode, address } = req.body;
  const newPartner = await prisma.partner.create({
    data: { name, email, phone, companyId, referralCode, address },
  });
  res.status(201).json(newPartner);
}
