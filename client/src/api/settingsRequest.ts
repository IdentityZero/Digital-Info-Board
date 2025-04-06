import axios, { AxiosInstance } from "axios";

import { showApiError } from "../utils/utils";

import { SITE_SETTINGS_URL } from "../constants/urls";
import { SettingsType } from "../types/SettingTypes";

export const listSystemSettingsApi = async (): Promise<SettingsType> => {
  try {
    const response = await axios.get(SITE_SETTINGS_URL + "v1/");
    return response.data;
  } catch (error) {
    showApiError("List System Settings Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateSystemSettingsApi = async (
  axiosInstance: AxiosInstance,
  data: any
): Promise<SettingsType> => {
  /**
   * On success, it will only return the key you updated.
   */
  try {
    const response = await axiosInstance.patch(`settings/v1/`, data);
    return response.data;
  } catch (error) {
    showApiError("Update System Settings Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
