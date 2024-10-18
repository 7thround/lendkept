import React from "react";
import { Company, Loan, Partner, Role, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import CompanyPortal from "../src/components/CompanyPortal/CompanyPortal";
import PartnerPortal from "../src/components/PartnerPortal/PartnerPortal";
import prisma from "../lib/prisma";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export const getUser = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
    userId: string;
    role: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  return user;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { req } = context;
    const cookies = req.headers.cookie;
    const parsedCookies = cookie.parse(cookies || "");
    const token = parsedCookies.token;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      role: string;
    };

    const role = decoded.role as Role;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (role === "PARTNER") {
      const partnerData = await prisma.partner.findUnique({
        where: {
          id: user.partnerId,
        },
        include: {
          company: true,
          referredPartners: {
            include: {
              loans: true,
            },
          },
        },
      });

      if (!user || !partnerData || !partnerData.company) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      // include partner name
      const partnerLoans = await prisma.loan.findMany({
        where: {
          partnerId: partnerData.id,
        },
      });

      const referredLoans = await prisma.loan.findMany({
        where: {
          partnerId: {
            in: partnerData.referredPartners.map((partner) => partner.id),
          },
        },
        include: {
          partner: {
            select: {
              name: true,
            },
          },
        },
      });

      const { company, referredPartners } = partnerData;

      return {
        props: {
          role,
          partner: partnerData,
          company,
          loans: [...partnerLoans],
          partners: referredPartners,
          referredLoans,
          user,
        },
      };
    }

    if (role === "COMPANY") {
      const company = await prisma.company.findUnique({
        where: {
          id: user.companyId,
        },
      });
      const partners = await prisma.partner.findMany({
        where: {
          companyId: company.id,
        },
      });

      const loans = await prisma.loan.findMany({
        where: {
          companyId: company.id,
        },
        include: {
          partner: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        props: {
          company,
          loans,
          partners,
          user,
        },
      };
    }

    return {
      props: {},
    };
  } catch (error) {
    console.error("Error verifying the user:", error);

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

type Props = {
  role: Role;
  company: Company;
  partner?: Partner;
  loans?: Loan[];
  referredLoans?: Loan[];
  partners?: Partner[];
  user: User;
};

const Home: React.FC<Props> = ({
  partner,
  company,
  role,
  loans,
  partners,
  referredLoans,
  user,
}: Props) => {
  return (
    <>
      {role === "PARTNER" ? (
        <PartnerPortal
          partner={partner}
          company={company}
          loans={loans}
          partners={partners}
          referredLoans={referredLoans}
        />
      ) : (
        <CompanyPortal
          loans={loans}
          partners={partners}
          company={company}
          user={user}
        />
      )}
    </>
  );
};

export default Home;
