import React, { useState } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/20/solid";
import LogoutButton from "../LogoutButton";

const PartnerPortal = () => {
  const [loans, setLoans] = useState([
    {
      id: 1,
      address: "123 Main St",
      status: "PROCESSING",
      partner: "John Doe",
    },
    // Add more loans as needed
  ]);

  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([
    "Welcome to our loan service!",
    // Add more messages as needed
  ]);

  const [partners, setPartners] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "555-555-5555",
    },
    // Add more partners as needed
  ]);

  const [referralCode, setReferralCode] = useState("REF12345");
  const [referralBonuses, setReferralBonuses] = useState([
    { name: "John Doe", amount: 250 },
    { name: "Jane Smith", amount: 500 },
    // Add more referral bonuses as needed
  ]);

  const handleStatusChange = (loanId, newStatus) => {
    setLoans(
      loans.map((loan) =>
        loan.id === loanId ? { ...loan, status: newStatus } : loan
      )
    );
  };

  const handleSendMessage = () => {
    setMessageHistory([...messageHistory, message]);
    setMessage("");
  };

  const handleProcessPayouts = () => {
    // Implement payout processing logic here
  };

  const handleSubmitReferral = (e) => {
    e.preventDefault();
    // Implement referral submission logic here
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="flex items-center gap-4 mx-auto py-4 px-4 sm:px-4 lg:px-8">
          <div className="inline-flex items-center justify-center bg-slate-400 h-10 w-10  text-white rounded-lg">
            JJ
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Portal</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-grow p-4 sm:px-4 lg:px-8 flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Left Column */}
          <div className="flex-grow flex flex-col space-y-4">
            {/* My Loans Panel */}
            <div className="bg-white shadow rounded-lg py-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 px-4">
                My Loans
              </h2>
              <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan ID
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partner
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {loan.id}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {loan.address}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <select
                            disabled
                            className=" rounded-lg p-2 brightness-95"
                            value={loan.status}
                            onChange={(e) =>
                              handleStatusChange(loan.id, e.target.value)
                            }
                          >
                            <option value="SUBMITTED" disabled>
                              Submitted
                            </option>
                            <option value="PROCESSING">Processing</option>
                            <option value="FUNDED">Funded</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {loan.partner}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <button className="text-indigo-400 hover:text-indigo-900 mr-2">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button className="text-red-400 hover:text-red-900">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Referred Partners Panel */}
            <div className="bg-white shadow rounded-lg py-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 px-4">
                Partner Referrals
              </h2>
              <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partner ID
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {partners.map((partner) => (
                      <tr key={partner.id}>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {partner.id}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {partner.name}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {partner.email}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {partner.phone}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <button className="text-indigo-400 hover:text-indigo-900">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4 w-full lg:w-1/3">
            {/* Referral Program Panel */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Referral Program
              </h3>
              <div>
                <label className="block text-gray-700">
                  Share your referral code:
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={referralCode}
                  readOnly
                />
                <button className="mt-2 bg-yellow-500 text-white py-1 px-2 rounded-lg">
                  Copy Link
                </button>
              </div>
            </div>
            {/* Submit Loan Referral Panel */}
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Submit a Loan
              </h2>
              <form onSubmit={handleSubmitReferral}>
                <div className="mb-4">
                  <label className="block text-gray-700">Applicant Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="John Doe"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="555-555-5555"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Property Address
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="123 Main St, City, State"
                  />
                </div>
                <div className="mb-4">
                  {/* <label className="block text-gray-700">Loan details</label> */}
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Additional Information"
                  ></textarea>
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                  Submit
                </button>
              </form>
            </div>
            {/* Referral Bonuses Panel */}
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Referral Bonuses
              </h2>
              <ul className="divide-y divide-gray-200">
                {referralBonuses.map((bonus, index) => (
                  <li
                    key={index}
                    className="py-2 flex justify-between items-center"
                  >
                    <span>{bonus.name}</span>
                    <span className="text-green-500">${bonus.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PartnerPortal;