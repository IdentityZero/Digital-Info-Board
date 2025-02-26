const NoAnnouncementCard = () => {
  // TODO: Deploy this
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6 shadow-lg rounded-2xl bg-white dark:bg-gray-800 border dark:border-gray-700 text-center">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-gray-500 dark:text-gray-400 mb-2"
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
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            No Announcements Today
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for important updates.
          </p>
        </div>
      </div>
    </div>
  );
};
export default NoAnnouncementCard;
