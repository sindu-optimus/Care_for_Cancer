import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { MdOutlineTrackChanges, MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { FaRegUser, FaSearch, FaSignOutAlt, FaRegCalendarAlt, FaRegQuestionCircle, FaUserMd, FaHandshake, } from "react-icons/fa";
import { HiOutlineDocumentReport, HiOutlineClipboard } from "react-icons/hi";
import { RiListCheck2 } from "react-icons/ri";
import { BsGrid } from "react-icons/bs";
import { FiMap } from "react-icons/fi";

import logo from "../assets/optimus-logo.png";

const menuItems = [
  { icon: FaSearch, label: "Search Patient", path: "/search-patient" },
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

export default function Sidebar() {
  const [openItems, setOpenItems] = useState(() => {
  const stored = localStorage.getItem("sidebarOpenItems");
    return stored ? JSON.parse(stored) : {};
  });

  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleSignOut = () => {
    // Clear any auth tokens/session here if needed
    // localStorage.removeItem("token");
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
    <div className="w-64 relative bg-white border-r border-gray-300 flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-gray-300">
        <div className="absolute top-2 left-4">
          <img src={logo} alt="Optimus-logo" className="h-14 w-auto" />
        </div>
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
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-200 text-slate-700 rounded-lg"
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
    </div>
  );
}