import axios, { AxiosInstance } from "axios";
import { type FullUserType } from "../types/UserTypes";

const retrieveUpdateUserInformationEndpoint = (id: string) => {
  return `users/v1/account/${id}/`;
};

const listInactiveUsersEndpoint = "users/v1/inactive/";
const updateUserActiveStatusEndpoint = (id: string) => {
  return `users/v1/inactive/${id}/`;
};

const listAllUsersEndpoint = "users/v1/";

export const retrieveUserInformation = async (
  axiosInstance: AxiosInstance,
  id: string
): Promise<FullUserType> => {
  try {
    const response = await axiosInstance.get(
      retrieveUpdateUserInformationEndpoint(id)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateUserInformationApi = async (
  axiosInstance: AxiosInstance,
  id: string,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      retrieveUpdateUserInformationEndpoint(id),
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

export const listInactiveUsersApi = async (axiosInstance: AxiosInstance) => {
  /**
   * Not in use. Remove this comment if will be used.
   */
  try {
    const response = await axiosInstance.get(listInactiveUsersEndpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateUserActiveStatusApi = async (
  axiosInstance: AxiosInstance,
  id: string,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      updateUserActiveStatusEndpoint(id),
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

export const deleteUserApi = async (
  axiosInstance: AxiosInstance,
  id: string
) => {
  try {
    const response = await axiosInstance.delete(
      `${retrieveUpdateUserInformationEndpoint(id)}delete/`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listAllUsersApi = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get(listAllUsersEndpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateUserPasswordApi = async (
  axiosInstance: AxiosInstance,
  id: string,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${retrieveUpdateUserInformationEndpoint(id)}change-password/`,
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
