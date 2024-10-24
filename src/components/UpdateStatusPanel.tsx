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

export default UpdateStatusPanel;
