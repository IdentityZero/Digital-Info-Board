import { Outlet } from "react-router-dom";

import PublicTopbar from "../components/nav/PublicTopbar";
import MobileSidebar from "../components/nav/MobileSidebar";
import { LINKS } from "../constants";

const PUBLIC_LINKS = LINKS.public;

const PublicLayout = () => {
  return (
    <div className="">
      <header className="h-20">
        <div className="w-full h-full lg:block hidden">
          <PublicTopbar links={PUBLIC_LINKS} />
        </div>
        <div className="lg:hidden flex">
          <MobileSidebar links={PUBLIC_LINKS} />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default PublicLayout;
