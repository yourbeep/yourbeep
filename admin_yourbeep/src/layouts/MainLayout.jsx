import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashbaord/Sidebar";
import TopBar from "../components/dashbaord/TopBar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-linear-to-b from-gray-50 to-white text-[var(--text)]">
      <div className="flex min-h-screen w-full">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto bg-[#EEEEEE]/15">
            <div className="mx-auto w-full px-5 py-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
