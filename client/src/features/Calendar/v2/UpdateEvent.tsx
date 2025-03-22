import { useRef, useState } from "react";
import { Id } from "react-toastify";
import { EventApi } from "@fullcalendar/core/index.js";

import { Button, Input, TextArea } from "../../../components/ui";
import Modal from "../../../components/ui/Modal";

import { formatDateTimeLocalPST } from "../../../utils/formatters";
import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import {
  deleteCalendarEventApi,
  updateCalendarEventApi,
} from "../../../api/calendarRequest";
import { CalendarEventType } from "../../../types/FixedContentTypes";

type UpdateEventProps = {
  isOpen: boolean;
  onCloseClick: (isOpen: false) => void; // Always receives 'false'
  initialData: EventApi | null;
  onDeleteSuccess?: (eventId: string) => void;
  onUpdateSuccess?: (updatedEvent: CalendarEventType) => void;
};

const UpdateEvent = ({
  isOpen,
  onCloseClick,
  initialData,
  onDeleteSuccess,
  onUpdateSuccess,
}: UpdateEventProps) => {
  if (!initialData) return null;

  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    loading("Updating event. Please wait...");

    try {
      setIsLoading(true);
      const res_data = await updateCalendarEventApi(
        userApi,
        initialData?.id as string,
        formData
      );
      update({
        render: "Update succesful.",
        type: "success",
      });
      onUpdateSuccess && onUpdateSuccess(res_data);
    } catch (error) {
      update({
        render: "Delete unsuccesful. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const del_conf = confirm(
      `Are you sure you want to delete the event '${initialData?.title}'`
    );

    if (!del_conf) return;

    loading("Deleting event. Please wait...");
    try {
      setIsLoading(true);
      await deleteCalendarEventApi(userApi, initialData?.id as string);
      update({
        render: "Delete succesful.",
        type: "success",
      });
      onDeleteSuccess && onDeleteSuccess(initialData?.id as string);
    } catch (error) {
      update({
        render: "Delete unsuccesful. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      key={initialData.id}
      isOpen={isOpen}
      title="Update Event"
      onClose={() => onCloseClick(false)}
      size="xl"
    >
      <form onSubmit={handleUpdate}>
        <Input
          type="datetime-local"
          defaultValue={formatDateTimeLocalPST(initialData?.start as Date)}
          name="start"
          labelText="Start date"
          required
          disabled={isLoading}
        />
        <Input
          type="datetime-local"
          defaultValue={formatDateTimeLocalPST(initialData?.end as Date)}
          name="end"
          labelText="End date"
          required
          disabled={isLoading}
        />
        <Input
          name="title"
          labelText="Title"
          defaultValue={initialData?.title}
          required
          disabled={isLoading}
        />
        <TextArea
          labelText="Event Description"
          placeholder="Event description..."
          name="description"
          defaultValue={initialData?.extendedProps.description}
          disabled={isLoading}
        />
        <Input
          name="location"
          labelText="Location"
          defaultValue={initialData?.extendedProps.location}
          disabled={isLoading}
        />
        <div className="flex justify-between mt-2">
          <Button type="submit" disabled={isLoading}>
            Update Event
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default UpdateEvent;
