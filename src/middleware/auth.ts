// src/middleware/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export function authenticate(handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { token } = cookie.parse(req.headers.cookie || "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // @ts-ignore
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

export function authorize(roles: string[]) {
  return (handler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      // @ts-ignore
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return handler(req, res);
    };
  };
}
