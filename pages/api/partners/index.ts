// src/pages/api/partners/index.ts
import bcrypt from "bcrypt";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

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
  const partnersWithImages = partners.map(partner => ({
    ...partner,
    profileImage: partner.profileImage ? partner.profileImage.toString('base64') : null
  }));
  res.status(200).json(partnersWithImages);
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
    password,
    profileImage
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      let referringPartner = null;
      if (referralCode) {
        referringPartner = await prisma.partner.findUnique({
          where: { referralCode }
        });
      }
      // Generate a default referral code should be 6 random uppercase letters and numbers
      // Sample referral code: 3A5B7C
      const defaultReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const address = await prisma.address.create({
        data: {
          addressLine1,
          addressLine2,
          city,
          state,
          zip
        }
      });
      if (!address) {
        return res.status(400).json({ error: "Invalid Address" });
      }
      const newPartner = await prisma.partner.create({
        data: {
          name,
          email,
          phone,
          companyId,
          referralCode: defaultReferralCode,
          referringPartnerId: referringPartner?.id || null,
          addressId: address.id,
          profileImage: Buffer.from(profileImage, 'base64')
        }
      });
      if (!newPartner) {
        return res.status(400).json({ error: "Invalid Partner" });
      }
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'PARTNER',
          partnerId: newPartner.id,
          companyId,
          name
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
