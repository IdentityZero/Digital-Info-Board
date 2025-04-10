import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { LINKSV2 } from "../constants/linksv2";
import { ToastContainer } from "react-toastify";

import { useAuth } from "../context/AuthProvider";
import { logoLg } from "../assets";

import DashboardTopbar from "../components/nav/DashboardTopbar";

import DashboardSidebarv2 from "../components/nav/DashboardSidebarv2";
import DashboardMobileSidebarv2 from "../components/nav/DashboardMobileSidebarv2";

import NotificationProvider from "../context/Notification";

const DashboardLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { user } = useAuth();

  const USER_LINKS_V2 = user?.is_admin
    ? LINKSV2
    : LINKSV2.filter((link) => !link.adminOnly);

  useEffect(() => {
    const img = new Image();
    img.src = logoLg;
    img.onload = () => setBackgroundImage(logoLg);
  }, [logoLg]);

  return (
    <NotificationProvider>
      <div className="flex min-h-screen max-w-screen-2xl mx-auto lg:flex-row flex-col">
        <div className="sticky min-w-fit top-0 h-screen bg-[#F8F9FA] text-black z-50 hover:overflow-y-auto hover:overflow-x-visible overflow-hidden custom-scrollbar max-lg:hidden">
          <DashboardSidebarv2
            menuData={USER_LINKS_V2.filter((link) => !link.mobileOnly)}
          />
        </div>
        <div className="lg:hidden flex">
          {/* <DashboardMobileSidebar links={USER_LINKS} /> */}
          <DashboardMobileSidebarv2 menuData={USER_LINKS_V2} />
        </div>

        <main className="flex-1 pl-0 max-w-full overflow-hidden">
          <div className="hidden lg:block">
            {/* Topbar */}
            <DashboardTopbar />
          </div>
          <div className="min-h-[calc(100vh-80px)]">
            <div
              className="fixed lg:top-[80px]  inset-0 h-[calc(100vh-80px)] bg-contain bg-center bg-no-repeat opacity-10 blur-sm -z-10"
              style={{
                backgroundImage: `url(${backgroundImage})`,
              }}
            />
            <Outlet />
          </div>
        </main>
        <ToastContainer />
      </div>
    </NotificationProvider>
  );
};

export default DashboardLayout;
