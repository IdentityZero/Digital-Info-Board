const LoadingScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-500 rounded-full animate-spin"></div>
        <p className="mt-5 text-lg font-semibold tracking-wider animate-pulse">
          {children}
        </p>
      </div>
    </div>
  );
};
export default LoadingScreen;
