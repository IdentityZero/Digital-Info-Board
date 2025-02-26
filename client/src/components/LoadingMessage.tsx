import LoadingSpinner from "./LoadingSpinner";
import clsx from "clsx";

const LoadingMessage = ({
  message,
  spinnerSize = 48,
  fontSize = "lg",
}: {
  message: string;
  spinnerSize?: number;
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}) => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-2 mb-2">
      <LoadingSpinner size={spinnerSize} />
      <p
        className={clsx(
          "font-medium text-gray-600 animate-pulse",
          `text-${fontSize}`
        )}
      >
        {message}
      </p>
    </div>
  );
};

export default LoadingMessage;
