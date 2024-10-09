import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = cookie.parse(req.headers.cookie || "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
      role: string;
    };

    res.status(200).json({ userId: decoded.userId, role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
