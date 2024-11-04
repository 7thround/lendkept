import bcrypt from "bcrypt";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { token, password } = req.body;


  const user = await prisma.user.findUnique({
    where: { id: token },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: token },
    data: {
      password: hashedPassword,
    },
  });


  const authToken = jwt.sign(
    { userId: user.id, role: user.role, companyId: user.companyId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600, // 1 hour
      sameSite: "strict",
      path: "/",
    })
  );

  res.status(200).json({ message: "Reset password email sent" });
}
