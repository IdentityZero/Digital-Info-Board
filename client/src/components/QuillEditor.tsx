import { forwardRef, useState } from "react";
import ReactQuill from "react-quill";
import { Delta } from "quill/core";
import "react-quill/dist/quill.snow.css";
import { Errortext } from "./ui";

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],

    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],

    [{ color: [] }, { background: [] }],
    ["blockquote"],
    ["link"],
  ],
};

type QuillEditorProps = {
  id: string;
  label: string;
  value: any;
  onChange: any;
  readonly?: boolean;
  className?: string;
  error?: string | string[];
  placeholder?: string;
  isTitle?: boolean;
};

const QuillEditor = forwardRef<ReactQuill, QuillEditorProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      error,
      readonly = false,
      className = "",
      placeholder = "",
      isTitle = false,
    },
    ref
  ) => {
    const [showTitleBg, setShowTitleBg] = useState(false);

    return (
      <div className="mt-2 ">
        <div className="flex flex-row items-center justify-between mb-2">
          <label
            htmlFor={id}
            className={`font-bold ${error ? "text-red-500" : "text-black"}`}
          >
            {label}
          </label>
          {isTitle && (
            <div>
              <button
                onClick={() => setShowTitleBg(!showTitleBg)}
                type="button"
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {showTitleBg ? "Remove background" : "Show background"}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white">
          <ReactQuill
            theme="snow"
            ref={ref}
            modules={modules}
            id={id}
            value={value}
            onChange={onChange}
            readOnly={readonly}
            className={`${
              isTitle
                ? showTitleBg
                  ? "ql-editor-title-wbg"
                  : "ql-editor-title"
                : className
            }`}
            placeholder={placeholder}
          />
          {error && <Errortext text={error} />}
        </div>
      </div>
    );
  }
);

export const isQuillValueEmpty = (value: Delta) => {
  if (value.ops.length === 0) {
    return true;
  }

  if (value.ops[0].insert === "\n") {
    return true;
  }
  return false;
};

export default QuillEditor;
