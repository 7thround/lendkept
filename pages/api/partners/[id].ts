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
    case "DELETE":
      return deletePartner(req, res, id as string);
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

const updatePartner = async (req: NextApiRequest, res: NextApiResponse, id: string) => {
  const { name, phone, profileImage, address } = req.body;

  try {
    const partner = await prisma.partner.update({
      where: { id: String(id) },
      data: {
        name,
        phone,
        profileImage,
        address: {
          update: {
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            zip: address.zip,
          },
        },
      },
    });
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ error: "Failed to update partner" });
  }
};

const deletePartner = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) => {
  await prisma.partner.delete({ where: { id } });

  res.status(200).json({ message: "Partner deleted successfully" });
}

export default authenticate(
  authorize(["ADMIN", "COMPANY", "PARTNER"])(handler)
);
