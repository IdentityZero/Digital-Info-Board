import { Outlet, NavLink } from "react-router-dom";

import { LINKS } from "../constants";

const PROTECTED_LINKS = LINKS.protected;

const DashboardLayout = () => {
  return (
    <>
      <header>
        <nav className="flex gap-2">
          {PROTECTED_LINKS.map((link) => (
            <NavLink key={link.label} to={link.to} className="capitalize">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default DashboardLayout;
