import { useState } from "react";
import { LoanStatusLabels } from "../constants";
import ConfirmationModal from "./common/ConfirmationModal";

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
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedStatus(currentStatus);
            setIsModalOpen(false);
          }}
          onConfirm={handleConfirmUpdate}
          message={
            <p>
              Are you sure you want to update the status to{" "}
              <strong>{LoanStatusLabels[selectedStatus]}</strong>?
            </p>
          }
        />
      )}
    </div>
  );
};

export default UpdateStatusPanel;
