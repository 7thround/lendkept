// src/pages/api/auth/verify.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.userId, role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
