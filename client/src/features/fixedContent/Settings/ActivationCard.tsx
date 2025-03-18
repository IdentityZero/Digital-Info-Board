import { SettingsType } from "../../../types/SettingTypes";

type CardProps = {
  title: string;
  isActivated: boolean;
  componentKey: keyof SettingsType;
  handlePreview: (componentKey: keyof SettingsType) => void;
  handleActivation: (
    isActivated: boolean,
    componentKey: keyof SettingsType
  ) => void;
  isLoading: boolean;
};

const ActivationCard = ({
  title,
  isActivated,
  handlePreview,
  handleActivation,
  componentKey,
  isLoading,
}: CardProps) => {
  return (
    <div className="w-full bg-white border border-black p-2">
      <p className="bg-cyanBlue p-2 rounded-full font-semibold text-lg">
        {title || "No title"}
      </p>
      <div className="mt-2 flex justify-end gap-2">
        <button
          className="bg-cyanBlue py-2 px-4 rounded-full font-semibold text-white 
                 transition-colors disabled:bg-gray-400 disabled:text-gray-200 
                 disabled:cursor-not-allowed hover:bg-cyan-600"
          onClick={() => handlePreview(componentKey)}
          disabled={isLoading}
        >
          Preview
        </button>
        <button
          className="bg-cyanBlue py-2 px-4 rounded-full font-semibold text-white 
                 transition-colors disabled:bg-gray-400 disabled:text-gray-200 
                 disabled:cursor-not-allowed hover:bg-cyan-600"
          onClick={() => handleActivation(isActivated, componentKey)}
          disabled={isLoading}
        >
          {isActivated ? "Remove from " : "Add to "}
          display
        </button>
      </div>
    </div>
  );
};
export default ActivationCard;
