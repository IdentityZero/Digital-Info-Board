import { useRef, useState } from "react";
import { Id } from "react-toastify";

import { Button, Input, TextArea } from "../../../components/ui";
import Modal from "../../../components/ui/Modal";
import { formatDateTimeLocalPST } from "../../../utils/formatters";

import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import { createCalendarEventApi } from "../../../api/calendarRequest";
import { CalendarEventType } from "../../../types/FixedContentTypes";

type CreateEventProps = {
  isOpen: boolean;
  onCloseClick: (isOpen: false) => void; // Always receives 'false' as an argument. Use this to close the modal
  // Will be used to set initial date
  initialStartDate?: Date;
  initialEndDate?: Date;
  onSuccess?: (newEventData: CalendarEventType) => void;
};

const CreateEvent = ({
  isOpen,
  onCloseClick,
  initialStartDate,
  initialEndDate,
  onSuccess,
}: CreateEventProps) => {
  /**
   * This will be a modal component
   */
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const [isLoading, setIsLoading] = useState(false);

  const { userApi } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    loading("Saving calendar event. Please wait...");

    try {
      setIsLoading(true);
      const res_data = await createCalendarEventApi(userApi, formData);
      update({
        render: "Save succesful.",
        type: "success",
      });
      onSuccess && onSuccess(res_data);
    } catch (error) {
      update({
        render: "Save unsuccesful. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Create Event"
      onClose={() => onCloseClick(false)}
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <Input
          type="datetime-local"
          name="start"
          labelText="Start date"
          defaultValue={
            initialStartDate && formatDateTimeLocalPST(initialStartDate)
          }
          required
          disabled={isLoading}
        />
        <Input
          type="datetime-local"
          name="end"
          labelText="End date"
          required
          defaultValue={
            initialEndDate && formatDateTimeLocalPST(initialEndDate)
          }
          disabled={isLoading}
        />
        <Input name="title" labelText="Title" required disabled={isLoading} />
        <TextArea
          labelText="Event Description"
          placeholder="Event description..."
          name="description"
          disabled={isLoading}
        />
        <Input name="location" labelText="Location" disabled={isLoading} />
        <div className="flex justify-between mt-2">
          <Button type="submit" disabled={isLoading}>
            Create Event
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default CreateEvent;
