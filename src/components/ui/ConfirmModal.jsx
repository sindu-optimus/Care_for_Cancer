import Modal from "./Modal";

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      size="sm"  // ← add this
    >
      <p className="text-slate-600 mb-6">
        {message}
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-text text-base font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-base font-medium hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}