import { Id, toast, ToastOptions, UpdateOptions } from "react-toastify";
import LoadingMessage from "../components/LoadingMessage";

const useLoadingToast = (Id: React.MutableRefObject<Id | null>) => {
  /**
   * Used for Forms
   * Ex.
   * import { Id } from "react-toastify";
   * const toastId = useRef<Id | null>(null);
     const { loading, update } = useLoadingToast(toastId);
   * 
   * loading("Saving updates. Please wait...");
   * update({
            render: "Update unsuccessful. Please try again.",
            type: "error",
          });
   */
  const loading = (
    message: string,
    options: ToastOptions = { type: "default" }
  ) => {
    return (Id.current = toast(
      LoadingMessage({ message: message, spinnerSize: 32, fontSize: "base" }),
      { autoClose: false, ...options }
    ));
  };

  const update = (updateOptionsProps: UpdateOptions) =>
    toast.update(Id.current as Id, { ...updateOptionsProps, autoClose: 5000 });

  return { loading, update };
};
export default useLoadingToast;
