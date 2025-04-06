import axios, { AxiosInstance } from "axios";
import {
  type AnnouncementListType,
  type FullTextAnnouncementType,
  type FullImageAnnouncementType,
  type FullVideoAnnouncementType,
  type PaginatedAnnouncementListTypeV1,
} from "../types/AnnouncementTypes";
import { BASE_API_URL } from "../constants/urls";
import { showApiError } from "../utils/utils";

/**
 * BASE_ENDPOINT is only used when not using the users api
 */

const BASE_ENDPOINT = "http://" + BASE_API_URL + "/";

export const listCreateAllTypeAnnouncementEndpoint = "announcements/v1/"; // Exported that will be used for Video uploads
const deleteRetrieveAnnouncementEndpoint = (announcement_id: string) => {
  /**
   * Supports all type
   */
  return `/announcements/v1/${announcement_id}/`;
};
const updateAnnouncementActiveStatusEndpoint = (id: string) => {
  return `/announcements/v1/${id}/active-status/`;
};

const listTextAnnouncementEndpoint = "/announcements/v1/text/";
const retrieveUpdateTextAnnouncementEndpoint = (announcement_id: string) => {
  return `${BASE_ENDPOINT}announcements/v1/${announcement_id}/`;
};

const listImageAnnouncementEndpoint = "announcements/v1/image/";
const updateImageAnnouncementEndpoint = (announcement_id: string) => {
  return `announcements/v1/${announcement_id}/image/`;
};
const updateVideoAnnouncementEndpoint = (announcement_id: string) => {
  return `announcements/v1/${announcement_id}/video/`;
};

const listVideoAnnouncementEndpoint = "announcements/v1/video/";

export const listActiveAnnouncementApi =
  async (): Promise<AnnouncementListType> => {
    try {
      const response = await axios.get(
        BASE_ENDPOINT + listCreateAllTypeAnnouncementEndpoint + "status/active/"
      );
      return response.data;
    } catch (error) {
      showApiError("List Active Announcement Error: ", error);
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  };

export const listStatBasedAnnouncementApi = async (
  status: "active" | "inactive",
  page: number = 1,
  page_size: number = 10
): Promise<PaginatedAnnouncementListTypeV1> => {
  try {
    const response = await axios.get(
      BASE_ENDPOINT +
        listCreateAllTypeAnnouncementEndpoint +
        `status/${status}/?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List Status-Based Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createNewAllTypeAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  data: any
) => {
  try {
    const response = await axiosInstance.post(
      listCreateAllTypeAnnouncementEndpoint,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    showApiError("Create New All-Type Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string,
  data: any
): Promise<FullTextAnnouncementType> => {
  try {
    const response = await axiosInstance.patch(
      updateAnnouncementActiveStatusEndpoint(announcement_id),
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    showApiError("Update Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listTextAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  page: number = 1,
  page_size: number = 10
): Promise<PaginatedAnnouncementListTypeV1> => {
  try {
    const response = await axiosInstance.get(
      listTextAnnouncementEndpoint + `?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List Text Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteTextAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string
) => {
  try {
    const response = await axiosInstance.delete(
      deleteRetrieveAnnouncementEndpoint(announcement_id)
    );
    return response.data;
  } catch (error) {
    showApiError("Delete Text Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const retrieveTextAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string
): Promise<FullTextAnnouncementType> => {
  try {
    const response = await axiosInstance.get(
      retrieveUpdateTextAnnouncementEndpoint(announcement_id)
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Text Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateTextAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string,
  data: any
): Promise<FullTextAnnouncementType> => {
  try {
    const response = await axiosInstance.put(
      retrieveUpdateTextAnnouncementEndpoint(announcement_id),
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    showApiError("Update Text Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listImageAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  page: number = 1,
  page_size: number = 10
): Promise<PaginatedAnnouncementListTypeV1> => {
  try {
    const response = await axiosInstance.get(
      listImageAnnouncementEndpoint + `?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List Image Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteImageAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string
) => {
  try {
    const response = await axiosInstance.delete(
      deleteRetrieveAnnouncementEndpoint(announcement_id)
    );
    return response.data;
  } catch (error) {
    showApiError("Delete Image Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const retrieveImageAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string
): Promise<FullImageAnnouncementType> => {
  try {
    const response = await axiosInstance.get(
      deleteRetrieveAnnouncementEndpoint(announcement_id)
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Image Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateImageAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      updateImageAnnouncementEndpoint(announcement_id),
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    showApiError("Update Image Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listVideoAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  page: number = 1,
  page_size: number = 10
): Promise<PaginatedAnnouncementListTypeV1> => {
  try {
    const response = await axiosInstance.get(
      listVideoAnnouncementEndpoint + `?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List Video Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteVideoAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string
) => {
  try {
    const response = await axiosInstance.delete(
      deleteRetrieveAnnouncementEndpoint(announcement_id)
    );
    return response.data;
  } catch (error) {
    showApiError("Delete Video Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const retrieveVideoAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string
): Promise<FullVideoAnnouncementType> => {
  try {
    const response = await axiosInstance.get(
      deleteRetrieveAnnouncementEndpoint(announcement_id)
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Video Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateVideoAnnouncementApi = async (
  axiosInstance: AxiosInstance,
  announcement_id: string,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      updateVideoAnnouncementEndpoint(announcement_id),
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    showApiError("Update Video Announcement Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
