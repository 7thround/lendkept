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
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    clientName,
    clientPhone,
    clientEmail,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
    loanType,
    loanAmount,
    status,
    partnerId,
    companyId,
    paid = false, // Default value
  } = req.body;

  try {
    const newLoan = await prisma.loan.create({
      data: {
        clientName,
        clientPhone,
        clientEmail,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        zip,
        loanType,
        loanAmount: parseFloat(loanAmount),
        status,
        paid,
        partnerId,
        companyId,
      },
    });

    res.status(201).json(newLoan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
