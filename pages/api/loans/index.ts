// src/pages/api/loans/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { CreditRating, LoanStatus } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getLoans(req, res);
    case "POST":
      return createLoan(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getLoans(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { search = '', status, referredBy, sortColumn, sortDirection } = req.query;

    const loans = await prisma.loan.findMany({
      where: {
        address: {
          addressLine1: {
            contains: Array.isArray(search) ? search[0] : search,
          },
        },
        status: status ? LoanStatus[Array.isArray(status) ? status[0] : status] : undefined,
        partner: {
          name: referredBy ? { contains: Array.isArray(referredBy) ? referredBy[0] : referredBy } : undefined,
        },
      },
      orderBy: sortColumn
        ? { [Array.isArray(sortColumn) ? sortColumn[0] : sortColumn]: sortDirection === 'desc' ? 'desc' : 'asc' }
        : undefined,
      include: {
        address: true,
        partner: true,
      },
    });

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
}
async function createLoan(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    // Borrower Information
    borrowerFirstName,
    borrowerLastName,
    borrowerEmail,
    borrowerPhone,
    borrowerEmployer,
    borrowerPosition,
    borrowerIncome,
    borrowerCredit,
    // Co-Borrower Information
    coBorrowerFirstName,
    coBorrowerLastName,
    coBorrowerEmail,
    coBorrowerPhone,
    coBorrowerEmployer,
    coBorrowerPosition,
    coBorrowerIncome,
    coBorrowerCredit,
    // Loan Information
    loanType,
    loanAmount,
    // Address Information
    addressLine1,
    city,
    state,
    zip,
    addressLine2,
    downPayment,
    // Financial Information
    annualIncome,
    monthlyDebt,
    // Partner & Company Information
    partnerId,
    companyId,
    loanAdminId,
    includeCoBorrower,
  } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const accessCode = String(Math.floor(100000 + Math.random() * 900000));
      const status = LoanStatus.POSSIBLE_LOAN;
      const address = await prisma.address.create({
        data: {
          addressLine1,
          addressLine2: addressLine2 || null,
          city,
          state,
          zip,
        },
      });
      if (!address) {
        return res.status(400).json({ error: "Invalid Address" });
      }
      const newLoan = await prisma.loan.create({
        data: {
          addressId: address.id,
          loanType,
          loanAmount: parseFloat(loanAmount),
          status,
          partnerId,
          companyId,
          accessCode,
          loanAdminId,
          downPayment: parseFloat(downPayment),
          annualIncome: parseFloat(annualIncome),
          monthlyDebt: parseFloat(monthlyDebt),
          borrowers: {
            create: [
              {
                firstName: borrowerFirstName,
                lastName: borrowerLastName,
                email: borrowerEmail,
                phone: borrowerPhone,
                employer: borrowerEmployer,
                position: borrowerPosition,
                income: parseFloat(borrowerIncome),
                credit: borrowerCredit as CreditRating,
              },
              ...(coBorrowerFirstName && includeCoBorrower
                ? [{
                  firstName: coBorrowerFirstName,
                  lastName: coBorrowerLastName,
                  email: coBorrowerEmail,
                  phone: coBorrowerPhone,
                  employer: coBorrowerEmployer,
                  position: coBorrowerPosition,
                  income: parseFloat(coBorrowerIncome),
                  credit: coBorrowerCredit as CreditRating,
                  coBorrower: true,
                }]
                : []),
            ],
          },
        },
      });

      return newLoan;
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
