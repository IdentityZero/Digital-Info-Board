import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

import { logo } from "../../assets";
import { LinksType } from "../../types/UiTypes";
import { NavLink } from "react-router-dom";
import { LINKS_WITH_CHILDREN } from "../../constants/links";

type DashboardMobileSidebarProps = {
  links: LinksType[];
};

const DashboardMobileSidebar = ({ links }: DashboardMobileSidebarProps) => {
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

  const handleNavLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    label: string
  ) => {
    setIsExpanded(!isExpanded);

    if (label === "log out") {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (!confirmLogout) {
        e.preventDefault();
      }
    }
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
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80 backdrop-blur-sm text-white transform ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-6 bg-darkTeal h-full w-[400px]">
          <div className="flex flex-row justify-between items-center mb-4">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <button className="t text-xl mb-4" onClick={handleToggle}>
              <FaTimes />
            </button>
          </div>
          <ul className="h-full max-h-[calc(100vh-80px)] flex flex-col justify-between overflow-auto custom-scrollbar">
            <div className="flex flex-col gap-2">
              {links.map((link) => {
                if (link.label === "login" || link.label === "sign up")
                  return null;

                return (
                  <li key={link.label}>
                    <NavLink
                      to={link.to}
                      end={!LINKS_WITH_CHILDREN.includes(link.label)}
                      className={({ isActive }) =>
                        `capitalize p-3 pl-6 flex h-14 flex-row items-center gap-3 hover:bg-lightBlue-500 active:bg-lightBlue-600 ${
                          isActive && "font-bold bg-lightBlue"
                        } ${
                          isActive &&
                          isExpanded &&
                          "rounded-tr-full rounded-br-full"
                        }`
                      }
                      onClick={(e) => handleNavLinkClick(e, link.label)}
                    >
                      {link.icon && <link.icon />}
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default DashboardMobileSidebar;
