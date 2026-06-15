import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SessionTimeout from "../components/SessionTimeout";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SessionTimeout />

      <div className="flex h-screen bg-[#EAF0FB] overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 min-w-0 overflow-y-auto p-6 md:p-6">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
