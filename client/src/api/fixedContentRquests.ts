import axios, { AxiosInstance } from "axios";

/**
 * BASE_ENDPOINT is only used when not using the users api
 */

const BASE_ENDPOINT = "http://127.0.0.1:8000/";

const listActiveFixedContentsEndpoint = "fixed-contents/v1/active/";
const updateFixedContentStatusEndpoint = (id: number) => {
  return `fixed-contents/v1/${id}/`;
};

export const listActiveFixedContents = async () => {
  try {
    const response = await axios.get(
      BASE_ENDPOINT + listActiveFixedContentsEndpoint
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateFixedContentStatus = async (
  axiosInstance: AxiosInstance,
  id: number,
  isDisplayed: boolean
) => {
  try {
    const response = await axiosInstance.put(
      updateFixedContentStatusEndpoint(id),
      { is_displayed: isDisplayed }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
