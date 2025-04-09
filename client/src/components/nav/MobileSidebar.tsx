import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import { logo } from "../../assets";
import { LinksType } from "../../types/UiTypes";
import { NavLink } from "react-router-dom";

type MobileSidebarProps = {
  links: LinksType[];
};

const MobileSidebar = ({ links }: MobileSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative w-full">
      <div className="bg-white border-b w-full flex flex-row justify-between items-center p-2">
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <button className="p-4 text-2xl" onClick={handleToggle}>
          <FaBars />
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80 backdrop-blur-sm text-black transform ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-6 bg-white h-full max-w-[400px]">
          <div className="flex flex-row justify-between items-center">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <button className="t text-xl mb-4" onClick={handleToggle}>
              <FaTimes />
            </button>
          </div>
          <ul className="mt-2 h-full max-h-[calc(100vh-80px)] flex flex-col justify-between overflow-auto">
            <div className="flex flex-col gap-2">
              {links.map((link) => {
                if (link.label === "login" || link.label === "sign up")
                  return null;

                return (
                  <li key={link.label}>
                    <NavLink
                      to={link.to}
                      end={true}
                      className={({ isActive }) =>
                        `capitalize ${
                          isActive
                            ? "font-bold bg-blue-100 text-blue-500"
                            : "font-semibold text-gray-400"
                        } block p-4 text-sm hover:bg-blue-50 hover:text-blue-600 rounded`
                      }
                      onClick={handleToggle}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </div>
            <div className="pb-4">
              <NavLink
                className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold  bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-xl"
                to="/login"
                onClick={handleToggle}
              >
                Login
              </NavLink>
              <NavLink
                className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl"
                to="/signup"
                onClick={handleToggle}
              >
                Sign Up
              </NavLink>
              <p className="my-4 text-xs text-center text-gray-400">
                <span>Powered by Computer Engineering Students.</span>
              </p>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default MobileSidebar;
