import React, { createContext, SetStateAction, useRef, useState } from "react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import useOutsideClick from "../../hooks/useOutsideClick";

interface DropdownProps {
  buttonContent: React.ReactNode;
  children: React.ReactNode;
  showArrow?: boolean;
}

interface DropdownContextType {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<SetStateAction<boolean>>;
}

export const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

const Dropdown = ({
  buttonContent,
  children,
  showArrow = true,
}: DropdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(containerRef, () => setIsExpanded(false));

  return (
    <div className="relative" ref={containerRef}>
      <DropdownContext.Provider value={{ isExpanded, setIsExpanded }}>
        <button
          className="flex flex-row items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="relative">{buttonContent}</div>
          {showArrow && (
            <span className="absolute right-4 top-2">
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          )}
        </button>
        <div className="absolute min-w-full right-0">
          {isExpanded && children}
        </div>
      </DropdownContext.Provider>
    </div>
  );
};

export { Dropdown as default };
