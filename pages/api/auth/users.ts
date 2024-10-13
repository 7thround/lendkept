import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";
import { User } from "@prisma/client";
import { authenticate, authorize } from "../../../src/middleware/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    email,
    password,
    role,
    companyId,
    name,
    phone,
    referralCode,
    logo,
    defaultBonus,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      let newUser: User;

      if (role === "PARTNER") {
        const newPartner = await prisma.partner.create({
          data: {
            name,
            email,
            phone,
            referralCode: referralCode || generateReferralCode(),
            companyId,
            addressLine1,
            addressLine2,
            city,
            state,
            zip,
          },
        });

        newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
            partnerId: newPartner.id,
          },
        });
      } else if (role === "COMPANY") {
        const newCompany = await prisma.company.create({
          data: {
            name,
            phone,
            logo,
            addressLine1,
            addressLine2,
            city,
            state,
            zip,
          },
        });

        newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
            companyId: newCompany.id,
          },
        });
      } else if (role === "ADMIN") {
        newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
          },
        });
      } else {
        throw new Error("Invalid role");
      }

      return newUser;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 15);
}

export default authenticate(
  authorize(["ADMIN"])(handler)
);
