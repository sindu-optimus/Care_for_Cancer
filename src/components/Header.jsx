import { useAuth } from "../context/AuthContext";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="h-20 bg-white border-b border-gray-300 flex items-center justify-center relative">
      <h1 className="text-3xl font-bold text-primary">
        Care for Cancer
      </h1>

      <div className="absolute right-8 flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="font-semibold">
            {`${user?.firstName || ""} ${user?.lastName || ""}`}
          </p>        
        </div>

        <HiOutlineUserCircle
          size={40}
          
        />
      </div>
    </header>
  );
}