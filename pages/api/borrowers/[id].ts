import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      return updateBorrower(req, res, id as string);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateBorrower(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      employer,
      position,
      income,
      credit,
    } = req.body;

    const updatedBorrower = await prisma.borrower.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        employer,
        position,
        income,
        credit,
      },
    });

    res.status(200).json(updatedBorrower);
  } catch (error) {
    console.error("Error updating loan:", error);
    res.status(500).json({ error: "Failed to update loan" });
  }
}


async function deleteLoan(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  await prisma.loan.delete({ where: { id: Number(id) } });
  res.status(204).end();
}
