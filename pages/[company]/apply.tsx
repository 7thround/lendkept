import { Company, Partner } from "@prisma/client";
import Head from "next/head";
import { useState } from "react";
import prisma from "../../lib/prisma";
import { sendEmail } from "../../src/utils";
import LoanApplicationForm from "./LoanApplicationForm";

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { company: companySlug } = params;
  const referralCode = context.query.referralCode || ("" as string);
  try {
    const company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });

    if (!company) {
      return {
        notFound: true,
      };
    }

    const partner: Partner = await prisma.partner.findFirst({
      where: {
        referralCode,
        companyId: company.id,
      },
    });

    return {
      props: { company, partner },
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
  partner: Partner;
}

const MortgageApplicationForm = ({ company, partner }: Props) => {
  const { primaryColor } = company;
  const [formData, setFormData] = useState({
    loanType: "HOME_PURCHASE",
  } as any);
  const [loanSubmitted, setLoanSubmitted] = useState(false);
  const [includeCoBorrower, setIncludeCoBorrower] = useState(false);

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

    // Add partner and company IDs to the payload
    formData.partnerId = partner?.id || null;
    formData.companyId = company.id;

    // Include co-borrower if applicable
    formData.includeCoBorrower = includeCoBorrower || false;

    const response = await fetch("/api/loans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      await sendEmail({
        to: company.email,
        subject: "New Loan Application",
        template: "LoanSubmitted",
        payload: {
          company,
          loan: formData,
        },
      });
      console.log(`Email sent to ${company.email}`);
      if (partner) {
        await sendEmail({
          to: partner.email,
          subject: "New Loan Application",
          template: "LoanSubmitted",
          payload: {
            company,
            loan: formData,
          },
        });
        console.log(`Email sent to ${partner.email}`);
      }
      alert("Mortgage application submitted successfully!");
      setFormData({});
      setLoanSubmitted(true);
    } else {
      alert("Failed to submit mortgage application.");
    }
  };

  return (
    <>
      <Head>
        <title>{`Apply for a Mortgage with ${company.name}`}</title>
        <meta
          name="description"
          content={`Apply for funding with ease. Fill out the loan application form and get started today.`}
        />
        <meta
          name="keywords"
          content="mortgage, loan application, home loan, real estate"
        />
        <meta name="author" content={company.name} />
        <meta
          property="og:title"
          content={`Apply for a Mortgage with ${company.name}`}
        />
        <meta
          property="og:description"
          content={`
            Apply for funding with ease. Fill out the loan application form and get started today.
          `}
        />
        <meta property="og:url" content={company.url} />
        <meta property="og:type" content="website" />
        {/* <meta
          property="og:image"
          content={`${company.url}/path-to-your-image.jpg`}
        /> */}
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      {!loanSubmitted ? (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded border-t-4 border-gray-500">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Loan Application
          </h1>
          {/* Company Info Section */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 text-center">
              You are applying for a mortgage with{" "}
              <a
                href={company.url}
                className="font-bold text-black"
                style={{ color: primaryColor }}
              >
                {company.name}
              </a>
              .
            </p>
          </div>
          <div className="border-t border-gray-300 my-6"></div>
          <LoanApplicationForm
            primaryColor={primaryColor}
            formData={formData}
            handleSubmit={handleSubmit}
            setFormData={setFormData}
            handleChange={handleChange}
            includeCoBorrower={includeCoBorrower}
            setIncludeCoBorrower={setIncludeCoBorrower}
          />
          {/* Referral Code Section */}
          {partner && (
            <div className="text-center text-gray-600 mt-6">
              Referred By:{" "}
              <span className="text-black font-bold">{partner.name}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 mt-12">Loan Submitted!</h1>
          <p className="text-gray-600">
            Your mortgage application has been submitted successfully. We will
            review your application and get back to you soon.
          </p>
        </div>
      )}
    </>
  );
};

export default MortgageApplicationForm;
