import axios, { AxiosInstance } from "axios";

import { BASE_API_URL } from "../constants/urls";
import { type ListType } from "../types/ListType";

import {
  MediaDisplayType,
  UpcomingEventType,
  type OrganizationMembersType,
} from "../types/FixedContentTypes";
import { showApiError } from "../utils/utils";

/**
 * BASE_ENDPOINT is only used when not using the users api
 */

const BASE_ENDPOINT = "http://" + BASE_API_URL + "/";

const FIXED_CONTENT_BASE_ENDPOINT = BASE_ENDPOINT + "fixed-contents/";
// #region Topic : Organization Members

export const createOrgMembersApi = async (
  axiosInstance: AxiosInstance,
  data: FormData
): Promise<OrganizationMembersType> => {
  try {
    const response = await axiosInstance.post(
      FIXED_CONTENT_BASE_ENDPOINT + "v1/org-members/",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    showApiError("Create Org Member Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const retrieveOrgMemberApi = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<OrganizationMembersType> => {
  try {
    const response = await axiosInstance.get(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/org-members/${id}/`
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Org Member Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const updateOrgMemberApi = async (
  axiosInstance: AxiosInstance,
  id: number,
  data: any
): Promise<OrganizationMembersType> => {
  try {
    const response = await axiosInstance.patch(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/org-members/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    showApiError("Update Org Member Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const listPaginatedOrgMembersApi = async (
  page: number = 1,
  page_size: number = 10
): Promise<ListType<OrganizationMembersType>> => {
  try {
    const response = await axios.get(
      FIXED_CONTENT_BASE_ENDPOINT +
        `v1/org-members/?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List Paginated Org Members Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const listOrgmembersApi = async (): Promise<
  OrganizationMembersType[]
> => {
  try {
    const response = await axios.get(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/org-members/?active=true`
    );
    return response.data;
  } catch (error) {
    showApiError("List Active Org Members Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const updateOrgMemberPriorityApi = async (
  axiosInstance: AxiosInstance,
  data: { id: number; priority: number }[]
) => {
  try {
    const response = await axiosInstance.put(
      FIXED_CONTENT_BASE_ENDPOINT + "v1/org-members/priority-update/",
      data
    );
    return response.data;
  } catch (error) {
    showApiError("Update Org Member Priority Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const deleteOrgMemberApi = async (
  axiosInstance: AxiosInstance,
  id: number
) => {
  try {
    const response = await axiosInstance.delete(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/org-members/${id}/`
    );
    return response.data;
  } catch (error) {
    showApiError("Delete Org Member Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

// #endregion

// #region Topic: Upcoming Events

export const createUpcomingEventApi = async (
  axiosInstance: AxiosInstance,
  data: FormData
): Promise<UpcomingEventType> => {
  try {
    const response = await axiosInstance.post(
      FIXED_CONTENT_BASE_ENDPOINT + "v1/upcoming-events/",
      data
    );
    return response.data;
  } catch (error) {
    showApiError("Create Upcoming Event Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const retrieveUpcomingEventApi = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<UpcomingEventType> => {
  try {
    const response = await axiosInstance.get(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/upcoming-events/${id}/`
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Upcoming Event Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const updateUpcomingEventApi = async (
  axiosInstance: AxiosInstance,
  id: number,
  data: any
): Promise<UpcomingEventType> => {
  try {
    const response = await axiosInstance.patch(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/upcoming-events/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    showApiError("Update Upcoming Event Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const listPaginatedUpcomingEventsApi = async (
  page: number = 1,
  page_size: number = 10
): Promise<ListType<UpcomingEventType>> => {
  try {
    const response = await axios.get(
      FIXED_CONTENT_BASE_ENDPOINT +
        `v1/upcoming-events/?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List Paginated Upcoming Events Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const listUpcomingEventsApi = async (): Promise<UpcomingEventType[]> => {
  try {
    const response = await axios.get(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/upcoming-events/?active=true`
    );
    return response.data;
  } catch (error) {
    showApiError("List Active Upcoming Events Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const deleteUpcomingEventApi = async (
  axiosInstance: AxiosInstance,
  id: number
) => {
  try {
    const response = await axiosInstance.delete(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/upcoming-events/${id}/`
    );
    return response.data;
  } catch (error) {
    showApiError("Delete Upcoming Event Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

// #endregion

// #region Topic: Media Displays

export const createMediaDisplayApi = async (
  axiosInstance: AxiosInstance,
  data: FormData
): Promise<MediaDisplayType> => {
  try {
    const response = await axiosInstance.post(
      FIXED_CONTENT_BASE_ENDPOINT + "v1/media-displays/",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    showApiError("Create Media Display Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const retrieveMediaDisplayApi = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<MediaDisplayType> => {
  try {
    const response = await axiosInstance.get(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/media-displays/${id}/`
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Media Display Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const updateMediaDisplayApi = async (
  axiosInstance: AxiosInstance,
  id: number,
  data: any
): Promise<MediaDisplayType> => {
  try {
    const response = await axiosInstance.patch(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/media-displays/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    showApiError("Update Media Display Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const listPaginatedMediaDisplayApi = async (
  page: number = 1,
  page_size: number = 10
): Promise<ListType<MediaDisplayType>> => {
  try {
    const response = await axios.get(
      FIXED_CONTENT_BASE_ENDPOINT +
        `v1/media-displays/?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List Paginated Media Displays Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const listMediaDisplaysApi = async (): Promise<MediaDisplayType[]> => {
  try {
    const response = await axios.get(
      FIXED_CONTENT_BASE_ENDPOINT + "v1/media-displays/"
    );
    return response.data;
  } catch (error) {
    showApiError("List Media Displays Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const updateMediaDisplaysPriorityApi = async (
  axiosInstance: AxiosInstance,
  data: { id: number; priority: number }[]
) => {
  try {
    const response = await axiosInstance.put(
      FIXED_CONTENT_BASE_ENDPOINT + "v1/media-displays/priority-update/",
      data
    );
    return response.data;
  } catch (error) {
    showApiError("Update Media Display Priority Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const deleteMediaDisplayApi = async (
  axiosInstance: AxiosInstance,
  id: number
) => {
  try {
    const response = await axiosInstance.delete(
      FIXED_CONTENT_BASE_ENDPOINT + `v1/media-displays/${id}/`
    );
    return response.data;
  } catch (error) {
    showApiError("Delete Media Display Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

// #endregion

// #region Topic: Weather

export const getWeatherDataApi = async () => {
  try {
    const response = await axios.get(
      FIXED_CONTENT_BASE_ENDPOINT + "v1/weather-data/"
    );
    return response.data;
  } catch (error) {
    showApiError("Get Weather Data Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

// #endregion
