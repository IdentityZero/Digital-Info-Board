import { NavLink } from "react-router-dom";

import { type LinksType } from "../../types/UiTypes";

type TopbarProps = {
  links: LinksType[];
};

const Topbar = ({ links }: TopbarProps) => {
  return (
    <nav className="flex gap-2">
      {links.map((link) => (
        <NavLink
          key={link.label}
          to={link.to}
          end={true}
          className={({ isActive }) => `capitalize ${isActive && "font-bold"}`}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};
export default Topbar;
