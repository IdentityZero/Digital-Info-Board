import { useState } from "react";
import { IconType } from "react-icons";
import { FaTimes } from "react-icons/fa";

type ClosableMessageProps = {
  children: React.ReactNode;
  className?: string;
  icon?: IconType;
};

const ClosableMessage = ({
  children,
  className,
  icon: Icon,
}: ClosableMessageProps) => {
  /**
   * Recommended use case:
   * <ClosableMessage
        className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#305ab3] font-bold"
        icon={FaExclamationCircle}
      >
        Message Here
      </ClosableMessage>
   */
  const [isClosed, setIsClosed] = useState(false);
  const classes = className
    ? className
    : "w-full flex flex-row items-center justify-between pr-5";

  if (isClosed) {
    return <></>;
  }

  return (
    <div className={`${classes}`}>
      <div className="flex flex-row items-center gap-2 text-sm sm:text-base">
        <span>{Icon && <Icon />}</span>
        {children}
      </div>
      <span
        className="cursor-pointer hover:text-gray-500 active:text-gray-600"
        onClick={() => setIsClosed(true)}
      >
        <FaTimes />
      </span>
    </div>
  );
};
export default ClosableMessage;
