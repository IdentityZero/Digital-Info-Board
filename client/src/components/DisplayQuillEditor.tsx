import { Delta } from "quill/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: false,
};

type DisplayQuillEditorProps = {
  value: string | Delta;
  isTitle?: boolean;
  className?: string;
  withBackground?: boolean;
};

const DisplayQuillEditor = ({
  value,
  isTitle = false,
  className,
  withBackground = true,
}: DisplayQuillEditorProps) => {
  return (
    <div className={`${withBackground ? "bg-white" : "bg-transparent"}`}>
      <ReactQuill
        theme="snow"
        value={value}
        modules={modules}
        readOnly
        className={`${
          isTitle ? "ql-display-title" : "ql-display"
        } ${className}`}
      />
    </div>
  );
};
export default DisplayQuillEditor;
