const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  children = null,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg mb-4">{message}</h3>
        {children}
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

export default ConfirmationModal;
