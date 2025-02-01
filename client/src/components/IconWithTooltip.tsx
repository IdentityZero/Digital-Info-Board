import { IconType } from "react-icons";

type IconWithTooltipProps = {
  icon: IconType;
  iconClassName?: string;
  label: string;
  labelClassName?: string;
};

const IconWithTooltip = ({
  icon: Icon,
  label,
  iconClassName,
  labelClassName,
}: IconWithTooltipProps) => {
  /**
   * Example:
   * <IconWithTooltip
        icon={FaEye}
        label="View"
        iconClassName="text-btSecondary hover:text-btSecondary-hover active: active:text-btSecondary-active cursor-pointer"
        labelClassName="p-1 px-2 rounded-md shadow-md bg-btSecondary text-white"
      />
   * 
   */
  return (
    <div className="relative flex items-center justify-center group">
      <div className={`${iconClassName}`}>
        <Icon />
      </div>

      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 ${
          labelClassName
            ? labelClassName
            : "bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-md whitespace-nowrap"
        }`}
      >
        {label}
      </div>
    </div>
  );
};
export default IconWithTooltip;
