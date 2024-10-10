// src/pages/api/partners/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { authenticate, authorize } from "../../../src/middleware/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getPartner(req, res, id as string);
    case "PUT":
      return updatePartner(req, res, id as string);
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const getPartner = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) => {
  const partner = await prisma.partner.findUnique({
    where: { id },
    include: { loans: true },
  });

  if (!partner) {
    return res.status(404).json({ message: "Partner not found" });
  }

  // @ts-ignore
  if (req.user.role === "PARTNER" && req.user.companyId !== partner.companyId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.status(200).json(partner);
};

const updatePartner = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) => {
  const { name } = req.body;

  const partner = await prisma.partner.update({
    where: { id },
    data: { name },
  });

  res.status(200).json(partner);
};

export default authenticate(
  authorize(["ADMIN", "COMPANY", "PARTNER"])(handler)
);
