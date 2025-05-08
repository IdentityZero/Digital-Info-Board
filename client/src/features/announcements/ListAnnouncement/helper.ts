import { Id, ToastOptions, UpdateOptions } from "react-toastify";
import { previewDisplayApi } from "../../../api/realtimeUpdateRequest";
import axios, { AxiosInstance } from "axios";

export const handleDisplayPreviewClick = async (
  id: string,
  loading: (message: string, options?: ToastOptions) => Id,
  update: (updateOptionsProps: UpdateOptions) => void,
  userApi: AxiosInstance
) => {
  loading(`Previewing content-${id}. Please wait...`);

  try {
    await previewDisplayApi(userApi, id);
    update({ render: "Preview command sent.", type: "success" });
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      update({
        render: "Preview unsuccessful. Please try again",
        type: "error",
      });
      return;
    }
    const err = error.response?.data;

    if (!err) {
      update({
        render: "Preview unsuccessful. Please try again",
        type: "error",
      });
      return;
    } else {
      update({
        render: err.error,
        type: "warning",
      });
    }
  }
};
