import { PencilSquareIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import {
  Column,
  PageContainer,
} from "../../../src/components/Layout/PageParts";
import prisma from "../../../lib/prisma";
import { formatDateWithTime } from "../../../src/utils";
import { Company, LoanType, Note, Partner, User } from "@prisma/client";
import { LoanStatusLabels } from "../../../src/constants";
import { getUser } from "../..";
import cookie from "cookie";
import { LoanWithAddress } from "../../../types";

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  const loan = await prisma.loan.findUnique({
    where: { id: Number(id) },
    include: {
      address: true,
    },
  });

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
  const notes = await prisma.note.findMany({
    where: { loanId: Number(id) },
    orderBy: { createdAt: "desc" },
    include: {
      sender: {
        select: {
          name: true,
        },
      },
    },
  });

  // Convert the Date object to a string
  const serializedNotes = notes.map((note) => ({
    ...note,
    createdAt: note.createdAt.toISOString(),
  }));

  let partner = null;
  if (loan.partnerId) {
    partner = await prisma.partner.findUnique({
      where: { id: loan.partnerId },
    });
  }
  const company = await prisma.company.findUnique({
    where: { id: loan.companyId },
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
      loan,
      notes: serializedNotes,
      partner,
      company,
      user: await getUser(token),
      availableLoanAdmins,
    },
  };
};

