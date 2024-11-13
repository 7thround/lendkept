import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = cookie.parse(req.headers.cookie || "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      role: string;
    };

    res.status(200).json({ userId: decoded.userId, role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
