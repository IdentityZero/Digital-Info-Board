import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { logo } from "../../assets";
import { MenuType } from "../../types/Links";
import MenuList from "./MenuList";

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
          className=" hover:bg-gray-300 rounded-lg p-1.5"
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
