import React from "react";
import InputMask from "react-input-mask";

const LoanApplicationForm = ({
  primaryColor,
  formData,
  setFormData,
  handleSubmit,
  handleChange,
  includeCoBorrower,
  setIncludeCoBorrower,
  adminLoan = false,
}: {
  primaryColor: string;
  formData: any;
  setFormData: any;
  handleSubmit: (e: any) => void;
  handleChange: (e: any) => void;
  includeCoBorrower: boolean;
  setIncludeCoBorrower: (value: boolean) => void;
  adminLoan?: boolean;
}) => {
  if (!formData) return null;
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
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="col-span-1">
                <InputMask
                  type="text"
                  name="borrowerPhone"
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
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  step="0.01"
                  required
                />
              </div>

              <div className="col-span-1">
                <select
                  name="borrowerCredit"
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Credit Rating</option>
                  <option value="EXCELLENT">Excellent (700+)</option>
                  <option value="GOOD">Good (650-699)</option>
                  <option value="FAIR">Fair (600-649)</option>
                  <option value="POOR">Poor (Below 600)</option>
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
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <InputMask
                    type="text"
                    name="coBorrowerPhone"
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
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="col-span-1">
                  <input
                    placeholder="Position"
                    type="text"
                    name="coBorrowerPosition"
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="col-span-1">
                  <input
                    placeholder="Annual Income"
                    type="number"
                    name="coBorrowerIncome"
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    step="0.01"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <select
                    name="coBorrowerCredit"
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
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="col-span-1">
                <input
                  placeholder="City"
                  type="text"
                  name="city"
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
        {!adminLoan && (
          <div>
            <div>
              <h2 className="font-semibold mb-2">Credit Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-2">
                  <InputMask
                    placeholder="SSN"
                    name="ssn"
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
                Number (SSN), you consent to its use for the purpose of
                processing your mortgage application. We are committed to
                protecting your privacy and will handle your information
                securely in compliance with applicable data protection laws.
                Your SSN will be encrypted and stored securely, and access will
                be limited to authorized personnel only. For more information,
                please refer to our
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
        )}
        {/* Submit Button */}
        <div className="mt-3 text-center">
          <button
            type="submit"
            style={{ backgroundColor: primaryColor }}
            className="px-6 py-2 text-white rounded w-full md:w-auto"
          >
            {!adminLoan ? "Submit Application" : "Submit Loan"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoanApplicationForm;
