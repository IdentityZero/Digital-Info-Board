import LoadingSpinner from "./LoadingSpinner";

// # TODO: SET THIS UP
const LoadingMessage = ({
  message,
  spinnerSize = 48,
  fontSize = "lg",
}: {
  message: string;
  spinnerSize?: number;
  fontSize?: "lg" | "md";
}) => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-2 mb-2">
      <LoadingSpinner size={spinnerSize} />
      <p
        className="font-medium text-gray-600 animate-pulse text-base"
        style={{
          fontSize: fontSize == "lg" ? "1.125rem" : "1rem",
          lineHeight: fontSize == "lg" ? " 1.75rem" : "1.5rem",
        }}
      >
        {message}
      </p>
    </div>
  );
};
export default LoadingMessage;
