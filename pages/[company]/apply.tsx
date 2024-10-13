import { useState } from "react";
import prisma from "../../lib/prisma";
import { Company, Partner } from "@prisma/client";

export const getServerSideProps = async (context) => {
  const currentPath = context.resolvedUrl;
  const companySlug = currentPath.split("/")[1];
  const referralCode = context.query.ref || ("" as string);
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
    loanType: "",
    downPayment: "",
    foundHome: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    loanAmount: "",
    creditConsent: false,
    annualIncome: "",
    monthlyDebt: "",
    dob: "",
    ssn: "",
  });

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

    const response = await fetch("/api/mortgage/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Mortgage application submitted successfully!");
    } else {
      alert("Failed to submit mortgage application.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ borderTopColor: primaryColor }}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded border-t-12"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Loan Application</h1>

      {/* Company Info Section */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 text-center">
          You are applying for a mortgage with{" "}
          <a
            href={company.url}
            style={{ color: primaryColor }}
            className="font-bold"
          >
            {company.name}
          </a>
          .
        </p>
      </div>
      <div className="border-t border-gray-300 my-6"></div>

      {/* Personal Info Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Applicant Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <input
              placeholder="Full Name"
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <input
              placeholder="Phone Number"
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <input
              placeholder="Email Address"
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Loan Details Section */}
      <div className="my-6">
        <h2 className="text-lg font-semibold mb-4">Loan Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, loanType: "refinance" })}
            style={{
              backgroundColor:
                formData.loanType === "refinance" ? primaryColor : "",
              color: formData.loanType === "refinance" ? "white" : "",
            }}
            className="p-2 border rounded"
          >
            Refinance
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, loanType: "buy" })}
            style={{
              backgroundColor: formData.loanType === "buy" ? primaryColor : "",
              color: formData.loanType === "buy" ? "white" : "",
            }}
            className="p-2 border rounded"
          >
            New home
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, loanType: "equity" })}
            style={{
              backgroundColor:
                formData.loanType === "equity" ? primaryColor : "",
              color: formData.loanType === "equity" ? "white" : "",
            }}
            className="p-2 border rounded"
          >
            Equity
          </button>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Property Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <input
              placeholder="Address Line 1"
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <input
              placeholder="Address Line 2"
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <input
              placeholder="City"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <input
              placeholder="State"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <input
              placeholder="ZIP Code"
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Finances Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Finances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="col-span-1">
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              autoComplete="off"
              placeholder="Loan Amount"
            />
          </div>

          <div className="col-span-1">
            <input
              type="number"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              autoComplete="off"
              placeholder="Down Payment"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <input
              placeholder="Annual Income"
              type="number"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              autoComplete="off"
            />
          </div>

          <div className="col-span-1">
            <input
              placeholder="Monthly Debt"
              type="number"
              name="monthlyDebt"
              value={formData.monthlyDebt}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Credit Info Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Credit Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <input
              placeholder="SSN"
              type="password"
              name="ssn"
              value={formData.ssn}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="col-span-1">
            <input
              placeholder="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Credit Consent Section */}
      <div className="mt-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="creditConsent"
            checked={formData.creditConsent}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            I consent to a credit check
          </span>
        </label>
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Disclaimer:</strong> By providing your Social Security
            Number (SSN), you consent to its use for the purpose of processing
            your mortgage application. We are committed to protecting your
            privacy and will handle your information securely in compliance with
            applicable data protection laws. Your SSN will be encrypted and
            stored securely, and access will be limited to authorized personnel
            only. For more information, please refer to our
            <a
              href="#"
              style={{ color: primaryColor }}
              className="underline ml-1"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          type="submit"
          style={{ backgroundColor: primaryColor }}
          className="px-6 py-2 text-white rounded w-full md:w-auto"
        >
          Submit Application
        </button>
      </div>

      {/* Referral Code Section */}
      {partner && (
        <div className="text-center text-gray-600 mt-6">
          Referred By:{" "}
          <span style={{ color: primaryColor }} className="font-bold">
            {partner.name}
          </span>
        </div>
      )}
    </form>
  );
};

export default MortgageApplicationForm;
