// src/pages/api/notes/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getNote(req, res, id as string);
    case "PUT":
      return updateNote(req, res, id as string);
    case "DELETE":
      return deleteNote(req, res, id as string);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getNote(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const note = await prisma.note.findUnique({ where: { id } });
  if (note) {
    res.status(200).json(note);
  } else {
    res.status(404).json({ note: "Note not found" });
  }
}

async function updateNote(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const { content } = req.body;
  const updatedNote = await prisma.note.update({
    where: { id },
    data: { text: content },
  });
  res.status(200).json(updatedNote);
}

async function deleteNote(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  await prisma.note.delete({ where: { id } });
  res.status(204).end();
}
