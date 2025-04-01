import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Id } from "react-toastify";

import Modal from "../../../../components/ui/Modal";
import { Button, Input } from "../../../../components/ui";
import LoadingMessage from "../../../../components/LoadingMessage";

import { useAuth } from "../../../../context/AuthProvider";
import useLoadingToast from "../../../../hooks/useLoadingToast";

import { upcomingInitState } from "./helper";
import { UpcomingEventType } from "../../../../types/FixedContentTypes";
import {
  retrieveUpcomingEventApi,
  updateUpcomingEventApi,
} from "../../../../api/fixedContentRquests";

type UpdateModalProps = {
  id: number;
  onClose: () => void;
  refreshList?: () => void;
  onSuccess?: (data: UpcomingEventType) => void;
};

const UpdateModal = ({
  id,
  onClose,
  refreshList,
  onSuccess,
}: UpdateModalProps) => {
  /**
   * Used for Updating Upcoming events information
   */

  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [eventData, setEventData] = useState<UpcomingEventType | null>(null);

  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(upcomingInitState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const res_data = await retrieveUpcomingEventApi(userApi, id);
        setEventData(res_data);
      } catch (error) {
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventData) return;

    const formData = new FormData(e.currentTarget);
    loading("Saving updates. Please wait...");

    try {
      setIsSaving(true);
      setError(upcomingInitState);
      const res_data = await updateUpcomingEventApi(userApi, id, formData);
      update({
        render: "Update successful",
        type: "success",
      });
      onClose();
      onSuccess && onSuccess(res_data);
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        update({
          render: "Update unsuccessful",
          type: "error",
        });
        return;
      }

      const err = error.response?.data;

      if (!err) {
        update({
          render: "Update unsuccessful",
          type: "error",
        });
        return;
      }

      setError(err);
      update({
        render: "Check errors before submitting...",
        type: "warning",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={!!id}
      onClose={onClose}
      size="xl"
      title="Update Upcoming Event Info"
    >
      {isFetching ? (
        <LoadingMessage message="Retrieving information..." />
      ) : eventData ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            labelText="Event Name"
            defaultValue={eventData.name}
            name="name"
            placeholder="Event Name (e.g. Organization Election, Unigames 2025)"
            required
            maxLength={64}
            helpText={["Up to 64 characters allowed."]}
            disabled={isSaving}
            error={error.name}
          />
          <Input
            type="date"
            defaultValue={eventData.date}
            labelText="Event Date"
            name="date"
            required
            disabled={isSaving}
            error={error.date}
          />
          <Button disabled={isSaving} type="submit">
            Update
          </Button>
        </form>
      ) : (
        <NotFound refreshList={refreshList} />
      )}
    </Modal>
  );
};
export default UpdateModal;

function NotFound({ refreshList }: { refreshList?: () => void }) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Event Not Found</h2>
      <p className="text-gray-600 mt-2">
        Information about the event is not available.
      </p>
      {refreshList && (
        <div className="mt-2">
          <Button onClick={refreshList}>Refresh</Button>
        </div>
      )}
    </div>
  );
}
