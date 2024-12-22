import axios, { AxiosInstance } from "axios";
import { type FullUserType } from "../types/UserTypes";

const retrieveUpdateUserInformationEndpoint = (id: number | string) => {
  return `users/v1/account/${id}/`;
};

const listInactiveUsersEndpoint = "users/v1/inactive/";
const updateUserActiveStatusEndpoint = (id: number | string) => {
  return `users/v1/inactive/${id}/`;
};

export const retrieveUserInformation = async (
  axiosInstance: AxiosInstance,
  id: number | undefined
): Promise<FullUserType> => {
  try {
    const response = await axiosInstance.get(
      retrieveUpdateUserInformationEndpoint(id as number)
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
  id: number | string,
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
  id: string | number,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      updateUserActiveStatusEndpoint(id as number),
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
