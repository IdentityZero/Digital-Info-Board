import { FaExclamationTriangle } from "react-icons/fa";

const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
}: {
  message?: string;
}) => {
  return (
    <div className="flex items-center gap-2 bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded-md text-sm">
      <FaExclamationTriangle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
export default ErrorMessage;
