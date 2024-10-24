import React, { useState } from "react";
import InputMask from "react-input-mask";

const LoanApplicationForm = ({
  primaryColor,
  formData,
  setFormData,
  handleSubmit,
  handleChange,
}: {
  primaryColor: string;
  formData: any;
  setFormData: any;
  handleSubmit: (e: any) => void;
  handleChange: (e: any) => void;
}) => {
  const [includeCoBorrower, setIncludeCoBorrower] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="flex flex-col gap-6">
        {/* Borrower Info Section */}
        <div>
          {/* Borrower Info Section */}
          <div>
            <h2 className="font-semibold mb-2">Borrower Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="col-span-1">
                <input
                  placeholder="First Name"
                  type="text"
                  name="borrowerFirstName"
                  value={formData.borrowerFirstName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="col-span-1">
                <input
                  placeholder="Last Name"
                  type="text"
                  name="borrowerLastName"
                  value={formData.borrowerLastName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="col-span-1">
                <input
                  placeholder="Email Address"
                  type="email"
                  name="borrowerEmail"
                  value={formData.borrowerEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="col-span-1">
                <InputMask
                  type="text"
                  name="borrowerPhone"
                  value={formData.borrowerPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  mask="(999) 999-9999"
                  placeholder="Phone Number"
                  required
                />
              </div>

              <div className="col-span-1">
                <input
                  placeholder="Employer"
                  type="text"
                  name="borrowerEmployer"
                  value={formData.borrowerEmployer}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="col-span-1">
                <input
                  placeholder="Position"
                  type="text"
                  name="borrowerPosition"
                  value={formData.borrowerPosition}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="col-span-1">
                <input
                  placeholder="Income"
                  type="number"
                  name="borrowerIncome"
                  value={formData.borrowerIncome}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  step="0.01"
                  required
                />
              </div>

              <div className="col-span-1">
                <select
                  name="borrowerCredit"
                  value={formData.borrowerCredit}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Credit Rating</option>
                  <option value="EXCELLENT">Excellent (750+)</option>
                  <option value="GOOD">Good (700-749)</option>
                  <option value="FAIR">Fair (650-699)</option>
                  <option value="POOR">Poor (Below 650)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Co-Borrower Checkbox */}
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includeCoBorrower"
                checked={includeCoBorrower}
                onChange={(e) => setIncludeCoBorrower(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Include Co-Borrower</span>
            </label>
          </div>

          {/* Co-Borrower Info Section */}
          {includeCoBorrower && (
            <div>
              <h2 className="font-semibold mt-4 mb-2">Co-borrower Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-1">
                  <input
                    placeholder="First Name"
                    type="text"
                    name="coBorrowerFirstName"
                    value={formData.coBorrowerFirstName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <input
                    placeholder="Last Name"
                    type="text"
                    name="coBorrowerLastName"
                    value={formData.coBorrowerLastName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <input
                    placeholder="Email Address"
                    type="email"
                    name="coBorrowerEmail"
                    value={formData.coBorrowerEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <InputMask
                    type="text"
                    name="coBorrowerPhone"
                    value={formData.coBorrowerPhone}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    mask="(999) 999-9999"
                    placeholder="Phone Number"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <input
                    placeholder="Employer"
                    type="text"
                    name="coBorrowerEmployer"
                    value={formData.coBorrowerEmployer}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="col-span-1">
                  <input
                    placeholder="Position"
                    type="text"
                    name="coBorrowerPosition"
                    value={formData.coBorrowerPosition}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="col-span-1">
                  <input
                    placeholder="Income"
                    type="number"
                    name="coBorrowerIncome"
                    value={formData.coBorrowerIncome}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    step="0.01"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <select
                    name="coBorrowerCredit"
                    value={formData.coBorrowerCredit}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Credit Rating</option>
                    <option value="EXCELLENT">Excellent (750+)</option>
                    <option value="GOOD">Good (700-749)</option>
                    <option value="FAIR">Fair (650-699)</option>
                    <option value="POOR">Poor (Below 650)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loan Details Section */}
        <div>
          <div>
            <h2 className="font-semibold mb-2">Loan Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
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
                onClick={() =>
                  setFormData({ ...formData, loanType: "REFINANCE" })
                }
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
          <div>
            <h2 className="font-semibold mb-2">Property Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        </div>

        {/* Finances Section */}
        <div>
          <div>
            <h2 className="font-semibold mb-2">Finances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        </div>

        {/* Credit Info Section */}
        <div>
          <div>
            <h2 className="font-semibold mb-2">Credit Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="col-span-2">
                <InputMask
                  placeholder="SSN"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  autoComplete="off"
                  mask="999-99-9999"
                  onBlur={(e) => {
                    e.target.type = "password";
                  }}
                  onFocus={(e) => {
                    e.target.type = "text";
                  }}
                />
              </div>
            </div>
          </div>
          {/* Credit Consent Section */}
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="creditConsent"
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                I consent to a credit check
              </span>
            </label>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Disclaimer:</strong> By providing your Social Security
              Number (SSN), you consent to its use for the purpose of processing
              your mortgage application. We are committed to protecting your
              privacy and will handle your information securely in compliance
              with applicable data protection laws. Your SSN will be encrypted
              and stored securely, and access will be limited to authorized
              personnel only. For more information, please refer to our
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
        <div className="mt-3 text-center">
          <button
            type="submit"
            style={{ backgroundColor: primaryColor }}
            className="px-6 py-3 text-white rounded w-full md:w-auto"
          >
            Submit Application
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoanApplicationForm;
