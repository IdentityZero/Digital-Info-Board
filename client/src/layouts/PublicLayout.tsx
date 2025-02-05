import { Outlet } from "react-router-dom";

import PublicTopbar from "../components/nav/PublicTopbar";
import MobileSidebar from "../components/nav/MobileSidebar";
import { LINKS } from "../constants";
import Footer from "../components/Footer";

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
      <main className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};
export default PublicLayout;
