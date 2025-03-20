import React from "react";
import { MenuType } from "../../types/Links";
import MenuItem from "./MenuItem";
import { useAuth } from "../../context/AuthProvider";

const MenuList = ({
  menus,
  isExpanded,
  isMobileExpanded = false,
  setIsMobileExpanded,
}: {
  menus: MenuType[];
  isExpanded: boolean;
  isMobileExpanded?: boolean;
  setIsMobileExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();

  // To fix adminonly during recursion
  const filteredMenus = user?.is_admin
    ? menus
    : menus.filter((menu) => !menu.adminOnly);

  return (
    <ul className="border-l border-gray-300 dark:border-gray-600">
      {filteredMenus.map((menu) => (
        <MenuItem
          key={menu.label}
          menu={menu}
          isExpanded={isExpanded}
          isMobileExpanded={isMobileExpanded}
          setIsMobileExpanded={setIsMobileExpanded}
        />
      ))}
    </ul>
  );
};
export default MenuList;
