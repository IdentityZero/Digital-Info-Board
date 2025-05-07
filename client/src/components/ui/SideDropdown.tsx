import {
  useState,
  useRef,
  useEffect,
  SetStateAction,
  createContext,
  useContext,
} from "react";

import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import useOutsideClick from "../../hooks/useOutsideClick";

interface DropdownProps {
  buttonContent: React.ReactNode;
  children: React.ReactNode;
}

interface SideDropdownContextType {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<SetStateAction<boolean>>;
}

export const SideDropdownContext = createContext<
  SideDropdownContextType | undefined
>(undefined);

const SideDropdown = ({ buttonContent, children }: DropdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonContentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [buttonContentWidth, setButtonContentWidth] = useState(0);
  useOutsideClick(containerRef, () => setIsExpanded(false));

  useEffect(() => {
    if (buttonContentRef.current) {
      const { width } = buttonContentRef.current.getBoundingClientRect();
      setButtonContentWidth(width);
    }
  }, [buttonContent]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative flex items-start w-fit" ref={containerRef}>
      <SideDropdownContext.Provider value={{ isExpanded, setIsExpanded }}>
        <div
          className="flex flex-row items-center justify-between"
          onClick={toggleExpansion}
        >
          <div ref={buttonContentRef}>{buttonContent}</div>
          <span
            className="cursor-pointer absolute"
            style={{ left: `${buttonContentWidth - 30}px` }}
          >
            {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </span>
        </div>
        {isExpanded && (
          <div
            style={{ left: `${buttonContentWidth + 20}px` }}
            className={`absolute z-50`}
          >
            {children}
          </div>
        )}
      </SideDropdownContext.Provider>
    </div>
  );
};

interface SideDropdownItemProps {
  to: string;
  children: React.ReactNode;
  end?: boolean;
  className?: string;
  isActiveClassName?: string;
}

export function SideDropdownItem({
  to,
  children,
  end,
  className,
  isActiveClassName,
}: SideDropdownItemProps) {
  /**
   * Only Supports Navlink
   */

  const sideDropdownContext = useContext(SideDropdownContext);

  if (!sideDropdownContext) {
    throw new Error(
      "Side dropdown context must be used within a SideDropdown Provider"
    );
  }

  const { setIsExpanded } = sideDropdownContext;

  const handleClick = () => {
    setIsExpanded(false);
  };

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${className} ${isActive && isActiveClassName}`
      }
      onClick={handleClick}
    >
      {children}
    </NavLink>
  );
}

export function DropdownContainer({ label }: { label: string }) {
  return (
    <button className="min-w-32 py-1 pr-5 border-2 border-black rounded-full capitalize font-semibold text-xl hover:bg-cyanBlue-light active:bg-cyanBlue">
      {label}
    </button>
  );
}
export default SideDropdown;
