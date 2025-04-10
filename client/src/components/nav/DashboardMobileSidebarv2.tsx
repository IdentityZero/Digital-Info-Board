import { FaBars, FaTimes } from "react-icons/fa";
import { logo } from "../../assets";
import { MenuType } from "../../types/Links";
import { useState } from "react";
import MenuList from "./MenuList";

const DashboardMobileSidebarv2 = ({ menuData }: { menuData: MenuType[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full">
      <div className="bg-white border-b w-full flex flex-row justify-between items-center p-2">
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <button className="p-4 text-2xl" onClick={() => setIsExpanded(true)}>
          <FaBars />
        </button>
      </div>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80 backdrop-blur-sm text-black transform ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-6 bg-[#F8F9FA] h-full max-w-[400px]">
          <div className="flex flex-row justify-between items-center mb-4">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <button
              className="t text-xl mb-4"
              onClick={() => setIsExpanded(false)}
            >
              <FaTimes />
            </button>
          </div>
          <ul className="h-full max-h-[calc(100vh-80px)] flex flex-col justify-between overflow-auto custom-scrollbar">
            <div className="flex flex-col gap-2">
              <MenuList
                menus={menuData}
                isExpanded={true}
                isMobileExpanded={isExpanded}
                setIsMobileExpanded={setIsExpanded}
              />
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default DashboardMobileSidebarv2;
