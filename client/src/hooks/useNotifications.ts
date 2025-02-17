import { useEffect, useState } from "react";
import { NotificationType } from "../types/NotificationTypes";
import { listNotificationsApi } from "../api/notificationRequests";
import { useAuth } from "../context/AuthProvider";

const useNotifications = () => {
  const { userApi } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const res_data = await listNotificationsApi(userApi);
        setNotifications(res_data);
      } catch (error) {
        setError(error);
        console.error(error);
      }
    };
    fetchNotifications();
  }, []);

  return { notifications, isLoading, error };
};
export default useNotifications;
