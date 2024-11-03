import axios from "axios";
import { useState } from "react";
import { DEFAULT_PASSWORD } from "../constants";
import ConfirmationModal from "./common/ConfirmationModal";

const LoanAdminsPanel = ({ company, loanAdmins }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    onConfirm: () => {},
    message: null,
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

  const confirmDeleteUser = (id, name) => {
    setConfirmModal({
      isOpen: true,
      onConfirm: () => {
        handleDeleteUser(id);
        closeConfirmModal();
      },
      message: (
        <p>
          Are you sure you want to delete <strong>{name}</strong>?
        </p>
      ),
    });
  };

  return (
    <div className="bg-white shadow rounded-lg mt-4">
      <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col flex-grow mt-4">
        <div className="flex items-center justify-between mb-2 pt-2 px-4">
          <h2 className="text-xl font-semibold text-gray-900">Loan Officers</h2>
          <button
            className="bg-[#e74949] text-white my-1 py-1 px-3 rounded-lg text-sm"
            onClick={() => setModalOpen(true)}
          >
            New Officer
          </button>
        </div>
        <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loanAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td className="py-3 px-4 whitespace-nowrap">{admin.name}</td>
                  <td className="text-center py-2 px-4 whitespace-nowrap">
                    <button
                      className="text-[#e74949] hover:brightness-90"
                      onClick={() => confirmDeleteUser(admin.id, admin.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

export default LoanAdminsPanel;
