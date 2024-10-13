import React from "react";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import CompanyPortal from "../src/components/CompanyPortal/CompanyPortal";
import PartnerPortal from "../src/components/PartnerPortal/PartnerPortal";
import prisma from "../lib/prisma";

export const getServerSideProps = async (context) => {
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

    if (role === "PARTNER") {
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      });

      const partner = await prisma.partner.findUnique({
        where: {
          id: user.partnerId,
        },
      });

      if (!user || !partner) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      const company = await prisma.company.findUnique({
        where: {
          id: partner.companyId,
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

      return {
        props: {
          role,
          partner,
          company,
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
  company: any;
  partner?: any;
};

const Home: React.FC<Props> = ({ partner, company, role }: Props) => {
  return (
    <main>
      {role === "PARTNER" ? (
        <PartnerPortal partner={partner} company={company} />
      ) : (
        <CompanyPortal />
      )}
    </main>
  );
};

export default Home;
