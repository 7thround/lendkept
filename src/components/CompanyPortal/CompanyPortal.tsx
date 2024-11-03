import { useEffect, useState } from "react";
import { EyeIcon, LinkIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { Column, FullScreenLoader, PageContainer } from "../Layout/PageParts";
import { Company, Partner, User } from "@prisma/client";
import { DEFAULT_PASSWORD, LoanStatusLabels } from "../../constants";
import axios from "axios";
import { copyToClipboard } from "../../utils";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black py-1 px-3 rounded-lg mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#e74949] text-white py-1 px-3 rounded-lg"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const LoanAdminsPanel = ({ company, loanAdmins }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
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

  const handleCreateUser = async () => {
    try {
      const response = await axios.post("/api/users", {
        name: userName,
        email: userEmail,
        password: DEFAULT_PASSWORD,
        role: "LOAN_ADMIN",
        companyId: company.id,
      });

      if (response.status === 201) {
        console.log("User created successfully:", response.data);
        alert("User created successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setModalOpen(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`/api/users/${id}`);

      if (response.status === 204) {
        console.log("User deleted successfully:", response.data);
        alert("User deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const confirmDeleteUser = (id) => {
    setConfirmModal({
      isOpen: true,
      onConfirm: () => {
        handleDeleteUser(id);
        closeConfirmModal();
      },
      message: "Are you sure you want to delete this user?",
    });
  };

  return (
    <div className="bg-white shadow rounded-lg mt-4">
      <div className="flex items-center justify-between mb-2 pt-2 px-4">
        <h2 className="text-xl font-semibold text-gray-900">Loan Officers</h2>
        <button
          className="bg-[#e74949] text-white my-1 py-1 px-3 rounded-lg text-sm"
          onClick={() => setModalOpen(true)}
        >
          New Officer
        </button>
      </div>
      <ul className="divide-y divide-gray-200 px-4">
        {loanAdmins.map((admin) => (
          <li key={admin.id} className="py-2 flex justify-between items-center">
            <span>{admin.name}</span>
            <div>
              <button
                className="text-[#e74949] hover:text-blue-900"
                onClick={() => confirmDeleteUser(admin.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Admin</h3>
            <input
              type="text"
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border mb-2 p-2 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="border mb-4 p-2 w-full"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black py-1 px-3 rounded-lg mr-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#e74949] text-white py-1 px-3 rounded-lg"
                onClick={handleCreateUser}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        message={confirmModal.message}
      />
    </div>
  );
};
const CompanyPortal = ({
  partners,
  company,
  loanAdmins,
}: {
  partners: Partner[];
  company: Company;
  loanAdmins: User[];
}) => {
  const router = useRouter();

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

  const handleDeleteLoan = async (id) => {
    const res = await fetch(`/api/loans/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Loan deleted successfully");
    }
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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [referredByFilter, setReferredByFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/loans?search=${search}&status=${statusFilter}&referredBy=${referredByFilter}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`
      );
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [search, statusFilter, referredByFilter, sortColumn, sortDirection]);

  const [copyPartnerText, setCopyPartnerText] = useState<String | JSX.Element>(
    "Partner Link"
  );
  const handleCopyPartnerLink = () => {
    copyToClipboard(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${company.slug}/register`
    );
    setCopyPartnerText("Link Copied!");
    setTimeout(() => setCopyPartnerText("Partner Link"), 300);
  };

  return (
    <PageContainer>
      {loading && <FullScreenLoader />}
      <Column col={8}>
        {/* My Loans Panel */}
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col flex-grow">
          <div className="flex px-4 py-2 justify-between items-center overflow-auto gap-2">
            <h2 className="text-xl font-semibold text-gray-900 shrink-0">
              Loans
            </h2>
            <div className="flex items-center">
              <input
                className="border border-gray-300 rounded-lg p-1 px-3"
                placeholder="Search by address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="border border-gray-300 rounded-lg p-1 px-3 ml-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {Object.keys(LoanStatusLabels).map((status) => (
                  <option key={status} value={status}>
                    {LoanStatusLabels[status]}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded-lg p-1 px-3 ml-2"
                value={referredByFilter}
                onChange={(e) => setReferredByFilter(e.target.value)}
              >
                <option value="">All Partners</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.name}>
                    {partner.name}
                  </option>
                ))}
              </select>
              <button
                className="border border-[#e74949] text-[#e74949] py-1 px-3 rounded-lg ml-2"
                onClick={() => router.push(`${company.slug}/new-loan`)}
              >
                New Loan
              </button>
            </div>
          </div>
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
                    Referred By
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.length ? (
                  loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {loan.address.addressLine1}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        ${loan.loanAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {LoanStatusLabels[loan.status]}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-center">
                        {/* @ts-ignore */}
                        {loan.partner ? loan.partner.name : "-"}
                      </td>
                      <td className="text-center py-2 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setLoading(true);
                              router.push(`/loans/${loan.id}`);
                            }}
                          >
                            <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-900" />
                          </button>
                          <button onClick={() => confirmDeleteLoan(loan.id)}>
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
                      colSpan={5}
                    >
                      <div>
                        {loans.length
                          ? ""
                          : loans.length
                          ? "No loans found"
                          : "No loans yet"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
                {partners.length ? (
                  partners.map((partner) => (
                    <tr key={partner.id}>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {partner.name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
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
