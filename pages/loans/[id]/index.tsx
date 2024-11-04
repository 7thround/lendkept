import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Company, LoanType, Partner, User } from "@prisma/client";
import cookie from "cookie";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { getUser } from "../..";
import prisma from "../../../lib/prisma";
import ConfirmationModal from "../../../src/components/common/ConfirmationModal";
import LoanStatusLabel from "../../../src/components/common/LoanStatusLabel";
import {
  Column,
  FullScreenLoader,
  PageContainer,
} from "../../../src/components/Layout/PageParts";
import LoanAdminPanel from "../../../src/components/LoanAdminPanel";
import LoanDetails from "../../../src/components/LoanDetails";
import LoanTimeline from "../../../src/components/LoanTimeline";
import NotesSection from "../../../src/components/NotesSection";
import UpdateStatusPanel from "../../../src/components/UpdateStatusPanel";
import { LoanTypeLabels } from "../../../src/constants";
import { sendEmail } from "../../../src/utils";
import { fetchLoanDetails } from "../../../src/utils/api";
import { PreLoadedLoanData } from "../../../types";

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  const loan = await fetchLoanDetails(Number(id));
  if (!loan) {
    return {
      notFound: true,
    };
  }
  const availableLoanAdmins = await prisma.user.findMany({
    where: {
      companyId: loan.companyId,
      role: "LOAN_ADMIN",
    },
    select: {
      name: true,
      id: true,
      email: true,
    },
  });

  const { req } = context;
  const cookies = req.headers.cookie;
  const parsedCookies = cookie.parse(cookies || "");
  const token = parsedCookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      preloadedLoan: JSON.parse(JSON.stringify(loan)),
      user: await getUser(token),
      availableLoanAdmins,
    },
  };
};

