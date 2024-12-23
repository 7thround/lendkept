// src/pages/api/users/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "POST":
      return createUser(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, role, companyId, partnerId, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword, role, companyId, partnerId, name },
  });
  res.status(201).json(newUser);
}
