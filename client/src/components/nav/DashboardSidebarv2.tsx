import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";

import { logo } from "../../assets";
import { MenuType } from "../../types/Links";

const DashboardSidebarv2 = ({ menuData }: { menuData: MenuType[] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <nav className="h-full flex flex-col border-r shadow-sm min-w-fit">
      <div className="p-4 flex justify-between items-center border-b border-white">
        <div
          className={`flex flex-row gap-2 overflow-hidden transition-all h-12 ${
            isExpanded ? "w-full" : "w-0"
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
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      <ul>
        <MenuList menus={menuData} isExpanded={isExpanded} />
      </ul>
    </nav>
  );
};
export default DashboardSidebarv2;

function MenuList({
  menus,
  isExpanded,
}: {
  menus: MenuType[];
  isExpanded: boolean;
}) {
  return (
    <ul className="border-l border-gray-300 dark:border-gray-600">
      {menus.map((menu) => (
        <MenuItem key={menu.label} menu={menu} isExpanded={isExpanded} />
      ))}
    </ul>
  );
}

function MenuItem({
  menu,
  isExpanded,
}: {
  menu: MenuType;
  isExpanded: boolean;
}) {
  const [isChildrenDisplayed, setIsChildrenDisplayed] = useState(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsChildrenDisplayed(!isChildrenDisplayed);
    if (menu.label !== "log out") return;
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      e.preventDefault();
    }
  };

  return (
    <li className="relative group">
      <NavLink
        end={menu.label === "dashboard"}
        to={menu.to || "#"}
        className={({ isActive }) =>
          `capitalize p-3 pl-6 mb-2 flex h-14 flex-row items-center gap-3 hover:bg-lightBlue-500 active:bg-lightBlue-600 ${
            isActive ? "font-bold bg-lightBlue" : ""
          } ${
            isActive && isChildrenDisplayed
              ? "rounded-tr-full rounded-br-full"
              : ""
          }`
        }
        onClick={handleLogoutClick}
      >
        {menu.icon && <menu.icon />}
        <span
          className={`overflow-hidden transition-all  ${
            isExpanded ? "w-full" : "w-0"
          }`}
        >
          {menu.label}
        </span>
        {menu.children && menu.children.length > 0 && (
          <span
            onClick={(e) => {
              e.preventDefault();
              setIsChildrenDisplayed(!isChildrenDisplayed);
            }}
            className={`transition-transform transform h-full flex items-center ${
              isChildrenDisplayed ? "rotate-180" : "rotate-0"
            }`}
          >
            {isChildrenDisplayed ? (
              <FaMinus className="text-xs" />
            ) : (
              <FaPlus className="text-xs" />
            )}
          </span>
        )}
      </NavLink>
      {menu.children && menu.children.length > 0 && (
        <div
          className={`overflow-hidden transition-all pl-2 ${
            isChildrenDisplayed ? "" : "max-h-0"
          }`}
        >
          <MenuList menus={menu.children} isExpanded={isExpanded} />
        </div>
      )}
      {!isExpanded && !isChildrenDisplayed && (
        <SidebarTooltip label={menu.label} />
      )}
    </li>
  );
}

function SidebarTooltip({ label }: { label: string }) {
  return (
    <div className="absolute rounded-sm text-xs text-black z-50 capitalize p-0.5 bg-[#9DC3E7] invisible -translate-x-3 -translate-y-5 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 hover:hidden">
      {label}
    </div>
  );
}