const LoanPage = ({
  preloadedLoan,
  user,
  availableLoanAdmins,
}: {
  preloadedLoan: PreLoadedLoanData;
  user: User;
  availableLoanAdmins: User[];
}) => {
  const router = useRouter();
  const { partner, company } = preloadedLoan;
  const [loan, setLoan] = useState<PreLoadedLoanData>(preloadedLoan);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSection, setEditSection] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isDeletingLoan, setIsDeletingLoan] = useState(false);
  const fetchLoan = async () => {
    const response = await fetch(`/api/loans/${loan.id}`);
    if (response.ok) {
      const updatedLoan = await response.json();
      setLoan(updatedLoan);
    }
  };
  const deleteLoan = async () => {
    setLoading(true);
    setIsDeletingLoan(true);
    try {
      const response = await fetch(`/api/loans/${loan.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Loan deleted");
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
    setLoading(false);
  };
  const addNote = async (note: {
    text: string;
    loanId: string;
    senderId: string;
    createdAt: Date;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });

      if (response.ok) {
        const newNote = await response.json();
        const recipientList = [
          company as Company,
          partner as Partner,
          assignedOfficer,
        ];
        const sendList = recipientList.filter(
          (recipient) => note.senderId !== recipient.id
        );
        sendList.forEach(async (recipient) => {
          await sendEmail({
            to: recipient.email,
            subject: "New Note Added",
            template: "NewNote",
            payload: { note: newNote, loan },
          });
          console.log(`Email sent to ${recipient.email}`);
        });
        console.log("Note added:", newNote);
        await fetchLoan();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
    setLoading(false);
  };
  const deleteNote = async (noteId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Note deleted");
        await fetchLoan();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
    setLoading(false);
  };
  const handleUpdateLoan = async () => {
    console.log("Updating loan...");
    setLoading(true);
    try {
      const response = await fetch(`/api/loans/${loan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: loan.addressId,
          ...formData,
        }),
      });

      if (response.ok) {
        const updatedLoan = await response.json();
        console.log("Loan updated:", updatedLoan);
        await fetchLoan();
      }
    } catch (error) {
      console.error("Error updating loan:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };
  const handleUpdateBorrowers = async (borrower: "borrower" | "coBorrower") => {
    console.log("Updating borrower...");
    setLoading(true);
    const borrowerId = loan.borrowers[borrower === "borrower" ? 0 : 1].id;
    const borrowerData = {
      firstName: formData[`${borrower}FirstName`],
      lastName: formData[`${borrower}LastName`],
      email: formData[`${borrower}Email`],
      phone: formData[`${borrower}Phone`],
      employer: formData[`${borrower}Employer`],
      position: formData[`${borrower}Position`],
      income: formData[`${borrower}Income`],
      credit: formData[`${borrower}Credit`],
    };
    try {
      const response = await fetch(`/api/borrowers/${borrowerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowerData),
      });

      if (response.ok) {
        const updatedBorrower = await response.json();
        console.log("Borrower updated:", updatedBorrower);
        await fetchLoan();
      } else {
        console.error("Failed to update borrower");
      }
    } catch (error) {
      console.error("Error updating borrower:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };
  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/loans/${loan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...loan,
          status: newStatus,
        }),
      });

      if (response.ok) {
        const updatedLoan = await response.json();
        if (updatedLoan.status === "LOAN_FUNDED") {
          await sendEmail({
            to: partner.email,
            subject: "Your Loan Has Been Funded",
            template: "LoanFunded",
            payload: {},
          });
          console.log(`Email sent to ${partner.email}`);
          await sendEmail({
            to: company.email,
            subject: "A Loan Has Been Funded",
            template: "LoanFunded",
            payload: {},
          });
          console.log(`Email sent to ${company.email}`);
        } else {
          await sendEmail({
            to: partner.email,
            subject: "Loan Status Update",
            template: "LoanStatusUpdated",
            payload: {},
          });
          console.log(`Email sent to ${partner.email}`);
          await sendEmail({
            to: company.email,
            subject: "Loan Status Update",
            template: "LoanStatusUpdated",
            payload: {},
          });
          console.log(`Email sent to ${company.email}`);
        }
        await sendEmail({
          to: updatedLoan.borrowers[0].email,
          subject: "Loan Status Update",
          template: "LoanStatusUpdated",
          payload: {},
        });
        console.log(`Email sent to ${updatedLoan.borrowers[0].email}`);
        console.log("Status updated:", updatedLoan);
        await fetchLoan();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
    setLoading(false);
  };
  const openModal = (section) => {
    setEditSection(section);
    setFormData({
      addressLine1: loan.address.addressLine1,
      addressLine2: loan.address.addressLine2,
      city: loan.address.city,
      state: loan.address.state,
      zip: loan.address.zip,
      loanType: loan.loanType,
      loanAmount: loan.loanAmount,
      status: loan.status,
      paid: loan.paid,
      partnerId: loan.partnerId,
      companyId: loan.companyId,
      loanAdminId: loan.loanAdminId,
      borrowerFirstName: loan.borrowers[0].firstName,
      borrowerLastName: loan.borrowers[0].lastName,
      borrowerPhone: loan.borrowers[0].phone,
      borrowerEmail: loan.borrowers[0].email,
      borrowerEmployer: loan.borrowers[0].employer,
      borrowerPosition: loan.borrowers[0].position,
      borrowerIncome: loan.borrowers[0].income,
      borrowerCredit: loan.borrowers[0].credit,
      coBorrowerFirstName: loan.borrowers[1]?.firstName,
      coBorrowerLastName: loan.borrowers[1]?.lastName,
      coBorrowerPhone: loan.borrowers[1]?.phone,
      coBorrowerEmail: loan.borrowers[1]?.email,
      coBorrowerEmployer: loan.borrowers[1]?.employer,
      coBorrowerPosition: loan.borrowers[1]?.position,
      coBorrowerIncome: loan.borrowers[1]?.income,
      coBorrowerCredit: loan.borrowers[1]?.credit,
    });
    setIsModalOpen(true);
  };
  const handleInputChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const loanLink = `${process.env.NEXT_PUBLIC_BASE_URL}/loans/${loan.id}/read_only?access_code=${loan.accessCode}`;
  const isAdmin = user.role === "COMPANY" || user.role === "LOAN_ADMIN";
  const assignedOfficer = availableLoanAdmins.filter(
    (admin) => admin.id === loan.loanAdminId
  )[0];

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen && e.key === "Enter") {
        editSection === "borrower" || editSection === "coBorrower"
          ? handleUpdateBorrowers(editSection)
          : handleUpdateLoan();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, editSection, formData]);

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

  return (
    <>
      {(!loan || loading) && <FullScreenLoader />}
      <PageContainer>
        <Column col={isAdmin ? 8 : 12}>
          <div className="bg-white shadow rounded-lg p-4 flex-grow">
            <div className="flex justify-between items-center ">
              <h1 className="text-lg font-semibold text-gray-900">
                Loan Details
              </h1>
              <button
                className="px-2 py-1 border border-[#e74949] text-[#e74949] rounded flex items-center space-x-2 text-sm hover:brightness-110"
                onClick={(e) => {
                  navigator.clipboard.writeText(loanLink);
                  (e.target as HTMLButtonElement).textContent = "Copied!";
                  setTimeout(() => {
                    (e.target as HTMLButtonElement).textContent = "Share Link";
                  }, 1000);
                }}
              >
                Share Link
              </button>
            </div>
            <LoanDetails loan={loan} assignedOfficer={assignedOfficer} />
            <div className="text-center font-semibold pb-2 text-xl mt-4">
              Loan Status
            </div>
            <LoanTimeline currentStatus={loan.status} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg ">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Client Information
                </h2>
                <div className="flex gap-4 flex-col">
                  {loan.borrowers?.map((borrower, index) => (
                    <div key={borrower.id}>
                      {borrower.coBorrower && (
                        <p className="text-gray-900">Co-Borrower</p>
                      )}
                      <p>
                        <strong>Name: </strong>
                        {borrower.firstName} {borrower.lastName}
                      </p>
                      <p>
                        <strong>Phone:</strong> {borrower.phone}
                      </p>
                      <p>
                        <strong>Email:</strong> {borrower.email}
                      </p>
                      <p>
                        <strong>Employer:</strong> {borrower.employer}
                      </p>
                      <p>
                        <strong>Position:</strong> {borrower.position}
                      </p>
                      <p>
                        <strong>Income:</strong> $
                        {borrower.income.toLocaleString()}
                      </p>
                      <p>
                        <strong>Credit:</strong> {borrower.credit}
                      </p>
                      {isAdmin && (
                        <button
                          onClick={() =>
                            openModal(
                              `${index === 0 ? "borrower" : "coBorrower"}`
                            )
                          }
                          className="text-[#e74949] mt-2"
                        >
                          <div className="flex items-center gap-1">
                            Edit <PencilSquareIcon className="h-5 w-5" />
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Property Address
                  {isAdmin && (
                    <button
                      onClick={() => openModal("address")}
                      className="text-[#e74949]"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                </h2>
                <p>
                  <strong>Line 1:</strong> {loan.address.addressLine1}
                </p>
                <p>
                  <strong>Line 2:</strong> {loan.address.addressLine2}
                </p>
                <p>
                  <strong>City:</strong> {loan.address.city}
                </p>
                <p>
                  <strong>State:</strong> {loan.address.state}
                </p>
                <p>
                  <strong>ZIP:</strong> {loan.address.zip}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Loan Details
                  {isAdmin && (
                    <button
                      onClick={() => openModal("loan")}
                      className="text-[#e74949]"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                </h2>
                <p>
                  <strong>Type:</strong> {LoanTypeLabels[loan.loanType]}
                </p>
                <p>
                  <strong>Amount:</strong> ${loan.loanAmount.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <LoanStatusLabel status={loan.status} />
                </p>
                <p>
                  <strong>Paid:</strong> {loan.paid ? "Yes" : "No"}
                </p>
                {/* Loan Admins Panel */}
                {isAdmin && (
                  <LoanAdminPanel
                    availableLoanAdmins={availableLoanAdmins}
                    selectedAdmin={
                      availableLoanAdmins.filter(
                        (admin) => admin.id === loan.loanAdminId
                      )[0]
                    }
                    loan={loan}
                  />
                )}
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Partner & Company
                </h2>
                {partner && (
                  <p>
                    <strong>Affiliate Partner:</strong> {partner.name}
                  </p>
                )}
                <p>
                  <strong>Company</strong> {company.name}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              {isAdmin && (
                <button
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      onConfirm: deleteLoan,
                      message: "Are you sure you want to delete this loan?",
                    })
                  }
                  className="text-[#e74949] py-2 px-4 rounded-lg disabled:opacity-70 text-sm hover:underline"
                  disabled={loading}
                >
                  {isDeletingLoan ? "Deleting..." : "Delete this loan"}
                </button>
              )}
            </div>
          </div>
        </Column>
        {isAdmin && (
          <Column col={4}>
            {/* Status Panel */}

            <UpdateStatusPanel
              currentStatus={loan.status}
              updateStatus={updateStatus}
            />

            {/* Activity Log
          <div className="bg-white shadow rounded-lg pt-2 p-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 pb-2">
                Activity Log
              </h2>
              <ul className="space-y-2">
                {activities.map((activity, index) => (
                  <>
                    <li
                      key={activity.id}
                      className="flex justify-between items-start"
                    >
                      <span className="flex-1">{activity.description}</span>
                      <span className="text-gray-500 whitespace-nowrap ml-4">
                        12/24/2021
                      </span>
                    </li>
                    {index !== activities.length - 1 && (
                      <hr className="border-gray-200 my-2" />
                    )}
                  </>
                ))}
              </ul>
            </div>
          </div> */}
          </Column>
        )}
        <Column col={12}>
          <NotesSection
            notes={loan.notes}
            loanId={loan.id}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            sender={user}
          />
        </Column>
      </PageContainer>
      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit {editSection}</h2>
            <div className="space-y-4">
              {editSection === "address" && (
                <>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Address Line 1"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Address Line 2"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="ZIP"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </>
              )}
              {editSection === "loan" && (
                <>
                  <label className="block text-sm text-gray-600">
                    Loan Type
                  </label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    {Object.keys(LoanType).map((type, index) => (
                      <option key={index} value={type}>
                        {LoanType[type]}
                      </option>
                    ))}
                  </select>
                  <label className="block text-sm text-gray-600">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    placeholder="Loan Amount"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </>
              )}
              {editSection === "borrower" && (
                <>
                  <input
                    type="text"
                    name="borrowerFirstName"
                    value={formData.borrowerFirstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="borrowerLastName"
                    value={formData.borrowerLastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="borrowerPhone"
                    value={formData.borrowerPhone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="email"
                    name="borrowerEmail"
                    value={formData.borrowerEmail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    placeholder="Employer"
                    type="text"
                    name="borrowerEmployer"
                    value={formData.borrowerEmployer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <input
                    placeholder="Position"
                    type="text"
                    name="borrowerPosition"
                    value={formData.borrowerPosition}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <input
                    placeholder="Income"
                    type="number"
                    name="borrowerIncome"
                    value={formData.borrowerIncome}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    step="0.01"
                    required
                  />

                  <select
                    name="borrowerCredit"
                    value={formData.borrowerCredit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Credit Rating</option>
                    <option value="EXCELLENT">Excellent (750+)</option>
                    <option value="GOOD">Good (700-749)</option>
                    <option value="FAIR">Fair (650-699)</option>
                    <option value="POOR">Poor (Below 650)</option>
                  </select>
                </>
              )}
              {editSection === "coBorrower" && (
                <>
                  <input
                    type="text"
                    name="coBorrowerFirstName"
                    value={formData.coBorrowerFirstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="coBorrowerLastName"
                    value={formData.coBorrowerLastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="coBorrowerPhone"
                    value={formData.coBorrowerPhone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="email"
                    name="coBorrowerEmail"
                    value={formData.coBorrowerEmail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    placeholder="Employer"
                    type="text"
                    name="coBorrowerEmployer"
                    value={formData.coBorrowerEmployer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    placeholder="Position"
                    type="text"
                    name="coBorrowerPosition"
                    value={formData.coBorrowerPosition}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    placeholder="Income"
                    type="number"
                    name="coBorrowerIncome"
                    value={formData.coBorrowerIncome}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    step="0.01"
                    required
                  />
                  <select
                    name="coBorrowerCredit"
                    value={formData.coBorrowerCredit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Credit Rating</option>
                    <option value="EXCELLENT">Excellent (750+)</option>
                    <option value="GOOD">Good (700-749)</option>
                    <option value="FAIR">Fair (650-699)</option>
                    <option value="POOR">Poor (Below 650)</option>
                  </select>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  editSection === "borrower" || editSection === "coBorrower"
                    ? handleUpdateBorrowers(editSection)
                    : handleUpdateLoan()
                }
                className="bg-[#e74949] text-white py-2 px-4 rounded-lg disabled:opacity-70"
                disabled={loading}
              >
                {editSection === "borrower" || editSection === "coBorrower"
                  ? "Update Borrower"
                  : "Update Loan"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => closeConfirmModal()}
        onConfirm={confirmModal.onConfirm}
        message={confirmModal.message}
      />
    </>
  );
};

export default LoanPage;
