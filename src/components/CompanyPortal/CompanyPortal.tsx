import { TrashIcon } from "@heroicons/react/20/solid";
import { User } from "@prisma/client";
import { useState } from "react";
import { CompanyData } from "../../../types";
import { copyToClipboard } from "../../utils";
import ConfirmationModal from "../common/ConfirmationModal";
import { Column, PageContainer } from "../Layout/PageParts";
import LoanAdminsPanel from "../LoanAdminsPanel";
import LoansTable from "../LoansTable";

const CompanyPortal = ({
  company,
  loanAdmins,
}: {
  company: CompanyData;
  loanAdmins: User[];
}) => {
  const { partners } = company;
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([
    "Welcome to our loan service!",
  ]);
  const handleSendMessage = () => {
    setMessageHistory([...messageHistory, message]);
    setMessage("");
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

  const handleDeletePartner = async (id) => {
    const res = await fetch(`/api/partners/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Partner deleted successfully");
      window.location.reload();
    }
  };

  const confirmDeletePartner = (id) => {
    setConfirmModal({
      isOpen: true,
      onConfirm: () => {
        handleDeletePartner(id);
        closeConfirmModal();
      },
      message: "Are you sure you want to delete this partner?",
    });
  };

  const [copyPartnerText, setCopyPartnerText] = useState<String | JSX.Element>(
    "Partner Signup Link"
  );
  const handleCopyPartnerLink = () => {
    copyToClipboard(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${company.slug}/register`
    );
    setCopyPartnerText("Link Copied!");
    setTimeout(() => setCopyPartnerText("Partner Signup Link"), 1000);
  };

  return (
    <PageContainer>
      <Column col={8}>
        <LoansTable company={company} />
      </Column>
      <Column col={4}>
        {/* Referred Partners Panel */}
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2 px-4 pt-2">
            <h2 className="text-xl font-semibold text-gray-900">Partners</h2>
            <div>
              <button
                onClick={handleCopyPartnerLink}
                className="bg-[#e74949] text-white my-1 py-1 px-3 rounded-lg text-sm"
              >
                {copyPartnerText}
              </button>
            </div>
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
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners?.length ? (
                  partners.map((partner) => (
                    <tr key={partner.id}>
                      <td className="py-3 px-4 whitespace-nowrap max-w-36 truncate">
                        {partner.name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap max-w-36 truncate">
                        {partner.email.toLocaleLowerCase()}
                      </td>
                      <td className="text-center py-2 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => confirmDeletePartner(partner.id)}
                          >
                            <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-900" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-2 px-4 whitespace-nowrap text-center"
                      colSpan={3}
                    >
                      <div>No referred partners yet</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Loan Admins Panel */}
        <LoanAdminsPanel company={company} loanAdmins={loanAdmins} />
      </Column>
      {/* Message Center Panel */}
      <Column col={12}>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Message Center
          </h2>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2"
            rows={5}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            className="mt-2 bg-[#e74949] text-white py-2 px-4 rounded-lg"
            onClick={handleSendMessage}
          >
            Send Message
          </button>
          <h3 className="text-xl font-semibold text-gray-900 mt-4 ">
            Message History
          </h3>
          <ul className="divide-y divide-gray-200">
            {messageHistory.map((msg, index) => (
              <li
                key={index}
                className="py-2 flex justify-between items-center"
              >
                <span>{msg}</span>
                <div>
                  <button className="text-[#e74949] hover:text-blue-900 mr-2">
                    Edit
                  </button>
                  <button className="text-[#e74949] hover:text-blue-900">
                    Delete
                  </button>
                </div>
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

export default CompanyPortal;
