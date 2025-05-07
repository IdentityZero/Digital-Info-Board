import { Outlet } from "react-router-dom";

import PublicTopbar from "../components/nav/PublicTopbar";
import MobileSidebar from "../components/nav/MobileSidebar";
import { LINKS } from "../constants";
import Footer from "../components/Footer";
import { Suspense } from "react";
import LoadingLazyComponent from "../components/LoadingLazyComponent";

const PUBLIC_LINKS = LINKS.public;

const PublicLayout = () => {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <header className="h-20">
        <div className="w-full h-full lg:block hidden">
          <PublicTopbar links={PUBLIC_LINKS} />
        </div>
        <div className="lg:hidden flex">
          <MobileSidebar links={PUBLIC_LINKS} />
        </div>
      </header>
      <main className="min-h-[calc(100vh-80px)]">
        <Suspense fallback={<LoadingLazyComponent />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};
export default PublicLayout;
