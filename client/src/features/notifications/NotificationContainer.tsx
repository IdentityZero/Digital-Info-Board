import { Link } from "react-router-dom";
import { formatTimestamp } from "../../utils";
import { NotificationType } from "../../types/NotificationTypes";
import { logo } from "../../assets";

function NotificationContainer({
  notification,
}: {
  notification: NotificationType;
}) {
  const { message, created_by, created_at, is_read } = notification;

  const creator_name = created_by
    ? `${created_by.first_name} ${created_by.last_name}`
    : "System Generated";

  return (
    <Link
      className={`w-[360px] p-4 rounded-xl shadow-lg flex items-center space-x-3 transition-all duration-300 ease-in-out cursor-pointer 
          bg-gray-700 hover:bg-gray-600
          `}
      to={`/dashboard/permissions/inactive#${notification.target_id}`}
    >
      <img
        src={created_by ? (created_by.profile.image as string) : logo}
        alt="Creator Avatar"
        className="w-12 h-12 rounded-full object-cover border-2 border-white"
      />

      <div className="flex flex-col flex-grow text-white">
        <span className="mb-0.5">
          {creator_name.length > 25
            ? creator_name.substring(0, 25) + "..."
            : creator_name}
        </span>
        <span className={`text-sm`}>
          {message.length > 50 ? message.substring(0, 50) + "..." : message}
        </span>
        <span className="text-xs text-gray-300">
          {formatTimestamp(created_at)}
        </span>
      </div>
      {!is_read && (
        <div className="min-w-3 min-h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </Link>
  );
}

export default NotificationContainer;
