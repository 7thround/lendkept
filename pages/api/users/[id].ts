// src/pages/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getUser(req, res, id as string);
    case "PUT":
      return updateUser(req, res, id as string);
    case "DELETE":
      return deleteUser(req, res, id as string);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
}

async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const { email, password, role, companyId, partnerId } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { email, password, role, companyId, partnerId },
  });
  res.status(200).json(updatedUser);
}

async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  await prisma.user.delete({ where: { id } });
  res.status(204).end();
}
