import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { authenticate, authorize } from "../../../src/middleware/auth";

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    role: string;
    companyId: string;
  };
}

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getCompany(req, res, id as string);
    case "PUT":
      return updateCompany(req, res, id as string);
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const getCompany = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  id: string
) => {
  const company = await prisma.company.findUnique({
    where: { id },
    include: { users: true, loans: true, partners: true },
  });

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (req.user.role === "COMPANY" && req.user.companyId !== company.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.status(200).json(company);
};

const updateCompany = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  id: string
) => {
  const { logo, slug, primaryColor, url, phone,
    name,
    email,
    address: {
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
    }, } = req.body;

  const company = await prisma.company.update({
    where: { id: String(id) },
    data: {
      logo,
      slug,
      primaryColor,
      url,
      phone,
      name,
      email,
      address: {
        update: {
          addressLine1,
          addressLine2,
          city,
          state,
          zip,
        },
      },
    },
  });

  res.status(200).json(company);
};

export default authenticate(authorize(["ADMIN", "COMPANY"])(handler));
