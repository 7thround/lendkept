import { PencilSquareIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";

const defaultLoan = {
  id: "1",
  clientName: "John Doe",
  clientPhone: "123-456-7890",
  clientEmail: "johndoe@example.com",
  addressLine1: "123 Main St",
  addressLine2: "Apt 4B",
  city: "New York",
  state: "NY",
  zip: "10001",
  loanType: "Home",
  loanAmount: 250000.0,
  status: "Possible Loan",
  paid: false,
  partnerId: "partner123",
  companyId: "company456",
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const statuses = [
  "Possible Loan",
  "Application Submitted",
  "Credit and Documents",
  "Loan Processing",
  "Underwriting",
  "Loan Funded",
];

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
          {statuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdateClick}
          className="p-2 bg-blue-600 text-white rounded"
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
              {selectedStatus}"?
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
                className="p-2 bg-blue-600 text-white rounded"
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

const LoanTimeline = ({ currentStatus }) => {
  const activeStatusColor = (status: string) =>
    status === "Loan Funded" ? "bg-green-600 " : "bg-blue-600";
  return (
    <div className="flex items-center justify-between space-x-4 p-4 bg-white rounded-lg mb-4 border">
      {statuses.map((status, index) => (
        <div key={index} className="flex flex-col items-center min-w-max">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              index <= statuses.indexOf(currentStatus)
                ? activeStatusColor(status) + " text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`mt-2 text-xs text-center ${
              index <= statuses.indexOf(currentStatus)
                ? "text-blue-600"
                : "text-gray-600"
            }`}
          >
            {status}
          </span>
        </div>
      ))}
    </div>
  );
};

const NotesSection = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      const timestamp = new Date().toLocaleString();
      setNotes([
        ...notes,
        { id: notes.length + 1, author: "You", text: newNote, timestamp },
      ]);
      setNewNote("");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mt-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
      <ul className="space-y-4">
        {notes.map((note, index) => (
          // add pb-4 unless it's the last note
          <li
            key={note.id}
            className={` ${
              index !== notes.length - 1 ? "border-b pb-4" : "pb-2"
            }`}
          >
            <p className="text-gray-800 font-semibold">{note.author}</p>
            <p className="text-gray-600">{note.text}</p>
            <p className="text-gray-500 text-sm">
              {formatDate(note.timestamp)}
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
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

const LoanPage = () => {
  const [loan, setLoan] = useState(defaultLoan);
  const updateStatus = (newStatus) => {
    console.log("Status updated to:", newStatus);
    setLoan({ ...loan, status: newStatus });
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
      addressLine1: loan.addressLine1,
      addressLine2: loan.addressLine2,
      city: loan.city,
      state: loan.state,
      zip: loan.zip,
      loanType: loan.loanType,
      loanAmount: loan.loanAmount,
      status: loan.status,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Updated Values:", formData);
    setIsModalOpen(false);
  };

  const [activities, setActivities] = useState([
    { id: 1, description: "Application submitted", date: "2024-10-01" },
    { id: 2, description: "Credit check completed", date: "2024-10-02" },
    { id: 3, description: "Loan approved", date: "2024-10-03" },
  ]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col flex-grow">
        <div className="flex gap-4">
          <div className="bg-white shadow rounded-lg p-4 flex-grow">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              Loan Details
            </h1>
            <LoanTimeline currentStatus={loan.status} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg ">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Client Information
                  <button
                    onClick={() => openModal("client")}
                    className="text-blue-500"
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
                    className="text-blue-500"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                </h2>
                <p>
                  <strong>Line 1:</strong> {loan.addressLine1}
                </p>
                <p>
                  <strong>Line 2:</strong> {loan.addressLine2}
                </p>
                <p>
                  <strong>City:</strong> {loan.city}
                </p>
                <p>
                  <strong>State:</strong> {loan.state}
                </p>
                <p>
                  <strong>ZIP:</strong> {loan.zip}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Loan Details
                  <button
                    onClick={() => openModal("loan")}
                    className="text-blue-500"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                </h2>
                <p>
                  <strong>Type:</strong> {loan.loanType}
                </p>
                <p>
                  <strong>Amount:</strong> ${loan.loanAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {loan.status}
                </p>
                <p>
                  <strong>Paid:</strong> {loan.paid ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Partner & Company
                </h2>
                <p>
                  <strong>Partner ID:</strong> {loan.partnerId}
                </p>
                <p>
                  <strong>Company ID:</strong> {loan.companyId}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:w-1/3">
            {/* Status Panel */}
            <UpdateStatusPanel
              currentStatus={loan.status}
              updateStatus={updateStatus}
            />
            {/* Activity Log */}
            <div className="bg-white shadow rounded-lg p-4 mt-4 h-full">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 pb-2">
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
                          {formatDate(activity.date)}
                        </span>
                      </li>
                      {index !== activities.length - 1 && (
                        <hr className="border-gray-200 my-2" />
                      )}
                    </>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <NotesSection />
      </div>
      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit {editSection}</h2>
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
                  <input
                    type="text"
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    placeholder="Loan Type"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
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
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
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

export default function LoanPageWrapper() {
  return <LoanPage />;
}
