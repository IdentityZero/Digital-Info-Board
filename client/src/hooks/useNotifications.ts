import { useEffect, useState } from "react";
import {
  NotificationListType,
  NotificationType,
} from "../types/NotificationTypes";
import { listNotificationsApi } from "../api/notificationRequests";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { NOTIFICATIONS_URL } from "../constants/urls";
import NotificationContainer from "../features/notifications/NotificationContainer";

const useNotifications = () => {
  const { userApi, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [notifications, setNotifications] = useState<NotificationListType>({
    count: 0,
    next: null,
    results: [],
    unread_count: 0,
  });

  const notify = (notification: NotificationType) => {
    toast(NotificationContainer({ notification }), {
      className: "p-0 rounded-xl overflow-hidden",
      theme: "dark",
    });
  };

  const handleLoadMore = () => {
    if (!notifications?.next) {
      return;
    }
    fetchNotifications(notifications.next);
  };

  const fetchNotifications = async (url?: string) => {
    try {
      setIsLoading(true);
      const res_data = await listNotificationsApi(userApi, url);
      if (url) {
        setNotifications((prev) => ({
          ...prev,
          results: [...prev.results, ...res_data.results],
          next: res_data.next,
          count: res_data.count,
        }));
      } else {
        setNotifications(res_data);
      }
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!user) return;
    const ws = new WebSocket(NOTIFICATIONS_URL(user?.id));

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type !== "notification" || !("notification" in data)) {
        return;
      }
      notify(data.notification as NotificationType);
      setNotifications((prev) => ({
        ...prev,
        results: [data.notification, ...prev.results],
        unread_count: prev.unread_count + 1,
      }));
    };
    return () => ws.close();
  }, []);

  return { notifications, isLoading, error, handleLoadMore };
};
export default useNotifications;
