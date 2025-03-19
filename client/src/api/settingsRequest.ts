import axios, { AxiosInstance } from "axios";
import { SITE_SETTINGS_URL } from "../constants/urls";
import { SettingsType } from "../types/SettingTypes";

export const listSystemSettingsApi = async (): Promise<SettingsType> => {
  try {
    const response = await axios.get(SITE_SETTINGS_URL + "v1/all/");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateSystemSettingsApi = async <K extends keyof SettingsType>(
  axiosInstance: AxiosInstance,
  key: K,
  value: SettingsType[K]
): Promise<Partial<Record<K, SettingsType[K]>>> => {
  /**
   * On success, it will only return the key you updated.
   */
  try {
    const response = await axiosInstance.patch(
      SITE_SETTINGS_URL + `v1/?setting=${key}`,
      { [key]: value }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
