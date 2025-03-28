import axios, { AxiosInstance } from "axios";
import {
  NotificationListType,
  NotificationType,
} from "../types/NotificationTypes";
// import { BASE_API_URL } from "../constants/urls";

/**
 * BASE_ENDPOINT is only used when not using the users api
 */

// const BASE_ENDPOINT = "http://" + BASE_API_URL + "/";
export const listNotificationsEndpoint = "notifications/v1/";

export const listNotificationsApi = async (
  axiosInstance: AxiosInstance,
  url: string = listNotificationsEndpoint + "?limit=6"
): Promise<NotificationListType> => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const markNotificationReadApi = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<NotificationType> => {
  try {
    const response = await axiosInstance.patch(
      `${listNotificationsEndpoint}status/${id}`,
      { is_read: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
