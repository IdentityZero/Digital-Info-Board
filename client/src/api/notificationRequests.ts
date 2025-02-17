import axios, { AxiosInstance } from "axios";
import { BASE_API_URL } from "../constants/urls";

/**
 * BASE_ENDPOINT is only used when not using the users api
 */

const BASE_ENDPOINT = "http://" + BASE_API_URL + "/";
const listNotificationsEndpoint = "notifications/v1/";

export const listNotificationsApi = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get(
      BASE_ENDPOINT + listNotificationsEndpoint
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
