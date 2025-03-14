import Helptext from "./Helptext";
import Errortext from "./Errortext";
import React from "react";

type TextAreaProps = {
  labelText: string;
  rows?: number;
  cols?: number;
  error?: string | string[];
  helpText?: string | string[];
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = ({
  labelText,
  error,
  helpText,
  rows = 5,
  cols = 40,
  ...textAreaProps
}: TextAreaProps) => {
  const { name, required } = textAreaProps;
  return (
    <div>
      <label
        className="block text-gray-700 text-sm font-bold mb-2 capitalize"
        htmlFor={name}
      >
        {labelText}
        {required && "*"}
      </label>
      <textarea
        {...textAreaProps}
        name={name}
        id={name}
        rows={rows}
        cols={cols}
        className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none ${
          error
            ? "border-2 border-red-500 focus:ring focus:ring-red-200 focus:border-red-500"
            : "border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
        }`}
      />
      {helpText && !error && <Helptext text={helpText} />}
      {error && <Errortext text={error} />}
    </div>
  );
};

export default TextArea;
