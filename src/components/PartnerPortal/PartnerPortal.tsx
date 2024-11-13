import { LinkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { PartnerData } from "../../../types";
import { copyToClipboard } from "../../utils";
import { Column, PageContainer } from "../Layout/PageParts";
import LoansTable from "../LoansTable";
import ConfirmationModal from "../common/ConfirmationModal";

const PartnerPortal = ({ partner }: { partner: PartnerData }) => {
  const { affiliates, company } = partner;
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([
    "Welcome to our loan service!",
  ]);
  const handleSendMessage = () => {
    setMessageHistory([...messageHistory, message]);
    setMessage("");
  };

  const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${company.slug}/apply?referralCode=${partner.referralCode}`;
  const [referralLoans, setReferralBonuses] = useState([]);

  const [copyText, setCopyText] = useState<String | JSX.Element>(
    <>
      Loan Application Link
      <LinkIcon className="h-5 w-5 text-white" />
    </>
  );
  const handleCopyLink = () => {
    copyToClipboard(referralLink);
    setCopyText("Link Copied!");
    setTimeout(
      () =>
        setCopyText(
          <>
            Loan Application Link
            <LinkIcon className="h-5 w-5 text-white" />
          </>
        ),
      1000
    );
  };

  const [copyPartnerText, setCopyPartnerText] = useState<String | JSX.Element>(
    <>
      Affiliate Link <LinkIcon className="h-5 w-5 text-white inline" />
    </>
  );
  const handleCopyPartnerLink = () => {
    copyToClipboard(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${company.slug}/register?referralCode=${partner.referralCode}`
    );
    setCopyPartnerText("Link Copied!");
    setTimeout(
      () =>
        setCopyPartnerText(
          <>
            Affiliate Link <LinkIcon className="h-5 w-5 text-white inline" />
          </>
        ),
      1000
    );
  };
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    onConfirm: () => {},
    message: "",
  });

  const closeConfirmModal = () => {
    setConfirmModal({
      ...confirmModal,
      isOpen: false,
    });
  };

  const handleDeleteLoan = async (id) => {
    const res = await fetch(`/api/loans/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Loan deleted successfully");
    }
  };

  const confirmDeleteLoan = (id) => {
    setConfirmModal({
      isOpen: true,
      onConfirm: () => {
        handleDeleteLoan(id);
        closeConfirmModal();
      },
      message: "Are you sure you want to delete this loan?",
    });
  };

  return (
    <PageContainer>
      <Column col={8}>
        <LoansTable affiliates={affiliates} partner={partner} />
      </Column>
      <Column col={4}>
        {/* Refer a Partner Panel */}
        <div className="bg-white shadow rounded-lg pt-2 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Affiliate Referrals
          </h3>
          <div>
            <div className="block text-gray-700 pb-2">
              Share your referral link with others to earn commissions.
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                value={partner.referralCode}
                readOnly
              />
              <button
                onClick={handleCopyPartnerLink}
                className="bg-[#e74949] text-white p-2 rounded-lg shrink-0"
              >
                {copyPartnerText}
              </button>
            </div>
            <div className="">
              <button
                onClick={handleCopyLink}
                className="bg-[#e74949] text-white px-2 py-1 rounded-lg shrink-0 flex gap-2 items-center mt-4"
              >
                {copyText}
              </button>
            </div>
          </div>
        </div>
        {/* Affiliate Partners Panel */}
        <div className="bg-white shadow rounded-lg py-2 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Affiliate Partners
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
                {affiliates.length ? (
                  affiliates.map((partner) => (
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
                      className="py-2 whitespace-nowrap text-center"
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
        {/* Affiliate Commissions Panel */}
        <div className="bg-white shadow rounded-lg pt-2 px-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Affiliate Commissions
          </h2>
          <ul className="divide-y divide-gray-200">
            <li className="pb-2">Coming Soon!</li>
            {/* {referralLoans.map((bonus, index) => (
              <li
                key={index}
                className="py-2 flex justify-between items-center"
              >
                <span>{bonus.name}</span>
                <span className="text-green-500">${bonus.amount}</span>
              </li>
            ))} */}
          </ul>
        </div>
      </Column>
      <Column col={12}>
        {/* Message Center Panel */}
        <div className="bg-white shadow rounded-lg py-2 p-4">
          <h3 className="text-lg font-semibold text-gray-900">
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
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => closeConfirmModal()}
        onConfirm={confirmModal.onConfirm}
        message={confirmModal.message}
      />
    </PageContainer>
  );
};

export default PartnerPortal;
