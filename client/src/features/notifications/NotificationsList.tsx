import { NotificationType } from "../../types/NotificationTypes";
import { formatTimestamp } from "../../utils";
import { logo } from "../../assets";
import { Link } from "react-router-dom";
import { getNotifRedirectPath } from "../../constants/notificationRedirect";

const NotificationsList = ({
  notifications,
  onClick,
}: {
  notifications: NotificationType[];
  onClick: (id: number, currentvalue: boolean) => void;
}) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Notifications
      </h2>
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={onClick}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No notifications available.
          </p>
        )}
      </div>
    </div>
  );
};
export default NotificationsList;

function NotificationItem({
  notification,
  onClick,
}: {
  notification: NotificationType;
  onClick: (id: number, currentvalue: boolean) => void;
}) {
  const { message, created_by, created_at, is_read } = notification;

  const creator_name = created_by
    ? `${created_by.first_name} ${created_by.last_name}`
    : "System Generated";

  const handleLinkClick = () => {
    onClick(notification.id, notification.is_read);
  };

  return (
    <Link
      onClick={handleLinkClick}
      className={`w-full p-4 text-left rounded-lg shadow-sm flex items-center space-x-4 transition-all duration-200 ease-in-out border border-gray-200 
            bg-white hover:bg-gray-100
            `}
      to={
        notification.action
          ? getNotifRedirectPath(notification.action, notification.target_id)
          : "#"
      }
    >
      <img
        src={created_by ? (created_by.profile.image as string) : logo}
        alt="Creator Avatar"
        className="w-14 h-14 rounded-full object-cover border border-gray-300"
      />

      <div className="flex flex-col flex-grow text-gray-800">
        <span className="font-medium">{creator_name}</span>
        <span className="text-sm text-gray-600">{message}</span>
        <span className="text-xs text-gray-500">
          {formatTimestamp(created_at)}
        </span>
      </div>

      {!is_read && (
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </Link>
  );
}
