import axios, { Axios, AxiosInstance } from "axios";

import { BASE_API_URL } from "../constants/urls";
import {
  ContactUsMessageType,
  CreateContactUsMessageType,
} from "../types/ContactUsTypes";
import { showApiError } from "../utils/utils";
import { ListType } from "../types/ListType";

const CONTACT_US_BASE_ENDPOINT = "http://" + BASE_API_URL + "/contact-us/";

export const createMessageApi = async (data: CreateContactUsMessageType) => {
  try {
    const response = await axios.post(CONTACT_US_BASE_ENDPOINT + "v1/", data);
    return response.data;
  } catch (error) {
    showApiError("Create Contact Us Message Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const listPaginatedMessagesApi = async (
  axiosInstance: AxiosInstance,
  page: number = 1,
  page_size: number = 10
): Promise<ListType<ContactUsMessageType>> => {
  try {
    const response = await axiosInstance.get(
      CONTACT_US_BASE_ENDPOINT + `v1?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    showApiError("List Paginated Contact Us Messages Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const retrieveMessageApi = async (axiosInstance: Axios, id: number) => {
  try {
    const response = await axiosInstance.get(
      CONTACT_US_BASE_ENDPOINT + `v1/${id}/`
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Contact Us Message Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const setRespondedMessageApi = async (
  axiosInstance: Axios,
  id: number
): Promise<ContactUsMessageType> => {
  try {
    const response = await axiosInstance.patch(
      CONTACT_US_BASE_ENDPOINT + `v1/${id}/responded`
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Contact Us Message Error:", error);
    if (axios.isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};
