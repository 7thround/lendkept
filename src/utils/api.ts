import prisma from "../../lib/prisma";

export const fetchLoanDetails = async (id: number) => (prisma.loan.findUnique({
  where: { id: Number(id) },
  include: {
    address: true,
    borrowers: true,
    notes: {
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    },
    partner: true,
    company: true,
  },
}));