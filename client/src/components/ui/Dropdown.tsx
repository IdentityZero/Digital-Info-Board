import React, { createContext, SetStateAction, useState } from "react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface DropdownProps {
  buttonContent: React.ReactNode;
  children: React.ReactNode;
}

interface DropdownContextType {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<SetStateAction<boolean>>;
}

export const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

const Dropdown = ({ buttonContent, children }: DropdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full">
      <DropdownContext.Provider value={{ isExpanded, setIsExpanded }}>
        <button
          className="flex flex-row items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="relative">{buttonContent}</div>
          <span className="absolute right-4 top-2 text-white">
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </button>
        <div className="absolute w-full">{isExpanded && children}</div>
      </DropdownContext.Provider>
    </div>
  );
};

export { Dropdown as default };
