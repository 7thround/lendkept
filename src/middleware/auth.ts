// src/middleware/auth.ts
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
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
