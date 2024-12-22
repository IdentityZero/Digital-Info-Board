import Helptext from "./Helptext";
import Errortext from "./Errortext";

interface TextAreaProps {
  value: string;
  name: string;
  label: string;
  setInputValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  cols?: number;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string | string[];
  helpText?: string | string[];
}

const TextArea = ({
  value,
  name,
  setInputValue,
  label,
  error,
  helpText,
  placeholder = "Enter text...",
  rows = 5,
  cols = 40,
  disabled = false,
  required = false,
}: TextAreaProps) => {
  return (
    <div>
      <label
        className="block text-gray-700 text-sm font-bold mb-2 capitalize"
        htmlFor={name}
      >
        {label}
        {required && "*"}
      </label>
      <textarea
        value={value}
        name={name}
        id={name}
        onChange={(e) => setInputValue(e)}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none ${
          error
            ? "border-2 border-red-500 focus:ring focus:ring-red-200 focus:border-red-500"
            : "border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
        }`}
        disabled={disabled}
      />
      {helpText && !error && <Helptext text={helpText} />}
      {error && <Errortext text={error} />}
    </div>
  );
};

export default TextArea;
