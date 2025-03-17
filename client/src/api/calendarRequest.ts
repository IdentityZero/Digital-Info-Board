import axios, { AxiosInstance } from "axios";

import { BASE_API_URL } from "../constants/urls";
import { CalendarEventType } from "../types/FixedContentTypes";

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

export const createCalendarEventApi = async (
  axiosInstance: AxiosInstance,
  data: FormData
): Promise<CalendarEventType> => {
  try {
    const response = await axiosInstance.post(
      CALENDAR_BASE_ENDPOINT + "v1/",
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

export const listCalendarEventsApi = async (): Promise<CalendarEventType[]> => {
  try {
    const response = await axios.get(CALENDAR_BASE_ENDPOINT + "v1/");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateCalendarEventApi = async (
  axiosInstance: AxiosInstance,
  id: string,
  data: FormData
): Promise<CalendarEventType> => {
  try {
    const response = await axiosInstance.put(
      CALENDAR_BASE_ENDPOINT + `v1/${id}/`,
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

export const deleteCalendarEventApi = async (
  axiosInstance: AxiosInstance,
  id: string
) => {
  try {
    const response = await axiosInstance.delete(
      CALENDAR_BASE_ENDPOINT + `v1/${id}/`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
