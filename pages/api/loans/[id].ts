// src/pages/api/loans/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getLoan(req, res, id as string);
    case "PUT":
      return updateLoan(req, res, id as string);
    case "DELETE":
      return deleteLoan(req, res, id as string);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getLoan(req: NextApiRequest, res: NextApiResponse, id: string) {
  const loan = await prisma.loan.findUnique({ where: { id } });
  if (loan) {
    res.status(200).json(loan);
  } else {
    res.status(404).json({ message: "Loan not found" });
  }
}

async function updateLoan(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const { address, details, phone, status, partnerId, companyId } = req.body;
  const updatedLoan = await prisma.loan.update({
    where: { id },
    // @ts-ignore
    data: { address, details, phone, status, partnerId, companyId },
  });
  res.status(200).json(updatedLoan);
}

async function deleteLoan(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  await prisma.loan.delete({ where: { id } });
  res.status(204).end();
}
