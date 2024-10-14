// src/pages/api/partners/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getPartners(req, res);
    case "POST":
      return createPartner(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getPartners(req: NextApiRequest, res: NextApiResponse) {
  const partners = await prisma.partner.findMany();
  res.status(200).json(partners);
}

async function createPartner(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    name,
    email,
    phone,
    companyId,
    referralCode,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
    password
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const referringPartner = await prisma.partner.findUnique({
        where: { referralCode }
      });

      // Generate a default referral code should be 6 random uppercase letters and numbers
      // Sample referral code: 3A5B7C
      const defaultReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const newPartner = await prisma.partner.create({
        data: {
          name,
          email,
          phone,
          companyId,
          referralCode: defaultReferralCode,
          referringPartnerId: referringPartner ? referringPartner.id : null,
          addressLine1,
          addressLine2,
          city,
          state,
          zip
        }
      });

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'PARTNER',
          partnerId: newPartner.id,
        },
      });

      // Create a JWT token
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role, companyId: newUser.companyId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set the token in a cookie
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 3600, // 1 hour
          sameSite: "strict",
          path: "/",
        })
      );

      return newUser;
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
