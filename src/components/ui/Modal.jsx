export default function Modal({ title, onClose, children, size = "md" }) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="font-heading font-bold text-xl text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content — no overflow, grows with content */}
        <div className="px-8 py-6">
          {children}
        </div>

      </div>
    </div>
  );
}