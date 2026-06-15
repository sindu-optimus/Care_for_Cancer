import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function TableActions({
  onEdit,
  onDelete,
  showDelete = true, 
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onEdit}
        className="p-2 rounded-lg text-primary hover:bg-blue-50 transition-colors cursor-pointer"
      >
        <FiEdit2 size={16} />
      </button>

      {showDelete && ( 
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <RiDeleteBin6Line size={16} />
        </button>
      )}
    </div>
  );
}