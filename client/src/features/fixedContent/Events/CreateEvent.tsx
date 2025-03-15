import { useRef, useState } from "react";
import { Id } from "react-toastify";

import { Button, Input } from "../../../components/ui";
import Accordion, { AccordionItem } from "../../../components/ui/Accordion";

import useLoadingToast from "../../../hooks/useLoadingToast";
import { useAuth } from "../../../context/AuthProvider";

import { createUpcomingEventApi } from "../../../api/fixedContentRquests";
import { UpcomingEventType } from "../../../types/FixedContentTypes";

type CreateEventProps = {
  onSuccess?: (new_obj: UpcomingEventType) => void;
};

const CreateEvent = ({ onSuccess }: CreateEventProps) => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    loading("Saving new event. Please wait...");

    try {
      setIsLoading(true);
      const res_data = await createUpcomingEventApi(userApi, formData);
      if (onSuccess) onSuccess(res_data);
      update({
        render: "New Event added.",
        type: "success",
      });
      formRef.current?.reset();
    } catch (error) {
      console.log(error);

      update({
        render: "Failed to save. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <Accordion>
        <AccordionItem title="Add New Event" isOpenInit={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              labelText="Event Name"
              name="name"
              placeholder="Event Name (e.g. Organization Election, Unigames 2025)"
              required
              maxLength={64}
              helpText={["Up to 64 characters allowed."]}
              disabled={isLoading}
            />
            <Input
              type="date"
              labelText="Event Date"
              name="date"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mt-2">
            <Button type="submit" disabled={isLoading}>
              Submit
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </form>
  );
};
export default CreateEvent;
