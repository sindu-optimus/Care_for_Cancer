import { useAuth } from "../context/AuthContext";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { MdMenu } from "react-icons/md";

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <header className="relative shrink-0 min-h-16 md:min-h-20 bg-white border-b border-gray-300 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-primary"
        aria-label="Open navigation"
      >
        <MdMenu size={24} />
      </button>

      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary truncate">
        Care for Cancer
      </h1>

      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="hidden sm:block text-right min-w-0">
          <p className="text-sm font-medium text-gray-600">Welcome back,</p>
          <p className="font-semibold truncate max-w-40 lg:max-w-56 text-text">
            {displayName || "User"}
          </p>        
        </div>

        <HiOutlineUserCircle
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-text"
        />
      </div>
    </header>
  );
}
