import axios from "axios";

export const createNewUserApi = async (user: {
  [k: string]: FormDataEntryValue;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/users/v1/create/",
      user,
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
