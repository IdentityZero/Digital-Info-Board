import ErrorMessage from "./ErrorMessage";
import LoadingMessage from "./LoadingMessage";

type LoadingOrErrorWrapperProps = {
  isLoading: boolean;
  isLoadingMessage?: string;
  hasError: boolean;
  hasErrorMessage?: string;
  children: React.ReactNode;
};

const LoadingOrErrorWrapper = ({
  isLoading,
  isLoadingMessage,
  hasError,
  hasErrorMessage,
  children,
}: LoadingOrErrorWrapperProps) => {
  if (hasError) {
    return (
      <div className="mt-4">
        <ErrorMessage
          message={
            hasErrorMessage ||
            "Something went wrong while fetching your contents. Please try again."
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingMessage message={isLoadingMessage || "Loading..."} />;
  }
  return <>{children}</>;
};
export default LoadingOrErrorWrapper;
