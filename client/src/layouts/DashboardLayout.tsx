import { Outlet } from "react-router-dom";

import { LINKS } from "../constants";
import DashboardSidebar, {
  SidebarItem,
} from "../components/nav/DashboardSidebar";
import { ToastContainer } from "react-toastify";

import { logoLg } from "../assets";

import DashboardMobileSidebar from "../components/nav/DashboardMobileSidebar";
import DashboardTopbar from "../components/nav/DashboardTopbar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";

const DashboardLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { user } = useAuth();

  const USER_LINKS = user?.is_admin
    ? LINKS.protected
    : LINKS.protected.filter((link) => !link.adminOnly);

  useEffect(() => {
    const img = new Image();
    img.src = logoLg;
    img.onload = () => setBackgroundImage(logoLg);
  }, [logoLg]);

  return (
    <div className="flex min-h-screen max-w-screen-2xl lg:flex-row flex-col ">
      <div className="sticky min-w-fit top-0 h-screen bg-darkTeal z-50 text-white hover:overflow-y-auto overflow-hidden custom-scrollbar max-lg:hidden">
        <DashboardSidebar>
          {USER_LINKS.map((link) => {
            if (!user?.is_admin && link.adminOnly) return null;

            return <SidebarItem key={link.label} link={link} />;
          })}
        </DashboardSidebar>
      </div>
      <div className="lg:hidden flex">
        <DashboardMobileSidebar links={USER_LINKS} />
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
  );
};

export default DashboardLayout;
