import React, { useState } from "react";
import {
  ClipboardIcon,
  EyeIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { Company, Loan, Partner } from "@prisma/client";
import { PageContainer, Column } from "../Layout/PageParts";
import { copyToClipboard } from "../../utils";

const PartnerPortal = ({
  partner,
  company,
  loans,
  partners,
  referredLoans,
}: {
  partner: Partner;
  company: Company;
  loans: Loan[];
  partners: Partner[];
  referredLoans: Loan[];
}) => {
  console.log("loans", loans);
  console.log("referredLoans", referredLoans);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([
    "Welcome to our loan service!",
  ]);
  const handleSendMessage = () => {
    setMessageHistory([...messageHistory, message]);
    setMessage("");
  };

  const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${company.slug}/apply?referralCode=${partner.referralCode}`;
  const [referralLoans, setReferralBonuses] = useState([
    { name: "John Doe", amount: 250 },
    { name: "Jane Smith", amount: 500 },
  ]);

  const [copyText, setCopyText] = useState<String | JSX.Element>(
    "Loan Application Link"
  );
  const handleCopyLink = () => {
    copyToClipboard(referralLink);
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Loan Application Link"), 2000);
  };

  const [copyPartnerText, setCopyPartnerText] = useState<String | JSX.Element>(
    <LinkIcon className="h-5 w-5 text-white" />
  );
  const handleCopyPartnerLink = () => {
    copyToClipboard(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${company.slug}/register?referralCode=${partner.referralCode}`
    );
    setCopyPartnerText("Copied!");
    setTimeout(
      () => setCopyPartnerText(<LinkIcon className="h-5 w-5 text-white" />),
      2000
    );
  };

  return (
    <PageContainer>
      <Column col={8}>
        {/* My Loans Panel */}
        <div className="bg-white shadow rounded-lg py-2 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 px-4">
            Welcome, {partner.name}!
          </h2>
          <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referred By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.length ? (
                  loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="py-2 px-4 whitespace-nowrap">
                        {loan.addressLine1}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">
                        ${loan.loanAmount.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">
                        <select
                          disabled
                          className=" rounded-lg p-2 brightness-95"
                          value={loan.status}
                        >
                          <option value="SUBMITTED" disabled>
                            Submitted
                          </option>
                          <option value="PROCESSING">Processing</option>
                          <option value="FUNDED">Funded</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="text-center py-2 px-4 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/loans/${loan.id}`)}
                        >
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-center">
                        {/* @ts-ignore */}
                        {loan.partner ? loan.partner.name : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-2 px-4 whitespace-nowrap text-center"
                      colSpan={4}
                    >
                      <div>No loans yet</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Referred Partners Panel */}
        <div className="bg-white shadow rounded-lg py-2 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Partner Referrals
            </h2>
          </div>
          <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.length ? (
                  partners.map((partner) => (
                    <tr key={partner.id}>
                      <td className="py-2 px-4 whitespace-nowrap">
                        {partner.name}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">
                        {partner.email}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-2 px-4 whitespace-nowrap text-center"
                      colSpan={2}
                    >
                      <div>No referred partners yet</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Column>
      <Column col={4}>
        {/* Referral Program Panel */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Referral Program
          </h3>
          <div>
            <label className="block text-gray-700 pb-2">
              Refer a partner and earn bonuses!
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                value={partner.referralCode}
                readOnly
              />
              <button
                onClick={handleCopyPartnerLink}
                className="bg-yellow-500 text-white p-2 rounded-lg shrink-0"
              >
                {copyPartnerText}
              </button>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <button
                onClick={handleCopyLink}
                className="text-sm shrink-0 font-bold"
              >
                {copyText}
              </button>
            </div>
          </div>
        </div>
        {/* Referral Bonuses Panel */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Referral Bonuses
          </h2>
          <ul className="divide-y divide-gray-200">
            {referralLoans.map((bonus, index) => (
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
      </Column>
      <Column col={12}>
        {/* Message Center Panel */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Promo Messages
          </h3>
          <ul className="divide-y divide-gray-200">
            {messageHistory.map((msg, index) => (
              <li
                key={index}
                className="py-2 flex justify-between items-start gap-2"
              >
                <span>{msg}</span>
                <span className="text-gray-500 shrink-0">1 min ago</span>
              </li>
            ))}
          </ul>
        </div>
      </Column>
    </PageContainer>
  );
};

export default PartnerPortal;
