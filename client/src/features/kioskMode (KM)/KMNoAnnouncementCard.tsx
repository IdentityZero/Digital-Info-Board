const KMNoAnnouncementCard = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 p-8">
      <div className="p-12 shadow-xl rounded-3xl bg-white dark:bg-gray-800 border dark:border-gray-700 text-center max-w-2xl">
        <div className="flex flex-col items-center">
          <svg
            className="w-24 h-24 text-gray-500 dark:text-gray-400 mb-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="8" />
          </svg>
          <h2 className="text-4xl font-bold text-gray-700 dark:text-gray-200">
            No Announcements Today
          </h2>
          <p className="text-3xl text-gray-500 dark:text-gray-400 mt-4">
            Check back later for important updates.
          </p>
        </div>
      </div>
    </div>
  );
};
export default KMNoAnnouncementCard;
