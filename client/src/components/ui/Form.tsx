import { forwardRef } from "react";

type FormProps = {
  error?: string | null;
  onSubmitFunc: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  hasFiles?: boolean;
};

const Form = forwardRef<HTMLFormElement | null, FormProps>(
  ({ children, onSubmitFunc, error, ...props }, ref) => {
    return (
      <form
        className="w-full h-full"
        onSubmit={(e) => onSubmitFunc(e)}
        ref={ref}
        encType={`${
          props.hasFiles
            ? "multipart/form-data"
            : "application/x-www-form-urlencoded"
        }`}
      >
        {error && (
          <div role="alert" className="mb-2 w-full h-full">
            <span className="block sm:inline font-bold text-red-700">
              {error}
            </span>
          </div>
        )}
        {children}
      </form>
    );
  }
);
export default Form;
