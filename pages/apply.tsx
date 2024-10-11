import { useState } from "react";

const MortgageApplicationForm = () => {
  const [formData, setFormData] = useState({
    loanPurpose: "",
    foundHome: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    loanAmount: 0,
    creditConsent: false,
    annualIncome: 0,
    monthlyDebt: 0,
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
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Mortgage Application
      </h1>

      {/* Loan Purpose Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Loan Purpose</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, loanPurpose: "refinance" })
            }
            className={`p-2 border rounded ${
              formData.loanPurpose === "refinance"
                ? "bg-blue-500 text-white"
                : ""
            }`}
          >
            Refinance
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, loanPurpose: "buy" })}
            className={`p-2 border rounded ${
              formData.loanPurpose === "buy" ? "bg-blue-500 text-white" : ""
            }`}
          >
            New home
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, loanPurpose: "equity" })}
            className={`p-2 border rounded ${
              formData.loanPurpose === "equity" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Equity
          </button>
        </div>
      </div>

      {/* Home Info Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Home Info</h2>
        <label className="block mb-2">
          Have you found the home you'd like to buy?
        </label>
        <div className="flex items-center mb-4">
          <input
            type="radio"
            name="foundHome"
            value="yes"
            onChange={handleChange}
            className="mr-2"
          />
          <label>Yes</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            name="foundHome"
            value="no"
            onChange={handleChange}
            className="mr-2"
          />
          <label>No</label>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
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

      {/* Address Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Address Line 1
            </label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Address Line 2
            </label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Annual Income
            </label>
            <input
              type="number"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Monthly Debt
            </label>
            <input
              type="number"
              name="monthlyDebt"
              value={formData.monthlyDebt}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Credit Info Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Credit Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Social Security Number
            </label>
            <input
              type="password"
              name="ssn"
              value={formData.ssn}
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
            <a href="#" className="text-blue-500 underline">
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
          className="px-6 py-2 bg-blue-500 text-white rounded"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
};

export default MortgageApplicationForm;
