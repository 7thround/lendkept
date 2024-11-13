// src/pages/api/partners/index.ts
import { Partner } from "@prisma/client";
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
    password,
    profileImage,
  } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const referringPartner = referralCode
        ? await prisma.partner.findUnique({ where: { referralCode } })
        : null;

      const address = await prisma.address.create({
        data: { addressLine1, addressLine2, city, state, zip },
      });

      const newPartner = await prisma.partner.create({
        data: {
          name,
          email,
          phone,
          companyId,
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          referringPartnerId: referringPartner?.id || null,
          addressId: address.id,
        },
      });

      const newUser = await prisma.user.create({
        data: {
          email,
          password: await bcrypt.hash(password, 10),
          role: 'PARTNER',
          partnerId: newPartner.id,
          companyId,
          name,
          profileImage
        },
      });

      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role, companyId: newUser.companyId },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 3600,
          sameSite: 'strict',
          path: '/',
        })
      );

      return newPartner;
    });

    res.status(201).json(result as Partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Something went wrong, please try again.' });
  }
}
