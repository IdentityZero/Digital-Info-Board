import LoadingSpinner from "./LoadingSpinner";

// # TODO: SET THIS UP
const LoadingMessage = ({ message }: { message: string }) => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-2 mb-2">
      <LoadingSpinner />
      <p className="text-lg font-medium text-gray-600 animate-pulse">
        {message}
      </p>
    </div>
  );
};
export default LoadingMessage;
