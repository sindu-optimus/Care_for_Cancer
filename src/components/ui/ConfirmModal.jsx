import Modal from "./Modal";

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <Modal title={title} onClose={onClose} size="sm">
      <p className="text-slate-600 mb-6">
        {message}
      </p>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-text text-base font-medium hover:bg-slate-50 transition-colors"
        >
          {cancelText}
        </button>

        <button
          onClick={onConfirm}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-white text-base font-medium hover:opacity-90 transition-colors"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}