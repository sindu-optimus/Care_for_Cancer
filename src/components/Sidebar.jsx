import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { MdOutlineTrackChanges, MdKeyboardArrowRight, MdKeyboardArrowDown, MdClose } from "react-icons/md";
import { FaRegUser, FaSearch, FaSignOutAlt, FaRegCalendarAlt, FaRegQuestionCircle, FaUserMd, FaHandshake, } from "react-icons/fa";
import { HiOutlineDocumentReport, HiOutlineClipboard } from "react-icons/hi";
import { RiListCheck2 } from "react-icons/ri";
import { BsGrid } from "react-icons/bs";
import { FiMap } from "react-icons/fi";

import logo from "../assets/optimus-logo.png";

const menuItems = [
  { icon: FaSearch, label: "Search Patient", path: "/patient/search-patient" },
  { icon: BsGrid, label: "Dashboard", path: "/dashboard" },
  {
    icon: FaRegCalendarAlt,
    label: "MDT",
    subItems: [
      { icon: FaHandshake,  label: "Meetings",  path: "/mdt/meetings" },
    ],
  },
  { icon: HiOutlineDocumentReport, label: "Reports",    path: "/reports" },
  { icon: MdOutlineTrackChanges,   label: "Tracking",   path: "/tracking" },
  { icon: FaRegUser,               label: "Admin",      
    subItems: [
      { icon: RiListCheck2, label: "MDT List", path: "/admin/mdtList" },
      { icon: FaUserMd,     label: "Clinician", path: "/admin/clinician" },
      { icon: FiMap,     label: "Mapping", path: "/admin/mapping" },
    ],
  }, 
  { icon: HiOutlineClipboard,      label: "Interfaces", path: "/interfaces" },
  { icon: FaRegQuestionCircle,     label: "Help",       path: "/help" },
];

export default function Sidebar({ isOpen = false, onClose }) {
  const [openItems, setOpenItems] = useState(() => {
  const stored = localStorage.getItem("sidebarOpenItems");
    return stored ? JSON.parse(stored) : {};
  });

  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleSignOut = () => {
    // Clear any auth tokens/session here if needed
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sidebarOpenItems");
    localStorage.removeItem("user");
    logout(); 
    navigate("/");
  };

  const toggleItem = (label) => {
    setOpenItems((prev) => {
      const updated = { ...prev, [label]: !prev[label] };
      localStorage.setItem("sidebarOpenItems", JSON.stringify(updated)); 
      return updated;
    });
  };

  return (
    <>
    <div
      className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-gray-300 flex flex-col transition-transform duration-200 lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-20 flex items-center px-8 border-b border-gray-300">
        <div className="absolute top-2 left-4">
          <img src={logo} alt="Optimus-logo" className="h-14 w-auto" />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Close navigation"
        >
          <MdClose size={24} />
        </button>
      </div>

      <div className="flex-1 px-3 pt-4 overflow-y-auto">
        {menuItems.map((item) => {
          const hasSubItems = item.subItems?.length > 0;
          const isOpen = openItems[item.label];

          return (
            <div key={item.label}>
              {/* Main Item */}
              {hasSubItems ? (
                <div
                  onClick={() => toggleItem(item.label)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-200 text-text rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isOpen
                    ? <MdKeyboardArrowDown size={18} />
                    : <MdKeyboardArrowRight size={18} />
                  }
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 cursor-pointer
                    ${isActive
                      ? "bg-primary text-white font-semibold rounded-lg"
                      : "hover:bg-slate-200 text-text rounded-lg"
                    }`
                  }
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </NavLink>
              )}

              {/* Sub Items */}
              {hasSubItems && isOpen && (
                <div className="ml-4 mb-1">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.label}
                      to={sub.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-md cursor-pointer rounded-lg ml-2
                        ${isActive
                          ? "bg-primary text-white font-semibold"
                          : "hover:bg-slate-200 text-text"
                        }`
                      }
                    >
                      <sub.icon size={18} />
                      <span>{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-300 px-8 py-4">
        <button
          onClick={handleSignOut}  
          className="flex items-center gap-4 text-lg text-text"
        >
          <FaSignOutAlt />
          Sign Out
        </button>
      </div>
    </aside>
    </>
  );
}
