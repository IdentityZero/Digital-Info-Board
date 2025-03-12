import { useState, useRef, ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";

type AccordionItemProps = {
  title: string;
  children: ReactNode;
  isOpenInit?: boolean; // Initial State for isopen
};

type AccordionProps = {
  children: ReactNode;
};

export function AccordionItem({
  title,
  children,
  isOpenInit = true,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(isOpenInit);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="font-medium">{title}</span>
        <FaChevronDown
          className={`transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="transition-[max-height] duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <div className="p-4 text-gray-700">{children}</div>
      </div>
    </div>
  );
}

export default function Accordion({ children }: AccordionProps) {
  return <div className="w-full mx-auto space-y-2">{children}</div>;
}
