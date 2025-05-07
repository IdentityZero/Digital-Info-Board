import LoadingMessage from "./LoadingMessage";

const LoadingLazyComponent = () => {
  return (
    <div className="mt-2 w-full">
      <LoadingMessage message="Loading..." />
    </div>
  );
};
export default LoadingLazyComponent;
