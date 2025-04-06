import axios from "axios";
import { BASE_API_URL } from "../constants/urls";
import { RetrieveUserInvitationType } from "../types/UserTypes";
import { showApiError } from "../utils/utils";

export const createNewUserApi = async (user: {
  [k: string]: FormDataEntryValue;
}) => {
  try {
    const response = await axios.post(
      "http://" + BASE_API_URL + "/users/v1/create/",
      user,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    showApiError("Create New User Error: ", error);

    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error("An unexpected error occurred");
  }
};

export const retrieveInvitationDetailsApi = async (
  code: string
): Promise<RetrieveUserInvitationType> => {
  try {
    const response = await axios.get(
      "http://" + BASE_API_URL + `/users/v1/invite/code/${code}/`
    );
    return response.data;
  } catch (error) {
    showApiError("Retrieve Invitation Details Error: ", error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
