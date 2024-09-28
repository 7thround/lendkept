// src/pages/api/companies/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getCompanies(req, res);
    case "POST":
      return createCompany(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getCompanies(req: NextApiRequest, res: NextApiResponse) {
  const companies = await prisma.company.findMany();
  res.status(200).json(companies);
}

async function createCompany(req: NextApiRequest, res: NextApiResponse) {
  const { name, logo, defaultBonus, address, phone } = req.body;
  const newCompany = await prisma.company.create({
    data: { name, logo, defaultBonus, address, phone },
  });
  res.status(201).json(newCompany);
}
