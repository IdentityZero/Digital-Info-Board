import React, { createContext, useContext, useEffect, useState } from "react";

import useWebsocket from "../../hooks/useWebsocket";
import { useAuth } from "../AuthProvider";

import { NOTIFICATIONS_URL } from "../../constants/urls";
import {
  NotificationListType,
  NotificationType,
} from "../../types/NotificationTypes";
import {
  listNotificationsApi,
  markNotificationReadApi,
} from "../../api/notificationRequests";
import NotificationContainer from "../../features/notifications/NotificationContainer";
import { toast } from "react-toastify";

type NotificationContextType = {
  notifications: NotificationListType;
  isLoading: boolean;
  error: any;
  handleLoadMore: () => void;
  markNotificationRead: (id: number, currentvalue: boolean) => void;
};

type WsMessageType = {
  data: NotificationType;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const notify = (
  notification: NotificationType,
  onClick: (id: number, currentvalue: boolean) => void
) => {
  toast(NotificationContainer({ notification, onClick }), {
    className: "p-0 rounded-xl overflow-hidden",
    theme: "dark",
  });
};

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, userApi } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [notifications, setNotifications] = useState<NotificationListType>({
    count: 0,
    next: null,
    results: [],
    unread_count: 0,
  });

  const handleLoadMore = () => {
    if (!notifications?.next) {
      return;
    }
    fetchNotifications(notifications.next);
  };

  const markNotificationRead = async (id: number, currentvalue: boolean) => {
    // dont send if already marked as true
    if (currentvalue) return;

    const res_data = await markNotificationReadApi(userApi, id);
    setNotifications((prev) => {
      const copy = prev.results.map((notification) =>
        notification.id === id ? res_data : notification
      );

      return {
        ...prev,
        results: copy,
        unread_count: prev.unread_count - 1,
      };
    });
    console.log(res_data);
  };

  const handleOnWsMessage = (data: WsMessageType) => {
    notify(data.data as NotificationType, markNotificationRead);
    setNotifications((prev) => ({
      ...prev,
      results: [data.data, ...prev.results],
      unread_count: prev.unread_count + 1,
    }));
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useWebsocket(NOTIFICATIONS_URL(user?.id as string), handleOnWsMessage);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markNotificationRead,
        handleLoadMore,
        isLoading,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export default NotificationProvider;

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (context === undefined)
    throw new Error(
      "useNotificationContext must be within the Notification Provider"
    );

  return context;
};
