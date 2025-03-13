import axios, { AxiosInstance } from "axios";

import { BASE_API_URL } from "../constants/urls";

const BASE_ENDPOINT = "http://" + BASE_API_URL + "/";

const CALENDAR_BASE_ENDPOINT = BASE_ENDPOINT + "calendar/";

export const createEventApi = async (
  axiosInstance: AxiosInstance,
  data: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post(
      CALENDAR_BASE_ENDPOINT + "v1/add/",
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
