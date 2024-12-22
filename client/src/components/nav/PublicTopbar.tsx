import { NavLink } from "react-router-dom";

import { type LinksType } from "../../types/UiTypes";
import { logo } from "../../assets";

type TopbarProps = {
  links: LinksType[];
};

const PublicTopbar = ({ links }: TopbarProps) => {
  return (
    <nav className="w-full h-full flex items-center justify-between px-8 bg-cyanBlue border-b drop-shadow-md ">
      <img src={logo} alt="Logo" className="h-12 w-12" />
      <div className="flex gap-4">
        {links.map((link) => {
          if (link.label === "login" || link.label === "sign up") return null;

          return (
            <NavLink
              key={link.label}
              to={link.to}
              end={true}
              className={({ isActive }) =>
                `capitalize  text-gray-800 ${
                  isActive &&
                  "font-bold underline-offset-4 text underline text-black"
                }`
              }
            >
              {link.label}
            </NavLink>
          );
        })}
      </div>
      <div className="flex flex-row gap-2">
        <NavLink
          className="block px-5 py-1 leading-loose text-xs text-center font-semibold  bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-xl"
          to="/login"
        >
          Login
        </NavLink>
        <NavLink
          className="block px-5 py-1 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800  rounded-xl"
          to="/signup"
        >
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
};
export default PublicTopbar;
