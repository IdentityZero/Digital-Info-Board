import { NavLink } from "react-router-dom";
import { MenuType } from "../../types/Links";
import { FaMinus, FaPlus } from "react-icons/fa";
import MenuList from "./MenuList";
import { useState } from "react";

const MenuItem = ({
  menu,
  isExpanded,
  isMobileExpanded = false,
  setIsMobileExpanded,
}: {
  menu: MenuType;
  isExpanded: boolean;
  isMobileExpanded?: boolean;
  setIsMobileExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isChildrenDisplayed, setIsChildrenDisplayed] = useState(false);
  const [isItemActive, setIsItemActive] = useState(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (menu.label === "log out") {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (!confirmLogout) {
        e.preventDefault();
      }
      return;
    }
    if (menu.children && menu.children.length > 0) {
      setIsChildrenDisplayed(!isChildrenDisplayed);
    }

    if (isMobileExpanded && setIsMobileExpanded) {
      setIsMobileExpanded(false);
    }
  };

  return (
    <li className="relative group">
      <div
        className={`w-full mb-2 flex h-14 flex-row items-center hover:bg-lightBlue-500 active:bg-lightBlue-600${
          isItemActive && "font-bold bg-lightBlue"
        } ${
          isItemActive &&
          isChildrenDisplayed &&
          "rounded-tr-full rounded-br-full"
        }`}
      >
        <NavLink
          end={menu.label === "dashboard"}
          to={menu.to || "#"}
          className={({ isActive }) => {
            setIsItemActive(isActive);
            return "w-[90%] h-full flex items-center gap-2 capitalize p-3 pl-6";
          }}
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
        </NavLink>
        {menu.children && menu.children.length > 0 && (
          <span
            onClick={(e) => {
              e.preventDefault();
              setIsChildrenDisplayed(!isChildrenDisplayed);
            }}
            className={`transition-transform transform h-full flex items-center cursor-pointer ${
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
      </div>
      {menu.children && menu.children.length > 0 && (
        <div
          className={`overflow-hidden transition-all pl-2.5 ${
            isChildrenDisplayed ? "" : "max-h-0"
          }`}
        >
          <MenuList
            menus={menu.children}
            isExpanded={isExpanded}
            isMobileExpanded={isMobileExpanded}
            setIsMobileExpanded={setIsMobileExpanded}
          />
        </div>
      )}
      {!isExpanded && !isChildrenDisplayed && (
        <SidebarTooltip label={menu.label} />
      )}
    </li>
  );
};
export default MenuItem;

function SidebarTooltip({ label }: { label: string }) {
  return (
    <div className="absolute rounded-sm text-xs text-black z-50 capitalize p-0.5 bg-[#9DC3E7] invisible -translate-x-3 -translate-y-5 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 hover:hidden">
      {label}
    </div>
  );
}
