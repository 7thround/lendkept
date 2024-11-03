import { useState } from "react";
import { LoanStatusLabels } from "../constants";

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
          className="p-2 bg-[#e74949] text-white rounded hover:brightness-110"
        >
          Update
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
            <h4 className="text-xl font-bold mb-2">Confirm Status Update</h4>
            <p className="mb-4">
              Are you sure you want to update the loan status to{" "}
              <strong>{LoanStatusLabels[selectedStatus]}</strong>?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleConfirmUpdate}
                className="px-4 py-2 bg-[#e74949] text-white rounded hover:brightness-110"
                aria-label="Confirm"
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border-1 border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                aria-label="Cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateStatusPanel;
