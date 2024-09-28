// src/pages/api/messages/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getMessage(req, res, id as string);
    case "PUT":
      return updateMessage(req, res, id as string);
    case "DELETE":
      return deleteMessage(req, res, id as string);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getMessage(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const message = await prisma.message.findUnique({ where: { id } });
  if (message) {
    res.status(200).json(message);
  } else {
    res.status(404).json({ message: "Message not found" });
  }
}

async function updateMessage(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const { content } = req.body;
  const updatedMessage = await prisma.message.update({
    where: { id },
    data: { content },
  });
  res.status(200).json(updatedMessage);
}

async function deleteMessage(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  await prisma.message.delete({ where: { id } });
  res.status(204).end();
}