const LoanAdminsPanel = ({ selectedAdmin, availableLoanAdmins, loan }) => {
  const handleChange = async (e) => {
    const loanAdminId = e.target.value;
    const payload = {
      ...loan,
      loanAdminId,
    };
    console.log("Payload:", payload);
    const response = await fetch(`/api/loans/${loan.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedLoan = await response.json();
      console.log("Loan updated:", updatedLoan);
      window.location.reload();
    } else {
      console.error("Failed to update loan");
    }
  };

  return (
    <div className="mt-2">
      <h3 className="font-semibold mb-1">Assigned Admin</h3>
      <select
        onChange={handleChange}
        className="p-2 border rounded w-full"
        value={selectedAdmin?.id}
      >
        <option value="">Select Loan Admin</option>
        {availableLoanAdmins.map((admin) => (
          <option
            key={admin.id}
            value={admin.id}
            selected={selectedAdmin?.id === admin.id}
          >
            {admin.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const UpdateStatusPanel = ({ currentStatus, updateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    updateStatus(selectedStatus);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Update Loan Status</h3>
      <div className="flex items-center space-x-4">
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="p-2 border rounded w-full"
        >
          {Object.keys(LoanStatusLabels).map((status, index) => (
            <option key={index} value={status}>
              {LoanStatusLabels[status]}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdateClick}
          className="p-2 bg-[#e74949] text-white rounded"
        >
          Update
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h4 className="text-lg font-semibold mb-4">
              Confirm Status Update
            </h4>
            <p>
              Are you sure you want to update the loan status to "
              {LoanStatusLabels[selectedStatus]}"?
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="p-2 bg-[#e74949] text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const loanTimelineStatuses = Object.keys(LoanStatusLabels).slice(0, 5);
const LoanTimeline = ({ currentStatus }) => {
  const activeStatusColor = (status) =>
    status === "LOAN_FUNDED" ? "bg-green-600" : "bg-[#e74949]";
  const inactiveStatuses = ["ON_HOLD", "CANCELLED", "NOT_QUALIFIED"];
  const isInactive = inactiveStatuses.includes(currentStatus);
  if (isInactive) {
    return (
      <div className="flex items-center justify-between space-x-4 p-4 bg-white rounded-lg mb-4 border overflow-x-auto">
        {loanTimelineStatuses.map((status, index) => (
          <div key={index} className="flex flex-col items-center min-w-max">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index <= loanTimelineStatuses.indexOf(currentStatus)
                  ? activeStatusColor(status) + " text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span className={`mt-2 text-xs text-center`}>
              {LoanStatusLabels[status]}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between space-x-4 p-4 bg-white rounded-lg mb-4 border overflow-x-auto">
      {loanTimelineStatuses.map((status, index) => (
        <div key={index} className="flex flex-col items-center min-w-max">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              index <= loanTimelineStatuses.indexOf(currentStatus)
                ? activeStatusColor(status) + " text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          <span className={`mt-2 text-xs text-center`}>
            {LoanStatusLabels[status]}
          </span>
        </div>
      ))}
    </div>
  );
};

const NotesSection = ({ notes, loanId, onAddNote, sender }) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const note = {
        text: newNote,
        loanId: loanId,
        senderId: sender.id,
        createdAt: new Date(),
      };

      // Call the function to add the note
      await onAddNote(note);

      setNewNote("");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg pt-2 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
      <ul className="space-y-4">
        {notes?.map((note, index) => (
          <li
            key={note.id}
            className={` ${
              index !== notes.length - 1 ? "border-b pb-4" : "pb-2"
            }`}
          >
            <p className="text-gray-800 font-semibold">{note.sender.name}</p>
            <p className="text-gray-600">{note.text}</p>
            <p className="text-gray-500 text-sm">
              {formatDateWithTime(note.createdAt)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded focus:outline-none focus:ring"
          rows={3}
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        ></textarea>
        <button
          onClick={handleAddNote}
          className="mt-2 px-4 py-2 bg-[#e74949] text-white rounded hover:bg-[#e74949]"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

const LoanPage = ({
  loan,
  notes,
  partner,
  company,
  user,
  availableLoanAdmins,
}: {
  loan: LoanWithAddress;
  notes: Note[];
  partner: Partner;
  company: Company;
  user: User;
  availableLoanAdmins: User[];
}) => {
  const addNote = async (note) => {
    const response = await fetch(`/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    if (response.ok) {
      const newNote = await response.json();
      window.location.reload();
      console.log("Note added:", newNote);
    }
  };

  const updateStatus = async (newStatus) => {
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
        console.log("Status updated:", updatedLoan);
        window.location.reload();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const [messages, setMessages] = useState([
    { id: 1, text: "Initial message", sender: "Partner" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSection, setEditSection] = useState("");
  const [formData, setFormData] = useState<{
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    loanType: string;
    loanAmount: number;
    status: string;
  }>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    loanType: "",
    loanAmount: 0,
    status: "",
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        id: messages.length + 1,
        text: newMessage,
        sender: "You",
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage("");
    }
  };

  const openModal = (section) => {
    setEditSection(section);
    setFormData({
      clientName: loan.clientName,
      clientPhone: loan.clientPhone,
      clientEmail: loan.clientEmail,
      addressLine1: loan.address.addressLine1,
      addressLine2: loan.address.addressLine2,
      city: loan.address.city,
      state: loan.address.state,
      zip: loan.address.zip,
      loanType: loan.loanType,
      loanAmount: loan.loanAmount,
      status: loan.status,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
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
        window.location.reload();
      } else {
        console.error("Failed to update loan");
      }
    } catch (error) {
      console.error("Error updating loan:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const [activities, setActivities] = useState([
    { id: 1, description: "Application submitted", date: new Date() },
    { id: 2, description: "Credit check completed", date: new Date() },
    { id: 3, description: "Loan approved", date: new Date() },
  ]);

  const loanLink = `${process.env.NEXT_PUBLIC_BASE_URL}/loans/${loan.id}/read_only?access_code=${loan.accessCode}`;

  return (
    <>
      <PageContainer>
        <Column col={8}>
          <div className="bg-white shadow rounded-lg pt-2 p-4 flex-grow">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Loan Details
              </h1>
              <button
                className="px-2 py-1 mt-1 border border-[#e74949] text-[#e74949] rounded-lg flex items-center space-x-2 text-sm"
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
            <div className="text-center font-semibold pb-2">Loan Timeline</div>
            <LoanTimeline currentStatus={loan.status} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg ">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Client Information
                  <button
                    onClick={() => openModal("client")}
                    className="text-[#e74949]"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                </h2>
                <p>
                  <strong>Name:</strong> {loan.clientName}
                </p>
                <p>
                  <strong>Phone:</strong> {loan.clientPhone}
                </p>
                <p>
                  <strong>Email:</strong> {loan.clientEmail}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Property Address
                  <button
                    onClick={() => openModal("address")}
                    className="text-[#e74949]"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
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
                  <button
                    onClick={() => openModal("loan")}
                    className="text-[#e74949]"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                </h2>
                <p>
                  <strong>Type:</strong> {loan.loanType}
                </p>
                <p>
                  <strong>Amount:</strong> ${loan.loanAmount.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {loan.status}
                </p>
                <p>
                  <strong>Paid:</strong> {loan.paid ? "Yes" : "No"}
                </p>
                {/* Loan Admins Panel */}
                {user.role === "COMPANY" && (
                  <LoanAdminsPanel
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
          </div>
        </Column>
        <Column col={4}>
          {/* Status Panel */}
          {["COMPANY", "LOAN_ADMIN"].includes(user.role) && (
            <UpdateStatusPanel
              currentStatus={loan.status}
              updateStatus={updateStatus}
            />
          )}
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
        <Column col={12}>
          <NotesSection
            notes={notes}
            loanId={loan.id}
            onAddNote={addNote}
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
              {editSection === "client" && (
                <>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="Client Name"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    placeholder="Client Phone"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="Client Email"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </>
              )}
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
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#e74949] text-white py-2 px-4 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoanPage;
