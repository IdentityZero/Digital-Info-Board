import { Outlet } from "react-router-dom";

import Topbar from "../components/nav/Topbar";
import { LINKS } from "../constants";

const PUBLIC_LINKS = LINKS.public;

const PublicLayout = () => {
  return (
    <>
      <header>
        <Topbar links={PUBLIC_LINKS} />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default PublicLayout;
