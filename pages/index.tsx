import React from "react";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import CompanyPortal from "../src/components/CompanyPortal/CompanyPortal";
import PartnerPortal from "../src/components/PartnerPortal/PartnerPortal";
import Layout from "../components/Layout";

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
      userId: number;
      role: string;
    };

    return {
      props: {
        userId: decoded.userId,
        role: decoded.role,
      },
    };
  } catch (error) {
    console.error("Error verifying user:", error);

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
};

const Home: React.FC<Props> = ({ role }: Props) => {
  return (
    <main>{role === "PARTNER" ? <PartnerPortal /> : <CompanyPortal />}</main>
  );
};

export default Home;
