import { useRef, useState } from "react";
import axios from "axios";
import { Id } from "react-toastify";

import { Button, Input, TextArea } from "../../components/ui";

import { useAuth } from "../../context/AuthProvider";
import useLoadingToast from "../../hooks/useLoadingToast";

import { createEventApi } from "../../api/calendarRequest";

type CreateCalendarEventProps = {
  onSuccess?: () => void; // Update this if there is a use case for the new data. So far none
};

const CreateCalendarEvent = ({ onSuccess }: CreateCalendarEventProps) => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    loading("Saving event. Please wait...");

    try {
      setIsLoading(true);
      await createEventApi(userApi, formData);
      update({
        render: "Event created.",
        type: "success",
      });
      onSuccess && onSuccess();
      formRef.current?.reset();
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        update({
          render: "Unexpected error occured. Please try again.",
          type: "error",
        });
        return;
      }

      const err = error.response?.data;

      if (!err) {
        update({
          render: "Unexpected error occured. Please try again.",
          type: "error",
        });
        return;
      }

      update({
        render: err.message || "Failed to save. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col">
      <h2 className="text-center text-xl font-bold">Add New Event</h2>
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <Input
          labelText="Start"
          type="datetime-local"
          name="start-time"
          required
          disabled={isLoading}
        />
        <Input
          labelText="End"
          type="datetime-local"
          name="end-time"
          required
          disabled={isLoading}
        />
        <Input
          labelText="Event Name"
          name="event-name"
          required
          placeholder="Event name (e.g. CpE Elections, 4th Year Meeting)"
          disabled={isLoading}
        />
        <Input
          labelText="Event Location"
          name="location"
          required
          placeholder="Location (e.g. COE Grounds, Room 215)"
          disabled={isLoading}
        />
        <TextArea
          labelText="Event Description"
          placeholder="Event description..."
          name="description"
          disabled={isLoading}
        />
        <div className="text-right">
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
};
export default CreateCalendarEvent;
