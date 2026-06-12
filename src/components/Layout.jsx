import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#EAF0FB] overflow-hidden">
        <Sidebar />
        
        <div className="flex flex-col flex-1 min-w-0">
            <Header />

            <main className="flex-1 overflow-y-auto">
                <Outlet /> 
            </main>

            <Footer />
        </div>
    </div>
  );
}