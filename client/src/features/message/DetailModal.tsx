import { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";

import Modal from "../../components/ui/Modal";
import LoadingOrErrorWrapper from "../../components/LoadingOrErrorWrapper";
import ButtonV2 from "../../components/ui/ButtonV2";

import { formatTimestamp } from "../../utils";

import { useAuth } from "../../context/AuthProvider";
import useLoadingToast from "../../hooks/useLoadingToast";

import { ContactUsMessageType } from "../../types/ContactUsTypes";

import {
  retrieveMessageApi,
  setRespondedMessageApi,
} from "../../api/contactUsRequest";

type DetailModalProps = {
  id: number;
  onClose: () => void;
  onSuccess?: (data: ContactUsMessageType) => void;
};

const DetailModal = ({ id, onClose, onSuccess }: DetailModalProps) => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const [message, setMessage] = useState<ContactUsMessageType | null>(null);

  const [isFetching, setIsFetching] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);

  const fetchDetails = async () => {
    try {
      setIsFetching(true);
      const res_data = await retrieveMessageApi(userApi, id);
      setMessage(res_data);
    } catch (error) {
      setHasErrors(true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSetResponded = async () => {
    loading("Updating. Please wait");

    try {
      const res_data = await setRespondedMessageApi(userApi, id);
      update({
        render: "Updated succesfully.",
        type: "success",
      });
      onSuccess && onSuccess(res_data);
    } catch (error) {
      update({
        render: "Update unsuccessful. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <Modal
      isOpen={!!id}
      onClose={onClose}
      title={`Message number:  #${id}`}
      size="xl"
    >
      <LoadingOrErrorWrapper
        isLoading={isFetching}
        hasError={hasErrors}
        hasErrorMessage="Failed to load details. Please try refreshing the page"
      >
        <div className="mx-auto p-4 rounded-2xl shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Contact Us Message</h2>

          <div className="space-y-2">
            <div>
              <span className="font-medium ">Name:</span>
              <p className="">{message?.name}</p>
            </div>

            <div>
              <span className="font-medium ">Email:</span>
              <p className="">{message?.email}</p>
            </div>

            <div>
              <span className="font-medium ">Message:</span>
              <p className=" whitespace-pre-line">{message?.message}</p>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between gap-2 text-sm pt-4 border-t">
              <div>
                <span className="font-medium">Date Created:</span>{" "}
                {formatTimestamp(message?.created_at as string)}
              </div>
              <div>
                <span className="font-medium">Date Read:</span>
                {message?.responded_at
                  ? formatTimestamp(message.responded_at)
                  : "Pending"}
              </div>
            </div>
            {message?.responded_by && (
              <div className="text-sm">
                <span className="font-medium">Read By:</span>{" "}
                {`${message.responded_by.first_name} ${message.responded_by.last_name}`}
              </div>
            )}
            {!message?.is_responded && (
              <ButtonV2 text="Mark as read" onClick={handleSetResponded} />
            )}
          </div>
        </div>
      </LoadingOrErrorWrapper>
    </Modal>
  );
};
export default DetailModal;
