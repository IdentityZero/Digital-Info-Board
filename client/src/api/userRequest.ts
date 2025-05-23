import axios, { AxiosInstance } from "axios";
import {
  type CreateUserInvitationType,
  type RetrieveUserInvitationType,
  type FullUserType,
  ListUserInvitationType,
  ListUserType,
} from "../types/UserTypes";
import { BASE_API_URL } from "../constants/urls";
import { showApiError } from "../utils/utils";

const retrieveUpdateUserInformationEndpoint = (id: string) => {
  return `users/v1/account/${id}/`;
};

const listInactiveUsersEndpoint = "users/v1/inactive/";
const updateUserActiveStatusEndpoint = (id: string) => {
  return `users/v1/inactive/${id}/`;
};

const listAllUsersEndpoint = "users/v1/";

const createListUserInvitationEndpoint = "users/v1/invite/";

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
    showApiError("Retrieve User Information Error: ", error);
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
    showApiError("Update User Information Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const resetPasswordApi = async (email: string) => {
  try {
    const response = await axios.post(
      "http://" + BASE_API_URL + "/users/v1/account/password-reset/",
      { email: email }
    );
    return response.data;
  } catch (error) {
    showApiError("Reset Password Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const resetPasswordConfirmApi = async (
  password: string,
  id: string,
  token: string
) => {
  try {
    const response = await axios.post(
      "http://" +
        BASE_API_URL +
        "/users/v1/account/password-reset-confirm/" +
        `${id}/${token}/`,
      { password: password }
    );
    return response.data;
  } catch (error) {
    showApiError("Reset Password Confirm Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const addUserEmailApi = async (
  axiosInstance: AxiosInstance,
  data: any
) => {
  try {
    const response = await axiosInstance.post(
      "users/v1/account/email/add/",
      data
    );
    return response.data;
  } catch (error) {
    showApiError("Add User Email Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const verifyEmailCodeApi = async (
  axiosInstance: AxiosInstance,
  email: string,
  code: string
) => {
  try {
    const response = await axiosInstance.post(
      "users/v1/account/email/verify/",
      {
        email: email,
        code: code,
      }
    );
    return response.data;
  } catch (error) {
    showApiError("Verify Email Code Error: ", error);
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
    showApiError("List Inactive Users Error: ", error);
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
    showApiError("Update User Active Status Error: ", error);
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
    showApiError("Delete User Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listAllUsersApi = async (
  axiosInstance: AxiosInstance,
  page: number = 1,
  page_size: number = 10
): Promise<ListUserType> => {
  try {
    const response = await axiosInstance.get(
      listAllUsersEndpoint + `?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List All Users Error: ", error);
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
    showApiError("Update User Password Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createUserInvitationApi = async (
  axiosInstance: AxiosInstance,
  data: CreateUserInvitationType
): Promise<RetrieveUserInvitationType> => {
  try {
    const response = await axiosInstance.post(
      createListUserInvitationEndpoint,
      data
    );
    return response.data;
  } catch (error) {
    showApiError("Create User Invitation Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listUserInvitationsApi = async (
  axiosInstance: AxiosInstance,
  page: number = 1,
  page_size: number = 10
): Promise<ListUserInvitationType> => {
  try {
    const response = await axiosInstance.get(
      createListUserInvitationEndpoint + `?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List User Invitations Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteUserInvitationApi = async (
  axiosInstance: AxiosInstance,
  id: number
) => {
  try {
    const response = await axiosInstance.delete(
      createListUserInvitationEndpoint + id + "/"
    );
    return response.data;
  } catch (error) {
    showApiError("Delete User Invitation Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const resendUserInvitationApi = async (
  axiosInstance: AxiosInstance,
  id: number
) => {
  try {
    const response = await axiosInstance.post(
      createListUserInvitationEndpoint + "resend/" + id + "/"
    );
    return response.data;
  } catch (error) {
    showApiError("Resend User Invitation Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
