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
};

const DisplayQuillEditor = ({
  value,
  isTitle = false,
  className,
}: DisplayQuillEditorProps) => {
  return (
    <div className="bg-white">
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
