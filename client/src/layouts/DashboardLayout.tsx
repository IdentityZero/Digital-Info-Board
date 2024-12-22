import { Outlet } from "react-router-dom";

import { LINKS } from "../constants";
import DashboardSidebar, {
  SidebarItem,
} from "../components/nav/DashboardSidebar";
import DashboardMobileSidebar from "../components/nav/DashboardMobileSidebar";
import DashboardTopbar from "../components/nav/DashboardTopbar";

const PROTECTED_LINKS = LINKS.protected;

const DashboardLayout = () => {
  return (
    // Sidebar
    <div className="flex min-h-screen lg:flex-row flex-col bg-yellowishBeige">
      <div className="sticky min-w-fit top-0 h-screen bg-darkTeal z-50 text-white hover:overflow-y-auto overflow-hidden custom-scrollbar max-lg:hidden">
        <DashboardSidebar>
          {PROTECTED_LINKS.map((link) => {
            return <SidebarItem key={link.label} link={link} />;
          })}
        </DashboardSidebar>
      </div>
      <div className="lg:hidden flex">
        <DashboardMobileSidebar links={PROTECTED_LINKS} />
      </div>

      <main className="flex-1 pl-0 max-w-full overflow-hidden">
        <div className="hidden lg:block">
          {/* Topbar */}
          <DashboardTopbar />
        </div>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
