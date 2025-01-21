import axios, { AxiosInstance } from "axios";
import {
  type AnnouncementListType,
  type FullTextAnnouncementType,
  type FullImageAnnouncementType,
  FullVideoAnnouncementType,
} from "../types/AnnouncementTypes";

// This is for base axios instance not using the users api
const BASE_ENDPOINT = "http://127.0.0.1:8000/";

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
  return `/announcements/v1/${announcement_id}/`;
};

const listImageAnnouncementEndpoint = "announcements/v1/image/";
const updateImageAnnouncementEndpoint = (announcement_id: string) => {
  return `announcements/v1/${announcement_id}/image/`;
};
const updateVideoAnnouncementEndpoint = (announcement_id: string) => {
  return `announcements/v1/${announcement_id}/video/`;
};

const listVideoAnnouncementEndpoint = "announcements/v1/video/";

export const listAnnouncementApi = async (): Promise<AnnouncementListType> => {
  try {
    const response = await axios.get(
      BASE_ENDPOINT + listCreateAllTypeAnnouncementEndpoint
    );
    return response.data;
  } catch (error) {
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
  /**
   * This endpoint supports all types of Content
   * Text
   * Image
   * Video
   */
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
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listTextAnnouncementApi = async (
  axiosInstance: AxiosInstance
): Promise<AnnouncementListType> => {
  try {
    const response = await axiosInstance.get(listTextAnnouncementEndpoint);
    return response.data;
  } catch (error) {
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
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listImageAnnouncementApi = async (
  axiosInstance: AxiosInstance
): Promise<AnnouncementListType> => {
  try {
    const response = await axiosInstance.get(listImageAnnouncementEndpoint);
    return response.data;
  } catch (error) {
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
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listVideoAnnouncementApi = async (
  axiosInstance: AxiosInstance
): Promise<AnnouncementListType> => {
  try {
    const response = await axiosInstance.get(listVideoAnnouncementEndpoint);
    return response.data;
  } catch (error) {
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
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
