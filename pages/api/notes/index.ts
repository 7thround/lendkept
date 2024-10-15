// src/pages/api/notes/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getNotes(req, res);
    case "POST":
      return createNote(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getNotes(req: NextApiRequest, res: NextApiResponse) {
  const notes = await prisma.note.findMany();
  res.status(200).json(notes);
}

async function createNote(req: NextApiRequest, res: NextApiResponse) {
  const { text, senderId, loanId } = req.body;
  const newNote = await prisma.note.create({
    data: { text, senderId, loanId },
  });
  res.status(201).json(newNote);
}
