import React from "react";
import { MenuType } from "../../types/Links";
import MenuItem from "./MenuItem";

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
  return (
    <ul className="border-l border-gray-300 dark:border-gray-600">
      {menus.map((menu) => (
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
