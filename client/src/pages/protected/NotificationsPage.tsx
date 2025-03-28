import { useNotificationContext } from "../../context/Notification";
import NotificationsList from "../../features/notifications/NotificationsList";

const NotificationsPage = () => {
  const { notifications, markNotificationRead, handleLoadMore, isLoading } =
    useNotificationContext();

  return (
    <div className="w-full h-full">
      <NotificationsList
        notifications={notifications.results}
        onClick={markNotificationRead}
      />
      {notifications.next ? (
        <button
          onClick={handleLoadMore}
          className="mt-6 px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-all duration-200 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      ) : (
        <p className="mt-6 text-gray-500 text-center">
          🚀 You’re all caught up! No more notifications.
        </p>
      )}
    </div>
  );
};
export default NotificationsPage;
