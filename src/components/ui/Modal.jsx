import { MdClose } from "react-icons/md";

export default function Modal({ title, onClose, children, size = "md" }) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className={`bg-white rounded-2xl shadow-xl w-full max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] overflow-hidden ${sizeClasses[size]}`}>
        <div className="flex items-center justify-between gap-4 px-2 sm:px-6 py-2 sm:py-3 border-b border-gray-100">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:bg-slate-100 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="px-4 sm:px-8 py-5 sm:py-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
