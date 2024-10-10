// src/pages/api/loans/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getLoans(req, res);
    case "POST":
      return createLoan(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getLoans(req: NextApiRequest, res: NextApiResponse) {
  const loans = await prisma.loan.findMany();
  res.status(200).json(loans);
}

async function createLoan(req: NextApiRequest, res: NextApiResponse) {
  const { address, details, phone, status, partnerId, companyId } = req.body;
  const newLoan = await prisma.loan.create({
    // @ts-ignore
    data: { address, details, phone, status, partnerId, companyId },
  });
  res.status(201).json(newLoan);
}
