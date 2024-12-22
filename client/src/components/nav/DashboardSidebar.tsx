import { createContext, useContext, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

import { LinksType } from "../../types/UiTypes";
import { logo } from "../../assets";

const SideBarContext = createContext<{ expanded: boolean } | undefined>(
  undefined
);

const DashboardSidebar = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <nav className="h-full flex flex-col border-r shadow-sm min-w-fit">
      <div className="p-4 flex justify-between items-center border-b border-white">
        <div
          className={`flex flex-row gap-2 overflow-hidden transition-all h-12 ${
            expanded ? "w-full" : "w-0"
          }`}
        >
          <img
            src={logo}
            alt="logo"
            className={`overflow-hidden transition-all  h-12 `}
          />
          <p className="font-bold">
            Computer <br /> Engineering
          </p>
        </div>
        <button
          className=" hover:bg-[#0B3536] rounded-lg p-1.5"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      <SideBarContext.Provider value={{ expanded }}>
        <ul>{children}</ul>
      </SideBarContext.Provider>
    </nav>
  );
};

const SidebarTooltip = ({ label }: { label: string }) => {
  return (
    <div className="absolute rounded-sm text-xs text-black z-50 capitalize p-0.5 bg-[#9DC3E7] invisible -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 hover:hidden">
      {label}
    </div>
  );
};

const SidebarItem = ({ link }: { link: LinksType }) => {
  const context = useContext(SideBarContext);

  if (!context) {
    throw new Error("SomeComponent must be used within a SideBarProvider");
  }

  const { expanded } = context;

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (link.label !== "log out") return;
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      e.preventDefault();
    }
  };

  const special_cases: string[] = ["upload content", "contents", "profile"];

  return (
    <li className="relative group">
      <NavLink
        onClick={handleLogoutClick}
        to={link.to}
        end={!special_cases.includes(link.label)}
        className={({ isActive }) =>
          `capitalize p-3 pl-6 mb-2 flex h-14 flex-row items-center gap-3 hover:bg-lightBlue-500 active:bg-lightBlue-600 ${
            isActive && "font-bold bg-lightBlue"
          } ${isActive && expanded && "rounded-tr-full rounded-br-full"}`
        }
      >
        {link.icon && <link.icon />}
        <span
          className={`overflow-hidden transition-all  ${
            expanded ? "w-full" : "w-0"
          }`}
        >
          {link.label}
        </span>
      </NavLink>
      {!expanded && <SidebarTooltip label={link.label} />}
    </li>
  );
};

export { DashboardSidebar as default, SidebarItem };
