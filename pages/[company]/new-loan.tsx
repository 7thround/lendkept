import { Company, User } from "@prisma/client";
import cookie from "cookie";
import { useState } from "react";
import { getUser } from "..";
import prisma from "../../lib/prisma";
import LoanApplicationForm from "./LoanApplicationForm";

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { company: companySlug } = params;
  try {
    const company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });

    if (!company) {
      return { notFound: true };
    }

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

    return {
      props: { company, user: await getUser(token) },
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

interface Props {
  company: Company;
  user: User;
}

const MortgageApplicationForm = ({ company, user }: Props) => {
  const { primaryColor } = company;
  const [formData, setFormData] = useState({
    loanType: "HOME_PURCHASE",
  } as any);
  const [loanSubmitted, setLoanSubmitted] = useState(false);
  const [includeCoBorrower, setIncludeCoBorrower] = useState(false);
  const isLoanAdmin = user?.role === "LOAN_ADMIN";
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.creditConsent) {
      alert("Please provide consent for credit check.");
      return;
    }

    // Add company id to the payload
    formData.companyId = company.id;
    formData.includeCoBorrower = includeCoBorrower;

    if (isLoanAdmin) {
      formData.loanAdminId = user?.id;
    }

    const response = await fetch("/api/loans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Mortgage application submitted successfully!");
      setFormData({});
      setLoanSubmitted(true);
    } else {
      alert("Failed to submit mortgage application.");
    }
  };

  return !loanSubmitted ? (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded border-t-4 border-gray-500">
      <h1 className="text-2xl font-bold mb-4 text-center">Add a New Loan</h1>
      {/* Company Info Section */}
      {!isLoanAdmin && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 text-center">
            You are applying for a mortgage with{" "}
            <a
              href={company.url as string}
              className="font-bold text-black"
              style={{ color: primaryColor as string }}
            >
              {company.name}
            </a>
            .
          </p>
        </div>
      )}
      <div className="border-t border-gray-300 my-6"></div>
      <LoanApplicationForm
        primaryColor={primaryColor as string}
        formData={formData}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        handleChange={handleChange}
        includeCoBorrower={includeCoBorrower}
        setIncludeCoBorrower={setIncludeCoBorrower}
        adminLoan={isLoanAdmin}
      />
    </div>
  ) : (
    <div className="text-center flex flex-col gap-2 items-center">
      <h1 className="text-2xl font-bold mb-2 mt-12">
        The loan has been submitted successfully!
      </h1>
      <button
        onClick={() => setLoanSubmitted(false)}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Submit Another Loan
      </button>
      <a
        href={`/`}
        className="border border-gray-800 px-4 py-2 rounded text-gray-800"
      >
        Back Home
      </a>
    </div>
  );
};

export default MortgageApplicationForm;
