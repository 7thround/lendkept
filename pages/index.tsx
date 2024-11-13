import { Company, Role, User } from "@prisma/client";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import prisma from "../lib/prisma";
import CompanyPortal from "../src/components/CompanyPortal/CompanyPortal";
import PartnerPortal from "../src/components/PartnerPortal/PartnerPortal";
import { LoanWithAddress, PartnerData } from "../types";

export const getUser = async (token: string) => {
  if (!token) return null;

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: string;
    role: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
    include: {
      company: true,
      partner: true,
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    const role = decoded.role as Role;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (role === "PARTNER") {
      const partner = await prisma.partner.findUnique({
        where: {
          id: user.partnerId as string,
        },
        include: {
          company: true,
          affiliates: true,
        },
      });

      if (!partner || !partner.company) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      return {
        props: {
          user: JSON.parse(JSON.stringify(user)),
          partner,
        },
      };
    }

    if (role === "COMPANY") {
      const company = await prisma.company.findUnique({
        where: {
          id: user.companyId as string,
        },
        include: {
          partners: true,
        },
      });
      if (!company) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
      const loanAdmins = await prisma.user.findMany({
        where: {
          companyId: company.id,
          role: "LOAN_ADMIN",
        },
      });
      return {
        props: {
          company: company,
          loanAdmins,
          user: JSON.parse(JSON.stringify(user)),
        },
      };
    }

    // if (role === "LOAN_ADMIN") {
    //   const company = await prisma.company.findUnique({
    //     where: {
    //       id: user.companyId,
    //     },
    //   });

    //   const loans = await prisma.loan.findMany({
    //     where: {
    //       companyId: company.id,
    //       loanAdminId: user.id,
    //     },
    //     include: {
    //       partner: {
    //         select: {
    //           name: true,
    //         },
    //       },
    //       address: true,
    //     },
    //   });

    //   return {
    //     props: {
    //       company: JSON.parse(JSON.stringify(company)),
    //       loans,
    //       user,
    //       role,
    //     },
    //   };
    // }

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
  partner?: PartnerData;
  loans?: LoanWithAddress[];
  user: User;
  loanAdmins?: User[];
};

const Home: React.FC<Props> = ({
  partner,
  company,
  role,
  loans,
  user,
  loanAdmins = [],
}: Props) => {
  if (role === "LOAN_ADMIN") {
    // return <LoanAdminPortal loans={loans} company={company} user={user} />;
  }
  return (
    <>
      {partner && <PartnerPortal partner={partner} />}
      {company && <CompanyPortal company={company} loanAdmins={loanAdmins} />}
    </>
  );
};

export default Home;
