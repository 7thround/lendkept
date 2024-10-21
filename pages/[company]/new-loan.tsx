import { useState } from "react";
import prisma from "../../lib/prisma";
import { Company, Partner } from "@prisma/client";
import InputMask from "react-input-mask";

function formatLoanPayload(payload) {
  return {
    clientName: payload.clientName,
    clientPhone: payload.clientPhone,
    clientEmail: payload.clientEmail,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2 || null,
    city: payload.city,
    state: payload.state,
    zip: payload.zip,
    loanType: payload.loanType,
    loanAmount: parseFloat(payload.loanAmount),
    status: "POSSIBLE_LOAN",
    paid: false,
    companyId: "",
  };
}

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { company: companySlug } = params;
  try {
    const company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });

    if (!company) {
      return {
        notFound: true,
      };
    }

    return {
      props: { company },
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
}

const MortgageApplicationForm = ({ company }: Props) => {
  const { primaryColor } = company;
  const [formData, setFormData] = useState({
    loanType: "HOME_PURCHASE",
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
  const [loanSubmitted, setLoanSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the payload
    const loanPayload = formatLoanPayload(formData);

    // Add partner and company IDs to the payload
    loanPayload.companyId = company.id;

    const response = await fetch("/api/loans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanPayload),
    });

    if (response.ok) {
      alert("Mortgage application submitted successfully!");
      setFormData({
        loanType: "HOME_PURCHASE",
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
      setLoanSubmitted(true);
    } else {
      alert("Failed to submit mortgage application.");
    }
  };

  return !loanSubmitted ? (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded border-t-4 border-gray-500"
      style={{ borderColor: primaryColor }}
    >
      {/* Applicant Info Section */}
      <div>
        <h1 className="text-xl font-semibold mb-4">Applicant Info</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
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
            <InputMask
              type="text"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              mask="(999) 999-9999"
              placeholder="Phone Number"
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
        <div className="text-sm grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, loanType: "HOME_PURCHASE" })
            }
            style={{
              backgroundColor:
                formData.loanType === "HOME_PURCHASE" ? primaryColor : "",
              color: formData.loanType === "HOME_PURCHASE" ? "white" : "",
            }}
            className="p-2 border rounded"
          >
            New Purchase
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, loanType: "REFINANCE" })}
            style={{
              backgroundColor:
                formData.loanType === "REFINANCE" ? primaryColor : "",
              color: formData.loanType === "REFINANCE" ? "white" : "",
            }}
            className="p-2 border rounded"
          >
            Refinance
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, loanType: "EQUITY" })}
            style={{
              backgroundColor:
                formData.loanType === "EQUITY" ? primaryColor : "",
              color: formData.loanType === "EQUITY" ? "white" : "",
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
              placeholder="Loan Amount"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              autoComplete="off"
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

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          type="submit"
          style={{ backgroundColor: primaryColor }}
          className="px-6 py-2 text-white rounded w-full md:w-auto"
        >
          Submit Loan
        </button>
      </div>
    </form>
  ) : (
    <div className="text-center flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-bold mb-4 mt-12">Loan Submitted</h1>
      <button
        onClick={() => setLoanSubmitted(false)}
        style={{ backgroundColor: primaryColor }}
        className="px-6 py-2 text-white rounded"
      >
        Submit Another Application
      </button>
      <button
        className="text-[#e74949] hover:text-blue-900"
        onClick={() => window.history.back()}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default MortgageApplicationForm;
