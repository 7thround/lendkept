// src/pages/api/messages/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getMessages(req, res);
    case "POST":
      return createMessage(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getMessages(req: NextApiRequest, res: NextApiResponse) {
  const messages = await prisma.message.findMany();
  res.status(200).json(messages);
}

async function createMessage(req: NextApiRequest, res: NextApiResponse) {
  const { content, senderId, loanId } = req.body;
  const newMessage = await prisma.message.create({
    data: { content, senderId, loanId },
  });
  res.status(201).json(newMessage);
}
