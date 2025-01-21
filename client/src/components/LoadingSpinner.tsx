const LoadingSpinner = ({ size = 48 }: { size?: number }) => {
  /**
   * Size - pixel value
   */
  return (
    <div
      className="border-4 border-t-blue-500 border-gray-500 rounded-full animate-spin"
      style={{ width: `${size}px`, height: `${size}px` }}
    ></div>
  );
};
export default LoadingSpinner;
