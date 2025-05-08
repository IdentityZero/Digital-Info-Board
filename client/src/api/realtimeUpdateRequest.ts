import axios, { AxiosInstance } from "axios";
import { BASE_API_URL } from "../constants/urls";
import { showApiError } from "../utils/utils";

const BASE_ENDPOINT = "http://" + BASE_API_URL + "/";

const REALTIME_UPDATE_BASE_ENDPOINT = BASE_ENDPOINT + "realtime-update/";

export const previewDisplayApi = async (
  axiosInstance: AxiosInstance,
  id: string
) => {
  try {
    const response = await axiosInstance.post(
      REALTIME_UPDATE_BASE_ENDPOINT + "preview/",
      { id: id }
    );
    return response.data;
  } catch (error) {
    showApiError("List Notifications Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
