import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Full-width header */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar and page content */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="min-h-[calc(100vh-4rem)] min-w-0 p-4 md:ml-64 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
